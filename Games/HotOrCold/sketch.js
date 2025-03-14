let gridX, gridY, gridSize;
let strokeW = 2;

let circleSize = 20;
let randomX, randomY;

let foundCircle = false;
let clickedPoints = [];

let resetBtn;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(handleClick);
  textFont("Jersey 10");
  textSize(36);
  textAlign(CENTER, CENTER);
  resetGame();
  resetBtn = createElement("i").class("fa fa-refresh").mouseClicked(() =>resetGame());
}

function draw() {
  background(0);

  for (let p of clickedPoints) {
    strokeWeight(10);
    stroke(p.c);
    point(p.x, p.y);
  }

  if (foundCircle) {
    stroke(255);
    strokeWeight(strokeW);
    fill(0);
    circle(randomX, randomY, circleSize);
    drawStats();
  }

  drawGrid();

  drawTitle();
}

function drawTitle() {
  push();
  translate(width / 2 + 5, 0);
  fill(255);
  strokeWeight(1);
  text("FIND THE", -20, height - height / 6);
  noFill();
  strokeWeight(2);
  circle(55, height - height / 5.9, circleSize);
  pop();
}

function drawStats() {
  fill(255);
  strokeWeight(1);
  let tries = clickedPoints.length + 1;
  text(
    `FOUND IN ${tries} ${tries === 1 ? "TRY" : "TRIES"}`,
    width / 2,
    height - height / 8
  );
}

function drawGrid() {
  noFill();
  stroke(255);
  strokeWeight(strokeW);
  square(gridX - strokeW / 2, gridY - strokeW / 2, gridSize * 2);
}

function check() {
  let d = dist(mouseX, mouseY, randomX, randomY);

  let exists = clickedPoints.some((p) => p.x === mouseX && p.y === mouseY);

  if (!exists) {
    if (d <= circleSize / 2) {
      foundCircle = true;
    } else {
      clickedPoints.push({
        x: mouseX,
        y: mouseY,
        c: d <= circleSize * 3 ? "#ff0000" : "#0000ff",
      });
    }
  }
}

function resetGame() {
  foundCircle = false;
  clickedPoints = [];

  gridSize = height / 4;
  gridX = width / 2 - gridSize + strokeW / 2;
  gridY = height / 2 - gridSize + strokeW / 2;

  let padding = circleSize / 2 + strokeW;
  randomX = random(gridX + padding, gridX + gridSize * 2 - padding);
  randomY = random(gridY + padding, gridY + gridSize * 2 - padding);
}

function handleClick() {
  if (
    mouseX >= gridX &&
    mouseX <= gridX + gridSize * 2 &&
    mouseY >= gridY &&
    mouseY <= gridY + gridSize * 2
  ) {
    if (!foundCircle) {
      check();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame();
}
