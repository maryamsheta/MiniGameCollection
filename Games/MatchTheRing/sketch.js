let win = false;
let allow = true;
let score, textAppear;
let playerCircle, targetCircle;
let growthRate;
let resetBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont("Jersey 10")
  textSize(36);
  resetGame();
  resetBtn = createElement("i")
    .class("fa fa-refresh")
    .mouseClicked(() => resetGame());
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  drawCircle("target");
  drawCircle("player");

  if ((mouseIsPressed || touches.length > 0) && allow) {
    playerCircle += growthRate * (deltaTime / 16);
  }

  if (!allow) {
    drawCircle("targetFinish");
  } else {
    drawStartText();
  }
}

function mouseReleased() {
  handleInputRelease();
}

function touchEnded() {
  handleInputRelease();
}

function handleInputRelease() {
  if (allow) {
    endGame();
  }
}

function drawStartText() {
  fill(255);
  noStroke();
  text("MATCH THE RING!", 0, height - height / 1.5);
}

function drawCircle(type) {
  stroke(255);

  if (type === "target") {
    noFill();
    circle(0, 0, targetCircle);
  } else if (type === "player") {
    fill(255);
    circle(0, 0, playerCircle);
  } else if (type === "targetFinish") {
    let strokeColor = win ? "#00ff00" : "#ff0000";
    stroke(strokeColor);
    noFill();
    circle(0, 0, targetCircle);

    fill(255);
    noStroke();
    text(textAppear, 0, height - height / 1.5);
  }
}

function endGame() {
  allow = false;
  score = (playerCircle / targetCircle) * 100;

  if (Math.abs(playerCircle - targetCircle) <= 1) {
    textAppear = "PERFECT!";
    win = true;
  } else if (score % 100 >= 90) {
    textAppear = "SO CLOSE!";
  } else {
    textAppear = "TRY AGAIN!";
  }
}

function resetGame() {
  win = false;
  allow = true;
  playerCircle = 0;
  targetCircle = random(windowHeight / 4, windowHeight / 2);
  growthRate = targetCircle / 100;
}

function resizeWindow() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame();
}
