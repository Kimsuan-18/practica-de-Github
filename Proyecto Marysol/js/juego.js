  let matrix = shuffleMatrix()
 // let matrix = [
 // [ '1.jpg', '2.jpg', '3.jpg',],
 // [ '4.jpg', '5.jpg', '6.jpg',],
 // ['7.jpg', '', '8.jpg',],
// ]
let board = document.querySelector('.board');
let startBtn = document.querySelector('#start');
let firstScreen = document.querySelector('.first-screen');
let starBtnContainer = document.querySelector('.starBtn-container');
let counterElement = document.querySelector('.counter')
let counter = 60;
let playerWin = false;

// Animacion de botones
startBtn.addEventListener('mousedown', ()=>{
    startBtn.style.top = '4px';
})
startBtn.addEventListener('mouseup', ()=>{
    startBtn.style.top = '0px';
})

// Presionar boton y jugar de nuevo
startBtn.addEventListener('click', ()=>{
    starBtnContainer.style.display = 'none';
    firstScreen.style.display = 'none';
    counterElement.style.display = 'block';
    matrix = shuffleMatrix()
   //  let matrix = [
 // [ '1.jpg', '2.jpg', '3.jpg',],
 // [ '4.jpg', '5.jpg', '6.jpg',],
 // ['7.jpg', '', '8.jpg',],
 // ]

  drawTokens();
  counter = 60;
  playerWin = false;
  startCounter();
  addEventListeners();
})




function drawTokens(){
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
    function addEventListeners() {
        let tokens = document.querySelectorAll('.token');
        tokens.forEach(token => token.addEventListener('click', () => {
          let imgSrc = token.querySelector('img').src.split('/').pop(); // Obtener el nombre de la imagen
          let actualPosition = searchPosition(imgSrc);
          let emptyPosition = searchPosition('');
          let movement = cantItMove(actualPosition, emptyPosition);
      
          if (movement) {
            updateMatrix(imgSrc, actualPosition, emptyPosition);
      
            let result = compareMatrix();
            if (result) {
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
      

function searchPosition(element){
    let rowIndex = 0;
    let columnIndex = 0;
matrix.forEach((row, index )=> {
    let rowElement = row.findIndex(item => item == element)
    if(rowElement !== -1){
        rowIndex = index;
        columnIndex = rowElement;
    }
})
return [rowIndex, columnIndex]
}
function cantItMove(actualPosition, emptyPosition) {
    if (actualPosition[1] === emptyPosition[1] && Math.abs(actualPosition[0] - emptyPosition[0]) === 1) {
        return true;
    }
      if (actualPosition[0] === emptyPosition[0] && Math.abs(actualPosition[1] - emptyPosition[1]) === 1) {
        return true;
    }
  
    return false; 
  }
  
function updateMatrix(element, actualPosition, emptyPosition){
  matrix[actualPosition[0]][actualPosition[1]] = ''
  matrix[emptyPosition[0]][emptyPosition[1]] = element
}

function shuffleMatrix(){
    let shuffledMatrix = [[], [], []];
    let array = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg','' ]
        let shuffledArray = array.sort(() => Math.random() - 0.5); 

    let row = 0, column = 0;
    shuffledArray.forEach((element) => {
        shuffledMatrix[row].push(element);
        column = (column + 1) % 3;
        if (column === 0) row++;
    });

    return shuffledMatrix;
}
function compareMatrix(){
    let counter = 0;
    let finalMatrix = [
        [ '1.jpg', '2.jpg', '3.jpg',],
        [ '4.jpg', '5.jpg', '6.jpg',],
        ['7.jpg', '8.jpg',''],      
    ]
    matrix.forEach((row, indexRow) => {
        row.forEach((element, indexColum) =>{
            if(element == finalMatrix[indexRow][indexColum]){
                counter++
            }
        })
    })
    if (counter == 9){
        return true
    }else{
        return false
    }
}

// contador
function startCounter(){
    let counterId = setInterval(()=>{
        counter--
    
        if(counter <= 0){
            clearInterval(counterId);
            counterElement.style.display = 'none';
            board.innerHTML = '<p class="game-over">Se acabo el tiempo!</p>'
            starBtnContainer.style.display = 'block';
            startBtn.innerText = "jugar de nuevo";
        }else{
            counterElement.innerText = counter; 
        }
        if(playerWin == true){
            clearInterval(counterId);
            counterElement.style.display = 'none';
        }

    }, 1000)
}