const nextButton1 = document.getElementById("next-button1");
const nextButton2 = document.getElementById("next-button2");
const startGameButton = document.getElementById("start-game-btn");
const screenOne = document.getElementById("intro-screen1");
const screenTwo = document.getElementById("intro-screen2");
const startGameScreen = document.getElementById("start-game-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("gameover-screen");
const winScreen = document.getElementById("win-screen");
const MAX_LIVES = 3;
const player = new Player();
const enemies = [];



let lives = MAX_LIVES;
let spawnTimer = null;
let loopIntervalId = null;
let isGameActive = false;

const allScreens = [
  screenOne,
  screenTwo,
  startGameScreen,
  gameScreen,
  gameOverScreen,
  winScreen,
];

function showScreen(targetScreen) {
  allScreens.forEach((screen) => {
    screen.style.display = "none";
  });
  targetScreen.style.display = "flex";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



const livesHud = document.createElement("div");
livesHud.className = "lives-hud";
gameScreen.appendChild(livesHud);



function renderLives() {
  const filledHearts = "♥".repeat(Math.max(0, lives));
  const emptyHearts = "♡".repeat(Math.max(0, MAX_LIVES - lives));
  livesHud.textContent = `Lives: ${filledHearts}${emptyHearts}`;
}

function clearEnemies() {
  while (enemies.length > 0) {
    const enemy = enemies.pop();
    if (enemy && enemy.element) {
      enemy.element.remove();
    }
  }
}

function endGame() {
  isGameActive = false;
  clearTimeout(spawnTimer);
  clearInterval(loopIntervalId);
  showScreen(gameOverScreen);
}

function handlePlayerHit(enemyIndex) {
  if (!isGameActive) return;

  const hitEnemy = enemies[enemyIndex];
  if (hitEnemy && hitEnemy.element) {
    hitEnemy.element.remove();
  }
  enemies.splice(enemyIndex, 1);

  lives -= 1;
  renderLives();

  if (lives <= 0) {
    endGame();
  }
}

function getRightmostEnemyEdge() {
  let rightmost = 0;
  for (const enemy of enemies) {
    const rightEdge = enemy.x + enemy.width;
    if (rightEdge > rightmost) {
      rightmost = rightEdge;
    }
  }
  return rightmost;
}

function spawnEnemies() {
  if (!isGameActive) return;

  const count = randomBetween(1, 2);
  const minGap = player.width + 130;
  let nextSpawnX = Math.max(gameScreen.clientWidth, getRightmostEnemyEdge() + minGap);

  for (let i = 0; i < count; i++) {
    const enemy = new Enemy();
    enemy.x = nextSpawnX;
    enemy.element.style.left = `${enemy.x}px`;
    enemies.push(enemy);

    const extraRandomSpace = randomBetween(40, 120);
    nextSpawnX += enemy.width + minGap + extraRandomSpace;
  }

  const nextTime = randomBetween(1400, 2600);
  spawnTimer = setTimeout(spawnEnemies, nextTime);
}

function startNewGame() {
  clearTimeout(spawnTimer);
  clearInterval(loopIntervalId);
  clearEnemies();

  lives = MAX_LIVES;
  renderLives();

  showScreen(gameScreen);
  player.syncToViewport(true);
  isGameActive = true;

  spawnEnemies();

  loopIntervalId = setInterval(() => {
    if (!isGameActive) return;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.move();

      if (areTouching(player, enemy)) {
        handlePlayerHit(i);
        if (!isGameActive) break;
        continue;
      }

      if (enemy.x + enemy.width < 0) {
        enemy.element.remove();
        enemies.splice(i, 1);
      }
    }
  }, 20);
}

window.addEventListener("resize", () => {
  player.syncToViewport(false);

  const floor = gameScreen.querySelector(".floor");
  const floorHeight = floor ? floor.clientHeight : 60;
  enemies.forEach((enemy) => {
    enemy.y = Math.max(0, floorHeight - 2);
    enemy.element.style.bottom = `${enemy.y}px`;
  });
});

document.addEventListener("keydown", (event) => {
  if (!isGameActive) return;

  if (event.code === "Space") {
    player.jump();
  }

  const key = event.key.toLowerCase();
  if (key === "a") {
    player.move(-1);
  }

  if (key === "d") {
    player.move(1);
  }
});

nextButton1.addEventListener("click", () => {
  showScreen(screenTwo);
});

nextButton2.addEventListener("click", () => {
  showScreen(startGameScreen);
});

startGameButton.addEventListener("click", () => {
  startNewGame();
});

renderLives();