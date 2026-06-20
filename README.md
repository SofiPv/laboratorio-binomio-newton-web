# Laboratorio de Binomio de Newton Web

Aplicación web didáctica para generar el Triángulo de Pascal, consultar coeficientes binomiales y desarrollar binomios mediante el Teorema de Newton.

El proyecto transforma una actividad académica sobre el Binomio de Newton en una herramienta interactiva. El usuario puede seleccionar ejercicios, modificar coeficientes, generar la fila correspondiente del Triángulo de Pascal y visualizar el desarrollo completo del binomio.

---

## Objetivo del proyecto

Crear una herramienta visual para practicar el desarrollo de binomios usando combinaciones y coeficientes del Triángulo de Pascal.

El sistema permite:

- Generar el Triángulo de Pascal hasta la potencia 15.
- Seleccionar una fila del triángulo.
- Consultar coeficientes binomiales.
- Desarrollar binomios de la forma `(a + b)^n`.
- Resolver ejercicios predefinidos.
- Crear binomios personalizados.
- Ver el procedimiento paso a paso.
- Consultar la tabla de términos.
- Copiar el resultado.
- Descargar el desarrollo como archivo de texto.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- MathJax
- GitHub Pages

---

## Estructura del repositorio

```text
laboratorio-binomio-newton-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## Ejercicios incluidos

El proyecto incluye accesos rápidos para:

```text
(x + y)^4
(2a + 3b)^6
(2x + y)^5
```

---

## Funciones principales

### Triángulo de Pascal

El sistema genera las primeras 15 potencias del Triángulo de Pascal.

Cada fila puede seleccionarse para cambiar automáticamente la potencia `n` del binomio.

---

### Desarrollo de binomios

El programa desarrolla binomios mediante la fórmula:

```text
(a + b)^n = Σ C(n,k) a^(n-k) b^k
```

También muestra el término r-ésimo:

```text
T_r = C(n,r-1) a^(n-r+1) b^(r-1)
```

---

### Binomios personalizados

El usuario puede modificar:

- Coeficiente A
- Variable A
- Coeficiente B
- Variable B
- Potencia n

---

### Tabla de términos

Para cada término se muestra:

- Número de término `r`
- Valor de `k`
- Coeficiente binomial
- Desarrollo del término

---

## Cómo usar el proyecto

Abre el archivo:

```text
index.html
```

en cualquier navegador moderno.

No requiere instalación de dependencias locales.

---

## Publicación en GitHub Pages

Este proyecto puede publicarse como sitio estático.

Pasos generales:

1. Subir los archivos al repositorio.
2. Entrar a **Settings**.
3. Abrir **Pages**.
4. Seleccionar la rama `main`.
5. Guardar.
6. Abrir el enlace generado por GitHub Pages.

---

## Enfoque académico

Este laboratorio convierte una actividad de matemáticas en una aplicación interactiva.

El propósito es que el usuario observe la relación entre el Triángulo de Pascal, los coeficientes binomiales y el desarrollo algebraico de un binomio.

---

## Autora

**Sofía Pacheco**  
GitHub: [SofiPv](https://github.com/SofiPv)

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
