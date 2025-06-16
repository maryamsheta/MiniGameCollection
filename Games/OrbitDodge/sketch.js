let angle = 0;
let direction = 1;

let bullets = [];
let bulletSpeed = 5;

let lastSpawnTime = 0;
let spawnRate = 500;

let score = 0;
let highScore = 0;

let state = "MENU";

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("Jersey 10");
  textSize(42);
  textAlign(CENTER, CENTER);

  let storedScore = localStorage.getItem("orbitDodgeHighScore");
  highScore = storedScore ? parseInt(storedScore) : 0;
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  if (state === "MENU") {
    fill(255);
    textSize(42);
    text("Orbit Dodge", 0, -50);
    textSize(32);
    text(`High Score: ${highScore}`, 0, -10);
    text("Tap to Start", 0, 50);
    return;
  }

  if (state === "PLAYING") {
    if (millis() - lastSpawnTime >= spawnRate) {
      spawnBullet();
      lastSpawnTime = millis();
    }

    fill(128);
    noStroke();
    circle(0, 0, 10);

    noFill();
    stroke(255);
    strokeWeight(1);
    circle(0, 0, 200);

    angle += 0.05 * direction;
    let px = cos(angle) * 100;
    let py = sin(angle) * 100;

    fill(255);
    noStroke();
    circle(px, py, 20);

    bullets.forEach((bullet) => {
      bullet.distance -= bullet.speed;
      let bx = cos(bullet.angle) * bullet.distance;
      let by = sin(bullet.angle) * bullet.distance;

      stroke(255, 0, 0);
      strokeWeight(bullet.size);
      point(bx, by);

      let d = dist(px, py, bx, by);
      if (d < 20 / 2 + bullet.size / 2) {
        endGame();
      }

      if (dist(0, 0, bx, by) <= 10) {
        score++;
        bullet.distance = -1;
      }
    });

    bullets = bullets.filter((b) => b.distance > 0);
  }

  if (state === "GAMEOVER") {
    noStroke();
    fill(255);
    textSize(42);
    text("Game Over", 0, 0);
    textSize(32);
    text("Tap to Restart", 0, 50);
  }

  if (state !== "MENU") {
    noStroke();
    fill(255);
    textSize(42);
    text(`Score: ${score}`, 0, -height / 2 + 50);
    text(`High Score: ${highScore}`, 0, height / 2 - 50);
  }
}

function touchStarted() {
  if (state === "MENU") {
    state = "PLAYING";
    resetGame();
  } else if (state === "PLAYING") {
    direction *= -1;
  } else if (state === "GAMEOVER") {
    state = "PLAYING";
    resetGame();
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
  bullets = [];
  angle = 0;
  direction = 1;
  score = 0;
  bulletSpeed = 5;
  lastSpawnTime = millis();
  loop();
}

function endGame() {
  state = "GAMEOVER";
  noLoop();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("orbitDodgeHighScore", highScore);
  }
}

function spawnBullet() {
  if (state !== "PLAYING") return;
  let a = random(TWO_PI);
  bullets.push({
    angle: a,
    distance: max(width, height) + 200,
    speed: random(1, 10),
    size: random([10, 15, 20]),
  });
}
