let matrix = shuffleMatrix(); // Iniciar la matriz mezclada
let board = document.querySelector('.board');
let startBtn = document.querySelector('#start');
let firstScreen = document.querySelector('.first-screen');
let starBtnContainer = document.querySelector('.starBtn-container');
let counterElement = document.querySelector('.counter');
let counter = 60;
let playerWin = false;

// Animación de botones
startBtn.addEventListener('mousedown', () => {
    startBtn.style.top = '4px';
});
startBtn.addEventListener('mouseup', () => {
    startBtn.style.top = '0px';
});

// Botón para reiniciar el juego
startBtn.addEventListener('click', () => {
    starBtnContainer.style.display = 'none';
    firstScreen.style.display = 'none';
    counterElement.style.display = 'block';
    matrix = shuffleMatrix();
    drawTokens();
    counter = 60;
    playerWin = false;
    startCounter();
    addEventListeners();
});

// Dibujar las piezas en el tablero
function drawTokens() {
    board.innerHTML = ''; // Limpiar el tablero antes de redibujarlo
    matrix.forEach((row) => {
        row.forEach((element) => {
            const div = document.createElement('div');
            if (element === '') {
                div.classList.add('empty'); // Para la posición vacía
            } else {
                div.classList.add('token');
                const img = document.createElement('img'); // Crear un elemento de imagen
                img.src = element; // Asignar la imagen correspondiente
                img.alt = 'Pieza del rompecabezas'; // Texto alternativo para la imagen
                div.appendChild(img); // Añadir la imagen al div
            }
            board.appendChild(div); // Añadir el div al tablero
        });
    });
}

// Añadir los event listeners a las piezas
function addEventListeners() {
    let tokens = document.querySelectorAll('.token');
    tokens.forEach((token) => token.addEventListener('click', () => {
        let actualPosition = searchPosition(token); // Encontrar la posición de la pieza
        let emptyPosition = searchPosition(''); // Buscar la posición vacía
        let movement = cantItMove(actualPosition, emptyPosition);
        if (movement !== false) {
            updateMatrix(actualPosition, emptyPosition); // Mover la pieza
            let result = compareMatrix(); // Comprobar si se resolvió el puzzle

            if (result === true) {
                playerWin = true;
                starBtnContainer.style.display = 'block';
                startBtn.innerText = "Jugar de nuevo";
                confetti({
                    particleCount: 150,
                    spread: 180
                });
            }

            drawTokens();
            addEventListeners();
        }
    }));
}

// Buscar la posición de un elemento en la matriz
function searchPosition(element) {
    let rowIndex = 0;
    let columnIndex = 0;

    if (element === '') { // Buscar la posición vacía
        matrix.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                if (cell === '') {
                    rowIndex = rowIdx;
                    columnIndex = colIdx;
                }
            });
        });
    } else { // Buscar la posición de una pieza específica
        matrix.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                if (cell === element.src) { // Usamos src para encontrar la imagen
                    rowIndex = rowIdx;
                    columnIndex = colIdx;
                }
            });
        });
    }

    return [rowIndex, columnIndex];
}

// Comprobar si la pieza puede moverse
function cantItMove(actualPosition, emptyPosition) {
    // Solo puede moverse si está en la misma fila o columna y si es adyacente
    if (actualPosition[0] === emptyPosition[0] && Math.abs(actualPosition[1] - emptyPosition[1]) === 1) {
        return true; // Puede moverse a la izquierda o derecha
    }
    if (actualPosition[1] === emptyPosition[1] && Math.abs(actualPosition[0] - emptyPosition[0]) === 1) {
        return true; // Puede moverse hacia arriba o abajo
    }
    return false;
}

// Actualizar la matriz con el movimiento de la pieza
function updateMatrix(actualPosition, emptyPosition) {
    let temp = matrix[actualPosition[0]][actualPosition[1]];
    matrix[actualPosition[0]][actualPosition[1]] = '';
    matrix[emptyPosition[0]][emptyPosition[1]] = temp;
}

// Mezclar las piezas al inicio
function shuffleMatrix() {
    let shuffledMatrix = [[], [], []];
    let array = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', ''];
    let shuffledArray = array.sort(() => Math.random() - 0.5); // Mezcla las piezas

    let row = 0, column = 0;
    shuffledArray.forEach((element) => {
        shuffledMatrix[row].push(element);
        column = (column + 1) % 3;
        if (column === 0) row++;
    });

    return shuffledMatrix;
}

// Comparar la matriz actual con la solución final
function compareMatrix() {
    let counter = 0;
    let finalMatrix = [
        [ '1.jpg', '2.jpg', '3.jpg',],
        [ '4.jpg', '5.jpg', '6.jpg',],
        ['7.jpg', '8.jpg', ''],  
    ];
    matrix.forEach((row, indexRow) => {
        row.forEach((element, indexColum) => {
            if (element === finalMatrix[indexRow * 3 + indexColum]) {
                counter++;
            }
        });
    });
    return counter === 9;
}

// Contador de tiempo
function startCounter() {
    let counterId = setInterval(() => {
        counter--;

        if (counter <= 0) {
            clearInterval(counterId);
            counterElement.style.display = 'none';
            board.innerHTML = '<p class="game-over">¡Se acabó el tiempo!</p>';
            starBtnContainer.style.display = 'block';
            startBtn.innerText = "Jugar de nuevo";
        } else {
            counterElement.innerText = counter;
        }

        if (playerWin === true) {
            clearInterval(counterId);
            counterElement.style.display = 'none';
        }

    }, 1000);
}
