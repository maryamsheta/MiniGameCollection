let gridX, gridY, gridSize;
let strokeW = 2;

let randomCols = [];
let clickedCells = [];

let resetBtn;
let gameState = "start";

let speed;
let offset = 0;
let shiftCount = 0;

let score = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(handleClick);
  textFont("Jersey 10");
  textSize(28);
  textAlign(CENTER, CENTER);

  speed = windowHeight / 200;

  resetBtn = createElement("i")
    .class("fa fa-refresh")
    .mouseClicked(() => resetGame());
}

function draw() {
  background(0);

  switch (gameState) {
    case "start":
      noStroke();
      fill(255);
      text("CLICK TO START!", width / 2, height / 2);
      break;
    case "playing":
      game();
      break;
    case "gameOver":
      noStroke();
      fill(255);
      text("GAME OVER!", width / 2, height / 2);
      text(`SCORE: ${score}`, width / 2, height / 1.8);
      break;
  }
}

function game() {
  drawCells(randomCols.length, 3);

  let cellSize = (gridSize * 2) / 3;
  offset += speed;
  if (offset >= cellSize) {
    offset = 0;
    shiftRows();
  }

  beginClip();
  drawGrid();
  endClip();
  drawGrid();
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

function drawCells(rows, cols) {
  let cellSize = (gridSize * 2) / cols;

  for (let row = 0; row < rows; row++) {
    let randomCol = randomCols[row];

    for (let col = 0; col < cols; col++) {
      let x = gridX + col * cellSize;
      let y = gridY + row * cellSize + offset - cellSize;

      if (clickedCells.some((c) => c.row === row)) {
        noFill();
      } else if (col === randomCol) {
        fill(255);
      } else {
        noFill();
      }

      stroke(255);
      square(x, y, cellSize);
    }
  }
}

function shiftRows() {
  let lastRow = randomCols.length - 1;
  if (lastRow >= 3) {
    if (!clickedCells.some((c) => c.row === lastRow)) {
      gameState = "gameOver";
      return;
    }
    randomCols.pop();
  }

  randomCols.unshift(int(random(3)));

  clickedCells = clickedCells
    .map((c) => ({ row: c.row + 1, col: c.col, locked: c.locked }))
    .filter((c) => c.row < randomCols.length);

  shiftCount++;
  if (shiftCount % 10 === 0) {
    speed += windowHeight / 2000;
  }
}

function handleClick() {
  switch (gameState) {
    case "start":
      gameState = "playing";
      break;

    case "playing":
      let cellSize = (gridSize * 2) / 3;

      for (let row = 0; row < randomCols.length; row++) {
        let randomCol = randomCols[row];

        if (clickedCells.some((c) => c.locked && c.row === row)) continue;

        for (let col = 0; col < 3; col++) {
          let x = gridX + col * cellSize;
          let y = gridY + row * cellSize + offset - cellSize;

          if (
            mouseX >= x &&
            mouseX < x + cellSize &&
            mouseY >= y &&
            mouseY < y + cellSize
          ) {
            if (col !== randomCol) {
              gameState = "gameOver";
            } else {
              clickedCells = clickedCells.filter((c) => c.row !== row);
              clickedCells.push({ row, locked: true });
              score++;
            }
            return;
          }
        }
      }
      break;
  }
}

function resetGame() {
  gameState = "playing";
  shiftCount = 0;
  offset = 0;
  score = 0;
  speed = windowHeight / 200;
  clickedCells = [];
  randomCols = [int(random(3))];
}
