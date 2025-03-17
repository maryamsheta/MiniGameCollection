let numbers = "123456789".split("");
let numberPlacement = [];
let target;
let clicked = [];

let timer;
let stopwatch = 0;
let gameState = "start";

let gridX, gridY, gridSize;
let resetBtn;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(handleClick);
  textFont("Jersey 10");
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);

  resetBtn = createElement("i")
    .class("fa fa-refresh")
    .mouseClicked(() => resetGame());

  gridSize = height / 4;
  gridX = width / 2 - gridSize;
  gridY = height / 2 - gridSize;

  numbers = shuffle(numbers);
  target = numbers[0];

  numbers.forEach((number) => {
    let fontSize = random(32, 52);
    textSize(fontSize);
    let w = textWidth(number);
    let h = textAscent() + textDescent();

    let x = random(gridX + w / 2, gridX + gridSize * 2 - w / 2);
    let y = random(gridY + h / 2, gridY + gridSize * 2 - h / 2);

    numberPlacement.push({ number, x, y, fontSize });
  });
}

function draw() {
  background(0);
  noStroke();
  fill(255);

  switch (gameState) {
    case "start":
      textSize(36);
      text("CLICK TO START!", width / 2, height / 2);
      break;
    case "playing":
      game();
      break;
    case "end":
      textSize(36);
      text(`FINISHED IN ${stopwatch} SECONDS`, width / 2, height / 2);
      break;
  }

  updateCursor();
}

function game() {
  numberPlacement.forEach((placement) => {
    textSize(placement.fontSize);
    text(placement.number, placement.x, placement.y);
  });

  textSize(36);
  text(`${numbers.join(" ")}`, width / 2, height / 8);
  text(`TIME: ${stopwatch}s`, width / 2, height - height / 8);
}

function drawGrid() {
  stroke(255);
  fill(0);
  square(gridX, gridY, gridSize * 2);
}

function handleClick() {
  if (gameState === "start") {
    gameState = "playing";
    startStopwatch();
  }

  if (gameState === "playing") {
    check();
  }
}

function check() {
  numberPlacement.forEach((placement, index) => {
    let bounds = textBounds(
      placement.number,
      placement.x,
      placement.y,
      placement.fontSize
    );

    if (
      mouseX >= bounds.x &&
      mouseX <= bounds.x + bounds.w &&
      mouseY >= bounds.y &&
      mouseY <= bounds.y + bounds.h
    ) {
      if (placement.number === target) {
        clicked.push(placement.number);
        numberPlacement = numberPlacement.filter(
          (number) => number.number !== placement.number
        );

        target = numbers[numbers.indexOf(target) + 1];

        if (numberPlacement.length === 0) {
          gameState = "end";
          clearInterval(timer);
        }
      }
    }
  });
}

function startStopwatch() {
  if (!timer) {
    timer = setInterval(() => {
      stopwatch++;
    }, 1000);
  }
}

function textBounds(number, x, y, fontSize) {
  textSize(fontSize);
  let w = textWidth(number);
  let h = textAscent() + textDescent();

  return {
    x: x - w / 2,
    y: y - h / 2,
    w: w + 5,
    h: h + 5,
  };
}

function updateCursor() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  let cursorOnText = false;

  numberPlacement.forEach((placement) => {
    let bounds = textBounds(
      placement.number,
      placement.x,
      placement.y,
      placement.fontSize
    );

    if (
      mouseX >= bounds.x &&
      mouseX <= bounds.x + bounds.w &&
      mouseY >= bounds.y &&
      mouseY <= bounds.y + bounds.h
    ) {
      cursorOnText = true;
    }
  });

  if (cursorOnText) {
    cursor("pointer");
  } else {
    cursor("default");
  }
}

function resetGame() {
  gameState = "start";
  stopwatch = 0;
  clicked = [];
  numberPlacement = [];
  numbers = shuffle("123456789".split(""));
  target = numbers[0];

  numbers.forEach((number) => {
    let fontSize = random(32, 52);
    textSize(fontSize);
    let w = textWidth(number);
    let h = textAscent() + textDescent();

    let x = random(gridX + w / 2, gridX + gridSize * 2 - w / 2);
    let y = random(gridY + h / 2, gridY + gridSize * 2 - h / 2);

    numberPlacement.push({ number, x, y, fontSize });
  });

  clearInterval(timer);
  timer = null;
}
