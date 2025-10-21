/*
    Juego de la vida de Conway

    Ejercicio 5: Genera un patrones personalizados

        Implementa los patrones clásicos del juego de la vida: Blinker, Toad, Beacon y Glider en un canvas vacio.
        Puedes añadir tantos como quieras en las coordenadas que propongas.

*/
const canvas = document.getElementById('life');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 4;
ctx.fillStyle = "blue";
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);
let generations = 0;

// Crea una cuadrícula vacía (0 = muerta, 1 = viva)
function createGrid(rows, cols, fill = false) {
    const g = new Array(rows);
    for (let r = 0; r < rows; r++) {
        g[r] = new Array(cols).fill(fill ? 1 : 0);
    }
    return g;
}
let grid = createGrid(ROWS, COLS, false);

function randomize(p = 0.20) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = Math.random() < p ? 1 : 0;
        }
    }
}
randomize(0.20); // 20% vivas

// --- Patrones clásicos ---
function setCell(r, c, value = 1) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = value;
}

function placeBlinker(r, c) {
    // patrón vertical de 3 celdas (oscilador period 2)
    setCell(r, c, 1);
    setCell(r+1, c, 1);
    setCell(r+2, c, 1);
    draw();
}

function placeToad(r, c) {
    // toad (dos filas desfasadas de 3)
    setCell(r, c+1, 1);
    setCell(r, c+2, 1);
    setCell(r, c+3, 1);
    setCell(r+1, c, 1);
    setCell(r+1, c+1, 1);
    setCell(r+1, c+2, 1);
    draw();
}

function placeBeacon(r, c) {
    // beacon (bloques en esquina que oscilan)
    setCell(r, c, 1);
    setCell(r, c+1, 1);
    setCell(r+1, c, 1);
    setCell(r+2, c+3, 1);
    setCell(r+3, c+2, 1);
    setCell(r+3, c+3, 1);
    draw();
}

function placeGlider(r, c) {
    // glider (se desplaza hacia abajo/derecha)
    setCell(r, c+1, 1);
    setCell(r+1, c+2, 1);
    setCell(r+2, c, 1);
    setCell(r+2, c+1, 1);
    setCell(r+2, c+2, 1);
    draw();
}

// Exponer funciones globalmente para ser llamadas desde HTML
window.placeBlinker = placeBlinker;
window.placeToad = placeToad;
window.placeBeacon = placeBeacon;
window.placeGlider = placeGlider;


function draw(showGrid = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Celdas vivas
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    // Rejilla opcional
    // if (showGrid) {
    //     ctx.beginPath();
    //     for (let x = 0; x <= COLS; x++) {
    //         ctx.moveTo(x * CELL_SIZE, 0);
    //         ctx.lineTo(x * CELL_SIZE, ROWS * CELL_SIZE);
    //     }
    //     for (let y = 0; y <= ROWS; y++) {
    //         ctx.moveTo(0, y * CELL_SIZE);
    //         ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE);
    //     }
    //     ctx.stroke();
    // }
}
draw();

function neighbors(r, c) {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = (r + dr + ROWS) % ROWS;
            const cc = (c + dc + COLS) % COLS;
            n += grid[rr][cc];
        }
    }
    return n;
}
function step() {
    const next = createGrid(ROWS, COLS, false);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const alive = grid[r][c] === 1;
            const n = neighbors(r, c);
            next[r][c] = (alive && (n === 2 || n === 3)) || (!alive && n === 3)
                ? 1 : 0;
        }
    }
    grid = next;
    draw();
    generations++;
    document.getElementById('info').innerText = `Generación: ${generations}`;
}

step(); // prueba una generación

let running = true;
function loop() {
    if (running) {
        step();
    }
    requestAnimationFrame(loop);
}
loop();
// (Espacio) para pausar/reanudar
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { running = !running; e.preventDefault(); console.log(running ? "Simulación en ejecución" : "Simulación pausada"); }
});

function clearAll() {
    grid = createGrid(ROWS, COLS, false);
    generations = 0;
    document.getElementById('info').innerText = `Generación: ${generations}`;
    draw();
}

function resetBtn(p = 0.20) {
    grid = createGrid(ROWS, COLS, false);
    generations = 0;
    randomize(p);
    draw();
}
