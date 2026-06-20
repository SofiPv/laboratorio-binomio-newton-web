const coefAInput = document.getElementById("coefA");
const varAInput = document.getElementById("varA");
const coefBInput = document.getElementById("coefB");
const varBInput = document.getElementById("varB");
const powerNInput = document.getElementById("powerN");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const presetButtons = document.querySelectorAll(".preset-btn");

const binomialTitle = document.getElementById("binomialTitle");
const expandedResult = document.getElementById("expandedResult");
const stepsList = document.getElementById("stepsList");
const termsTable = document.getElementById("termsTable");
const pascalTriangle = document.getElementById("pascalTriangle");
const statusBadge = document.getElementById("statusBadge");
const rowInfo = document.getElementById("rowInfo");

let lastPlainResult = "";

const presets = {
  xy4: { coefA: 1, varA: "x", coefB: 1, varB: "y", n: 4 },
  ab6: { coefA: 2, varA: "a", coefB: 3, varB: "b", n: 6 },
  xy5: { coefA: 2, varA: "x", coefB: 1, varB: "y", n: 5 }
};

function init() {
  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(lastPlainResult);
    copyBtn.textContent = "Copiado";
    setTimeout(() => copyBtn.textContent = "Copiar resultado", 1200);
  });

  downloadBtn.addEventListener("click", downloadSummary);

  presetButtons.forEach(button => {
    button.addEventListener("click", () => {
      const preset = presets[button.dataset.preset];

      coefAInput.value = preset.coefA;
      varAInput.value = preset.varA;
      coefBInput.value = preset.coefB;
      varBInput.value = preset.varB;
      powerNInput.value = preset.n;

      generate();
    });
  });

  renderPascalTriangle(4);
  generate();
}

