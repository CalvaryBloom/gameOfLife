# Juego de la Vida — Proyecto

Una implementación sencilla y didáctica del Juego de la Vida de Conway, pensada para practicar DOM, Canvas y lógica de autómatas celulares.

---

✨ Características principales

- Canvas pixelado para visualizar celdas vivas/muertas.
- Implementación de la lógica del juego (vecindad Moore, reglas clásicas).
- Controles para pausar/reanudar, limpiar y rellenar aleatoriamente.
- Patrones clásicos implementados: **Blinker**, **Toad**, **Beacon** y **Glider** (coloca en coordenadas elegidas).

---

## Vista rápida

1. Abre `index.html` en tu navegador.
2. Usa los botones para colocar patrones en posiciones por defecto o limpiar/reiniciar el tablero.
3. Pulsa la barra espaciadora para pausar/reanudar la simulación.

---

## Controles

- Limpiar: borra todas las células.
- Reiniciar: rellena el tablero aleatoriamente (20% por defecto).
- Blinker @ (5,5): coloca un Blinker en la coordenada (fila 5, columna 5).
- Toad @ (10,10): coloca un Toad en la coordenada (fila 10, columna 10).
- Beacon @ (15,20): coloca un Beacon en la coordenada (fila 15, columna 20).
- Glider @ (2,2): coloca un Glider en la coordenada (fila 2, columna 2).
- Barra espaciadora: pausar/reanudar la simulación.

> Nota: las coordenadas están en celdas (fila, columna). Puedes cambiar las coordenadas editando los atributos `onclick` en `index.html` o llamar a las funciones desde la consola del navegador, p. ej. `placeGlider(20,30)`.

---

## Patrones implementados

- Blinker: oscilador de periodo 2 (tres celdas en línea).
- Toad: oscilador clásico compuesto por dos filas de 3 celdas desplazadas.
- Beacon: par de bloques que oscilan creando una esquina que parpadea.
- Glider: patrón que se desplaza diagonalmente por el tablero.

Puedes añadir más patrones creando funciones similares que marquen celdas con `1` y llamando a `draw()`.

---

## Estructura de archivos

- `index.html` — página principal y controles.
- `js/Ejercicio_5.js` — lógica del Juego de la Vida para el ejercicio 5 (patrones).
- `js/Ejercicio_4.js`, `js/main.js` — otras versiones/ejercicios (con lógica similar).

---

## Cómo añadir un patrón nuevo

1. En `js/Ejercicio_5.js` añade una función que use `setCell(r, c, 1)` para colocar las células donde quieras.
2. Llama a `draw()` al final de la función para refrescar el canvas.
3. Si quieres un botón, añade en `index.html` un botón con `onclick="placeMiPatron(fila,col)"`.

Ejemplo (en consola):

```
// colocar un glider en (20,30)
placeGlider(20, 30);
```

---

## Siguientes mejoras (ideas)

- Añadir interfaz para elegir coordenadas dinámicamente (input número o click en canvas).
- Permitir arrastrar/dibujar con el ratón.
- Guardar/recuperar configuraciones (JSON) y exportar imágenes.
- Añadir más patrones (LWSS, Pulsar, Gosper glider gun).

---

## Tema claro / oscuro

La interfaz incluye un botón de alternancia en la cabecera que permite cambiar entre modo oscuro y modo claro. La elección se guarda en `localStorage`, por lo que el tema seleccionado se recuerda entre sesiones.

- Haz clic en el botón de la esquina superior derecha de la tarjeta para alternar.
- El tema por defecto respeta la preferencia del sistema si no has establecido ninguno manualmente.

