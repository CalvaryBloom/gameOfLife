/*
    Juego de la vida de Conway

    Ejercicio 5: Genera un patrones personalizados

        Implementa los patrones clásicos del juego de la vida: Blinker, Toad, Beacon y Glider en un canvas vacio.
        Puedes añadir tantos como quieras en las coordenadas que propongas.

*/
const canvas = document.getElementById('life');
const ctx = canvas.getContext('2d');
// Mejor visibilidad: tamaño de celda (puede cambiarse en tiempo de ejecución)
let CELL_SIZE = 8;
// color se aplicará en draw() desde las variables CSS para respetar el tema
let COLS = Math.floor(canvas.width / CELL_SIZE);
let ROWS = Math.floor(canvas.height / CELL_SIZE);
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

// Permitir cambiar el tamaño de celda en tiempo de ejecución (recrea un tablero vacío)
function setCellSize(size) {
    CELL_SIZE = Math.max(1, Math.floor(size));
    COLS = Math.floor(canvas.width / CELL_SIZE);
    ROWS = Math.floor(canvas.height / CELL_SIZE);
    grid = createGrid(ROWS, COLS, false);
    draw();
}
window.setCellSize = setCellSize;

function randomize(p = 0.20) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = Math.random() < p ? 1 : 0;
        }
    }
}
// Iniciar el tablero vacío por defecto (sin randomize)

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
    // Actualizar color según tema (usa --accent-2 si existe, si no fallback a '#4f46e5')
    const cssAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent-2') || '';
    ctx.fillStyle = cssAccent.trim() || '#4f46e5';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Celdas vivas (dibujamos con pequeño gap para que se aprecien los píxeles)
    const gap = Math.max(1, Math.floor(CELL_SIZE * 0.12));
    const size = Math.max(1, CELL_SIZE - gap);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, size, size);
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
// Exponer draw() para uso desde otros scripts (por ejemplo al cambiar tema)
window.draw = draw;
// Mostrar contador inicial
const infoEl = document.getElementById('info');
if (infoEl) infoEl.innerText = `Generación: ${generations}`;

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

// no ejecutar step() inmediatamente; el usuario colocará patrones o iniciará la simulación
let running = true;
// controlar velocidad (ajustable)
let TARGET_FPS = 8;
let FRAME_INTERVAL = 1000 / TARGET_FPS;
let lastTime = 0;
function loop(time) {
    requestAnimationFrame(loop);
    if (!running) return;
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    if (delta >= FRAME_INTERVAL) {
        step();
        lastTime = time - (delta % FRAME_INTERVAL);
    }
}
requestAnimationFrame(loop);

function setFPS(fps) {
    TARGET_FPS = Math.max(1, Math.min(60, Math.floor(fps)));
    FRAME_INTERVAL = 1000 / TARGET_FPS;
}
window.setFPS = setFPS;
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