function generate() {
  const config = readConfig();
  const row = pascalRow(config.n);
  const terms = buildTerms(config, row);
  const expressionLatex = buildExpansionLatex(config, terms);
  const expressionPlain = buildExpansionPlain(config, terms);

  binomialTitle.innerHTML = `\\[${buildBinomialLatex(config)}\\]`;
  expandedResult.innerHTML = `\\[${expressionLatex}\\]`;

  statusBadge.textContent = `n = ${config.n}`;
  rowInfo.textContent = `Fila activa: n = ${config.n}`;

  renderSteps(config, row, terms);
  renderTermsTable(terms);
  renderPascalTriangle(config.n);

  lastPlainResult = buildPlainSummary(config, row, terms, expressionPlain);

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function readConfig() {
  const coefA = Number(coefAInput.value);
  const coefB = Number(coefBInput.value);
  const n = Math.max(0, Math.min(15, Number(powerNInput.value)));

  let varA = sanitizeVariable(varAInput.value, "x");
  let varB = sanitizeVariable(varBInput.value, "y");

  powerNInput.value = n;
  varAInput.value = varA;
  varBInput.value = varB;

  return { coefA, varA, coefB, varB, n };
}

function sanitizeVariable(value, fallback) {
  const clean = value.trim().replace(/[^a-zA-Z]/g, "");

  return clean || fallback;
}

function pascalRow(n) {
  const row = [];

  for (let k = 0; k <= n; k++) {
    row.push(combination(n, k));
  }

  return row;
}

function combination(n, k) {
  if (k < 0 || k > n) return 0;

  let result = 1;

  for (let i = 1; i <= k; i++) {
    result = result * (n - i + 1) / i;
  }

  return Math.round(result);
}

function buildTerms(config, row) {
  const terms = [];

  for (let k = 0; k <= config.n; k++) {
    const r = k + 1;
    const expA = config.n - k;
    const expB = k;
    const combinacion = row[k];
    const numericCoefficient =
      combinacion *
      Math.pow(config.coefA, expA) *
      Math.pow(config.coefB, expB);

    terms.push({
      r,
      k,
      expA,
      expB,
      combinacion,
      numericCoefficient,
      latex: termLatex(numericCoefficient, config.varA, expA, config.varB, expB),
      plain: termPlain(numericCoefficient, config.varA, expA, config.varB, expB),
      rawLatex: `\\binom{${config.n}}{${k}}(${formatFactorLatex(config.coefA, config.varA)})^{${expA}}(${formatFactorLatex(config.coefB, config.varB)})^{${expB}}`
    });
  }

  return terms;
}

function buildBinomialLatex(config) {
  return `(${formatFactorLatex(config.coefA, config.varA)} ${config.coefB < 0 ? "-" : "+"} ${formatFactorLatex(Math.abs(config.coefB), config.varB)})^{${config.n}}`;
}

function buildExpansionLatex(config, terms) {
  const left = buildBinomialLatex(config);
  const right = polynomialLatex(terms);

  return `${left}=${right}`;
}

function buildExpansionPlain(config, terms) {
  const left = `(${formatFactorPlain(config.coefA, config.varA)} ${config.coefB < 0 ? "-" : "+"} ${formatFactorPlain(Math.abs(config.coefB), config.varB)})^${config.n}`;
  const right = polynomialPlain(terms);

  return `${left} = ${right}`;
}

function polynomialLatex(terms) {
  if (terms.length === 0) return "0";

  return terms.map((term, index) => {
    const sign = term.numericCoefficient < 0 ? "-" : "+";
    const absoluteLatex = termLatex(Math.abs(term.numericCoefficient), termVariablePart(term), 0, "", 0, true);

    if (index === 0) {
      return term.numericCoefficient < 0 ? `-${absoluteLatex}` : absoluteLatex;
    }

    return ` ${sign} ${absoluteLatex}`;
  }).join("");
}

function polynomialPlain(terms) {
  return terms.map((term, index) => {
    const sign = term.numericCoefficient < 0 ? "-" : "+";
    const absoluteTerm = termPlain(Math.abs(term.numericCoefficient), termVariablePartPlain(term), 0, "", 0, true);

    if (index === 0) {
      return term.numericCoefficient < 0 ? `-${absoluteTerm}` : absoluteTerm;
    }

    return ` ${sign} ${absoluteTerm}`;
  }).join("");
}

function termVariablePart(term) {
  return [variablePowerLatex(term.varA || currentVarA(), term.expA), variablePowerLatex(term.varB || currentVarB(), term.expB)]
    .filter(Boolean)
    .join("");
}

function termVariablePartPlain(term) {
  return [variablePowerPlain(term.varA || currentVarA(), term.expA), variablePowerPlain(term.varB || currentVarB(), term.expB)]
    .filter(Boolean)
    .join("");
}

function currentVarA() {
  return sanitizeVariable(varAInput.value, "x");
}

function currentVarB() {
  return sanitizeVariable(varBInput.value, "y");
}

function termLatex(coefficient, varA, expA, varB, expB, prebuiltVariable = false) {
  if (coefficient === 0) return "0";

  const abs = Math.abs(coefficient);
  let variablePart = "";

  if (prebuiltVariable) {
    variablePart = varA;
  } else {
    variablePart =
      variablePowerLatex(varA, expA) +
      variablePowerLatex(varB, expB);
  }

  if (!variablePart) {
    return String(abs);
  }

  if (abs === 1) {
    return variablePart;
  }

  return `${abs}${variablePart}`;
}

function termPlain(coefficient, varA, expA, varB, expB, prebuiltVariable = false) {
  if (coefficient === 0) return "0";

  const abs = Math.abs(coefficient);
  let variablePart = "";

  if (prebuiltVariable) {
    variablePart = varA;
  } else {
    variablePart =
      variablePowerPlain(varA, expA) +
      variablePowerPlain(varB, expB);
  }

  if (!variablePart) {
    return String(abs);
  }

  if (abs === 1) {
    return variablePart;
  }

  return `${abs}${variablePart}`;
}

function variablePowerLatex(variable, exponent) {
  if (exponent === 0) return "";

  if (exponent === 1) return variable;

  return `${variable}^{${exponent}}`;
}

function variablePowerPlain(variable, exponent) {
  if (exponent === 0) return "";

  if (exponent === 1) return variable;

  return `${variable}^${exponent}`;
}

function formatFactorLatex(coef, variable) {
  if (coef === 0) return "0";

  if (coef === 1) return variable;

  if (coef === -1) return `-${variable}`;

  return `${coef}${variable}`;
}

function formatFactorPlain(coef, variable) {
  if (coef === 0) return "0";

  if (coef === 1) return variable;

  if (coef === -1) return `-${variable}`;

  return `${coef}${variable}`;
}

function renderSteps(config, row, terms) {
  stepsList.innerHTML = "";

  const steps = [
    `Se identifica la potencia: \\(n=${config.n}\\).`,
    `Se toma la fila \\(n=${config.n}\\) del Triángulo de Pascal: \\(${row.join(", ")}\\).`,
    `Se aplica la fórmula: \\((a+b)^n=\\sum_{k=0}^{n}\\binom{n}{k}a^{n-k}b^k\\).`,
    `Para este binomio: \\(a=${formatFactorLatex(config.coefA, config.varA)}\\) y \\(b=${formatFactorLatex(config.coefB, config.varB)}\\).`,
    `Se construyen los términos desde \\(k=0\\) hasta \\(k=${config.n}\\).`,
    `Resultado final: \\(${polynomialLatex(terms)}\\).`
  ];

  steps.forEach(step => {
    const li = document.createElement("li");
    li.innerHTML = step;
    stepsList.appendChild(li);
  });
}

function renderTermsTable(terms) {
  termsTable.innerHTML = "";

  terms.forEach(term => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${term.r}</td>
      <td>${term.k}</td>
      <td>${term.combinacion}</td>
      <td>\\(${term.rawLatex}=${term.latex}\\)</td>
    `;

    termsTable.appendChild(tr);
  });
}

function renderPascalTriangle(activeN) {
  pascalTriangle.innerHTML = "";

  for (let n = 0; n <= 15; n++) {
    const row = document.createElement("div");
    row.className = "pascal-row";

    if (n === activeN) {
      row.classList.add("active");
    }

    row.title = `Usar n = ${n}`;
    row.addEventListener("click", () => {
      powerNInput.value = n;
      generate();
    });

    pascalRow(n).forEach(value => {
      const number = document.createElement("span");
      number.className = "pascal-number";
      number.textContent = value;
      row.appendChild(number);
    });

    pascalTriangle.appendChild(row);
  }
}

function buildPlainSummary(config, row, terms, expressionPlain) {
  const lines = [];

  lines.push("LABORATORIO DE BINOMIO DE NEWTON");
  lines.push("=================================");
  lines.push("");
  lines.push(`Binomio: ${expressionPlain}`);
  lines.push(`Potencia: n = ${config.n}`);
  lines.push(`Coeficientes de Pascal: ${row.join(", ")}`);
  lines.push("");
  lines.push("Términos:");
  terms.forEach(term => {
    lines.push(`r=${term.r}, k=${term.k}, C=${term.combinacion}: ${term.plain}`);
  });

  return lines.join("\n");
}

function downloadSummary() {
  const blob = new Blob([lastPlainResult], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "desarrollo_binomio_newton.txt";
  link.click();

  URL.revokeObjectURL(url);
}

init();
