const colors = ["red", "green", "blue"];
let currentColorIdx = 0;

let pulses = [];

let spawnRate = 1500;
let lastSpawnTime = 0;
let pulseDuration = 2;

let score = 0;
let lastScoreMilestone = 0;
let highScore = 0;

let state = "MENU";

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentColorIdx = floor(random(colors.length));

  textFont("Jersey 10");
  textSize(42);
  textAlign(CENTER, CENTER);

  let storedScore = localStorage.getItem("ColorSwitchHighScore");
  highScore = storedScore ? parseInt(storedScore) : 0;
}

function draw() {
  background(0);
  noStroke();

  if (state === "MENU") {
    fill(255);
    textSize(42);
    text("Color Switch", width / 2, height / 2 - 50);
    textSize(32);
    text(`High Score: ${highScore}`, width / 2, height / 2 - 10);
    text("Tap to Start", width / 2, height / 2 + 50);
    return;
  }

  if (state === "PLAYING") {
    if (millis() - lastSpawnTime >= spawnRate) {
      spawnPulse();
      lastSpawnTime = millis();
    }

    fill(colors[currentColorIdx]);
    circle(width / 2, height / 2, 50);

    pulses.forEach((pulse) => {
      let elapsed = (millis() - pulse.spawnTime) / 1000;
      let t = constrain(elapsed / pulseDuration, 0, 1);
      let distance = lerp(pulse.startDist, 50, t);

      stroke(colors[pulse.colorIdx]);
      noFill();
      strokeWeight(4);
      circle(width / 2, height / 2, distance);

      if (distance <= 50) {
        if (pulse.colorIdx === currentColorIdx) {
          score++;
        } else {
          state = "GAMEOVER";
          noLoop();
          updateHighScore();
        }
        pulse.hit = true;
      }
    });

    pulses = pulses.filter((pulse) => !pulse.hit);

    if (score > 0 && score % 5 === 0 && score !== lastScoreMilestone) {
      spawnRate = max(500, spawnRate - 100);
      lastScoreMilestone = score;
    }
  }

  if (state === "GAMEOVER") {
    noStroke();
    fill(255);
    textSize(42);
    text("Game Over", width / 2, height / 2);
    textSize(32);
    text("Tap to Restart", width / 2, height / 2 + 50);
  }

  if (state !== "MENU") {
    noStroke();
    fill(255);
    textSize(42);
    text(`Score: ${score}`, width / 2, 50);
    text(`High Score: ${highScore}`, width / 2, height - 50);
  }
}

function touchStarted() {
  if (state === "MENU") {
    state = "PLAYING";
    resetGame();
  } else if (state === "GAMEOVER") {
    resetGame();
    state = "PLAYING";
  } else if (state === "PLAYING") {
    currentColorIdx = (currentColorIdx + 1) % colors.length;
  }
  return false;
}

function touchMoved() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function resetGame() {
  score = 0;
  pulses = [];
  spawnRate = 1500;
  pulseDuration = 2;
  lastScoreMilestone = 0;
  lastSpawnTime = millis();
  currentColorIdx = floor(random(colors.length));
  loop();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("ColorSwitchHighScore", highScore);
  }
}

function spawnPulse() {
  if (state !== "PLAYING") return;
  pulses.push({
    colorIdx: floor(random(colors.length)),
    spawnTime: millis(),
    startDist: max(width, height) + 200,
    hit: false,
  });
}
