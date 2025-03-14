let squareSize;
let angles = [0, 90, -90, 180];
let anglesInit = [0, 90, -90, 180];
let moving = [true,true,true,true];
let placed = [false, false, false, false];

let centerX, centerY;
let angleIncrement = 2;

let gameStarted = false;
let resetBtn;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(handleClick);
  textFont("Jersey 10");
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  resetGame();
  resetBtn = createElement("i").class("fa fa-refresh").mouseClicked(() =>resetGame());
}

function draw() {
  background(0);
  drawGrid();
  drawSquares();
  updateAngles();
  drawGameName();
}

function drawGrid() {
  noFill();
  stroke(255);
  line(
    centerX + squareSize,
    centerY,
    centerX + squareSize,
    centerY + squareSize * 2
  );
  line(
    centerX,
    centerY + squareSize,
    centerX + squareSize * 2,
    centerY + squareSize
  );
  square(centerX, centerY, squareSize * 2);
}

function updateAngles() {
  for (let i = 0; i < angles.length; i++) {
    if (moving[i]) {
      angles[i] = (angles[i] + angleIncrement) % 360;
    } else if (shouldStop(i)) {
      angles[i] = anglesInit[i];
      placed[i] = true;
    }
  }
}

function shouldStop(index) {
  return Math.abs(angles[index] - anglesInit[index]) % 360 <= 10;
}

function drawSquares() {
  const allStoppedAtZero = placed.every(Boolean);
  fill(allStoppedAtZero ? color(0, 255, 0) : color(255));
  noStroke();

  drawSquare(centerX, centerY, angles[0]);
  drawSquare(centerX + squareSize * 2, centerY, angles[1]);
  drawSquare(centerX, centerY + squareSize * 2, angles[2]);
  drawSquare(centerX + squareSize * 2, centerY + squareSize * 2, angles[3]);
}

function drawSquare(x, y, rotationAngle) {
  push();
  translate(x, y);
  rotate(rotationAngle);
  square(0, 0, squareSize);
  pop();
}

function drawGameName() {
  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(36);
  text("PLACE ALL TILES", width / 2, height - height / 7);
}

function handleClick() {
  let col = floor((mouseX - centerX) / squareSize);
  let row = floor((mouseY - centerY) / squareSize);
  let index = row * 2 + col;
  if (index >= 0 && index < 4 && !placed[index]) moving[index] = !moving[index];
}

function resetGame() {
  squareSize = windowHeight / 6;
  centerX = width / 2 - squareSize;
  centerY = height / 2 - squareSize;

  for (let i = 0; i < angles.length; i++) {
    angles[i] = int(random(0, 360));
    placed[i] = false;
    moving[i] = true;
  }
}

function resizeWindow() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame();
}
