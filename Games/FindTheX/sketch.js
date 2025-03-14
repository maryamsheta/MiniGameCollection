let gridX, gridY, gridSize;
let strokeW = 2;
let cells = [];

let finalLevel = 15;
let startLevel = 6;
let randomRow, randomCol;
let rows = startLevel, cols = startLevel;
let found = false;
let level = 0;

let stopwatch = 0;
let timer;
let resetBtn;
let gameState = "start";

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(handleClick);
  textFont("Jersey 10");
  textSize(28);
  textAlign(CENTER, CENTER);
  resetBtn = createElement("i")
    .class("fa fa-refresh")
    .mouseClicked(() => resetGame());
}

function draw() {
  background(0);

  switch (gameState) {
    case "start":
      drawStartScreen();
      break;
    case "playing":
      drawUI();
      drawGrid();
      drawCells(rows, cols, randomRow, randomCol, found);
      found = false;
      break;
    case "end":
      drawEndScreen();
      break;
  }
}

function drawStartScreen() {
  noStroke();
  fill(255);
  text("CLICK TO START!", width / 2, height / 2);
}

function drawEndScreen() {
  noStroke();
  fill(255);
  text(`FINISHED IN ${stopwatch} SECONDS`, width / 2, height / 2);
}

function drawGrid() {
  gridSize = height / 4;
  gridX = width / 2 - gridSize;
  gridY = height / 2 - gridSize;

  noFill();
  stroke(255);
  strokeWeight(strokeW);
  square(gridX, gridY, gridSize * 2);
}

function drawCells(rows, cols, randomRow, randomCol, found = false) {
  let cellSize = (gridSize * 2) / rows;
  cells = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = gridX + col * cellSize;
      let y = gridY + row * cellSize;

      stroke(255);
      noFill();
      square(x, y, cellSize);

      if (row == randomRow && col == randomCol) {
        fill(found ? "#00ff00" : "#ffffff");
        noStroke();
        text("X", x + cellSize / 2, y + cellSize / 2);
        cells.push({ x, y, cell: [row, col], size: cellSize, secret: true });
      } else {
        fill(255);
        noStroke();
        text("Y", x + cellSize / 2, y + cellSize / 2);
        cells.push({ x, y, cell: [row, col], size: cellSize, secret: false });
      }
    }
  }
}

function drawUI() {
  noStroke();
  fill(255);
  text(
    `LEVEL: ${level + 1}/${finalLevel - startLevel + 1}`,
    width / 2,
    height - height / 5
  );
  text(`TIME: ${stopwatch}s`, width - width / 2, height - height / 6);
}

function handleClick() {
  switch (gameState) {
    case "start":
      startGame();
      break;
    case "playing":
      cells.forEach((cell) => {
        if (
          mouseX >= cell.x &&
          mouseX <= cell.x + cell.size &&
          mouseY >= cell.y &&
          mouseY <= cell.y + cell.size
        ) {
          if (cell.secret) {
            found = true;
            nextLevel();
          }
        }
      });
      break;
  }
}

function startGame() {
  gameState = "playing";
  resetGame();
  startStopwatch();
}

function nextLevel() {
  if (rows < finalLevel && cols < finalLevel) {
    rows++;
    cols++;
    level++;
    randomRow = int(random(rows));
    randomCol = int(random(cols));
  } else {
    gameState = "end";
    clearInterval(timer);
  }
}

function startStopwatch() {
  if (!timer) {
    timer = setInterval(() => {
      stopwatch++;
    }, 1000);
  }
}

function resetGame() {
  clearInterval(timer);
  timer = null;
  level = 0;
  rows = startLevel;
  cols = startLevel;
  found = false;
  stopwatch = 0;
  randomRow = int(random(rows));
  randomCol = int(random(cols));
  if (gameState === "playing") startStopwatch();
  if (gameState === "end") startGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
