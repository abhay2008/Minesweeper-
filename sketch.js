let cells;
let numC = 10;
let numR = 10;
let bombs = 15;
let numB;
let backgroundImg;
let size;
let timer = 60 * 60 * 10;
let gameInfo = true;
let gameStarted = false;
let gameOver = false;
let gameWon = false;
let LAcells = false;
let rules = `- Click on a cell to reveal it.
It will show if the cell is bombed, and, if it isn't bombed,
it will show the number of neighbours that are bombed.
- Press P to flag a cell that you know is bombed.
- If you click a cell that has no bombed neighbours,
all of it's neighbours will get revealed.
- The goal is to deduce which cells are bombed,
without revealing (stepping on) a single bomb.`;

function preload() {
  backgroundImg = loadImage("grass.png");
  gameOverImg = loadImage("GameOver.png");
  winImg = loadImage("win.jpg");
  winS = loadSound("win.mp3");
  loseS = loadSound("lose.wav");
  clickS = loadSound("click.wav");
  flagS = loadSound("flag.wav");
}

function setup() {
  createCanvas(1280, 720);

  size = height / numR;

  resetGrid();
}

function draw() {
  background(backgroundImg);

  if (gameInfo && !gameStarted && !gameWon && !gameOver) {
    textAlign(CENTER, CENTER);
    push();
    textSize(60);
    strokeWeight(7);
    stroke(0);
    fill("sienna");
    text("Welcome to the Minesweeper Game!!", width / 2, height / 4 - 100);
    stroke(78, 28, 58);
    text("Welcome to the Minesweeper Game!!", width / 2 + 5, height / 4 - 97);
    stroke("deeppink");
    fill("hotpink");
    text("Press Space to start the Game!!", width / 2, height / 2 - 130);
    stroke("mistyrose");
    text("Press Space to start the Game!!", width / 2 + 5, height / 2 - 128);
    textSize(30);
    strokeWeight(4);
    fill("sienna");
    stroke("saddlebrown");
    text("Rules of the game : ", width / 2 - 50, height / 2 - 40);
    strokeWeight(4);
    stroke(0);
    text("Rules of the game : ", width / 2 - 47, height / 2 - 38);
    stroke(0);
    text(rules, width / 2, height / 2 + 140);
    fill("khaki");
    strokeWeight(4);
    strokeWeight(4);
    text(rules, width / 2 + 3, height / 2 + 142);
    pop();
  }

  if (gameStarted && !gameOver && !gameWon && !gameInfo) {
    for (let column of cells) {
      for (let cell of column) {
        cell.render();
      }
    }
    textSize(50);
    strokeWeight(7);
    if (numB >= 10) {
      stroke("crimson");
    } else if (numB >= 5) {
      stroke("gold");
    } else {
      stroke("lime");
    }

    text("Bombs left : " + numB, width - 300, height / 4);
    if (!LAcells) {
      if (timer > 60 * 60 * 5) {
        stroke("lime");
      } else if (timer > 60 * 60 * 2) {
        stroke("gold");
      } else {
        stroke("crimson");
      }
      text("Time Left ---  " + formatTimer(), width - 300, height / 4 + 150);

      if (timer > 0) {
        timer--;
      }
      if (timer <= 0) {
        gameOver = true;
        gameStarted = false;
        gameInfo = false;
        gameWon = false;
        loseS.play();
      }
    }
  }

  if (gameOver && !gameInfo && !gameStarted && !gameWon) {
    background(gameOverImg);
    push();
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255, 102, 255);
    stroke(200, 0, 102);
    text("Press Enter to play again!", width / 2, height / 2 + 250);
    text("Or press 'r' to see where the bombs were!", width / 2, height / 2 + 300);
    pop();
  }

  if (gameWon && !gameOver && !gameStarted && !gameInfo) {
    push();
    background(winImg);
    fill(255, 102, 255);
    textSize(40);
    stroke(200, 0, 102);
    text("Press Enter to play again!", width / 4, height / 2 + 250);
    pop();
  }
}

function create2DArray() {
  let arr = Array(numC);
  for (let i = 0; i < numC; i++) {
    let column = Array(numC);
    for (let j = 0; j < numR; j++) {
      column[j] = new Cell(i, j, size, size);
    }
    arr[i] = column;
  }
  return arr;
}

function keyPressed() {
  if (key === 'p' && !LAcells) {
    let i = floor(mouseX / size);
    let j = floor(mouseY / size);
    cells[i][j].flag();
    flagS.play();
  }

  if (keyCode === ENTER) {
    resetGrid();
    timer = 60 * 60 * 10;
    gameInfo = true;
    gameStarted = false;
    gameOver = false;
    gameWon = false;
    numB = bombs;
  }

  if (key === ' ') {
    gameInfo = false;
    gameStarted = true;
    gameWon = false;
    gameOver = false;
  }

  if (key === 'r') {
    revealAllCells();
    gameOver = false;
    gameStarted = true;
    gameInfo = false;
    gameWon = false;
  }
}

function mousePressed() {
  if (gameStarted && !gameWon && !gameOver && !gameInfo) {
    let i = floor(mouseX / size);
    let j = floor(mouseY / size);
    cells[i][j].reveal();
    cells[i][j].countN();
    clickS.play();
  }
}

function formatTimer() {
  let sec = floor(timer / 60);
  let min = floor(sec / 60);
  sec -= 60 * min;
  return min + " : " + sec;
}

function revealAllCells() {
  for (let column of cells) {
    for (let cell of column) {
      cell.reveal();
    }
  }
  LAcells = true;
}

function createBombs() {
  numB = 0;
  while (numB < bombs) {
    let i = floor(random(numC));
    let j = floor(random(numR));
    if (!cells[i][j].bombed) {
      cells[i][j].bombed = true;
      numB++;
    }
  }
}

function resetGrid() {
  cells = create2DArray();
  createBombs();
}

function checkWin() {
  let valid = true;
  for (let column of cells) {
    for (let cell of column) {
      if (cell.flagged && !cell.bombed) {
        valid = false;
      }
    }
  }

  if (valid && numB === 0) {
    return true;
  } else {
    return false;
  }
}