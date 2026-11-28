const bonusNextButton = document.getElementById("bonus-next-btn");
const nextButton1 = document.getElementById("next-button1");
const nextButton2 = document.getElementById("next-button2");
const startGameButton = document.getElementById("start-game-btn");
const restartGameOverButton = document.getElementById("restart-gameover-btn");
const restartWinButton = document.getElementById("restart-win-btn");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
const bonusScreen = document.getElementById("bonus-screen");
const bonusTrailerIframe = document.getElementById("bonus-trailer-iframe");
const screenOne = document.getElementById("intro-screen1");
const screenTwo = document.getElementById("intro-screen2");
const startGameScreen = document.getElementById("start-game-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("gameover-screen");
const winScreen = document.getElementById("win-screen");
const MAX_LIVES = 3;
const MAX_AMMO = 10;
const WIN_SCORE = 700;
const POINTS_PER_ENEMY = 10;
const INVULNERABLE_TIME = 5000;
const SHOOT_COOLDOWN = 600;
const AMMO_RECHARGE_TIME = 60000;

const gameMusic = new Audio("./audio/SupernaturalTheme.mp3");
gameMusic.loop = true;
gameMusic.volume = 0.4;

const characterChoices = [choice1, choice2].filter(Boolean);
let player;
const enemies = [];
const bullets = [];
const bobbies = [];

let selectedCharacter = "dean";
let lastShotTime = 0;
let lives = MAX_LIVES;
let ammo = MAX_AMMO;
let score = 0;
let highScore = loadHighScore();
let spawnTimer = null;
let bobbySpawnTimer = null;
let invulnerableTimer = null;
let loopIntervalId = null;
let ammoTimer = null;
let isGameActive = false;
let isInvulnerable = false;

const allScreens = [
  bonusScreen,
  screenOne,
  screenTwo,
  startGameScreen,
  gameScreen,
  gameOverScreen,
  winScreen,
];

function showScreen(targetScreen) {
  allScreens.forEach((screen) => {
    if (screen) {
      screen.style.display = "none";
    }
  });
  if (bonusTrailerIframe && targetScreen !== bonusScreen) {
    bonusTrailerIframe.src = "";
  }
  if (targetScreen) {
    targetScreen.style.display = "flex";
  }
}

function loadHighScore() {
  try {
    return Number(localStorage.getItem("supernaturalHighScore")) || 0;
  } catch (error) {
    return 0;
  }
}

function saveHighScore() {
  try {
    localStorage.setItem("supernaturalHighScore", highScore);
  } catch (error) {
    console.log("Could not save high score:", error);
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectCharacter(character) {
  selectedCharacter = character;
  characterChoices.forEach((choiceEl) => {
    choiceEl.classList.toggle("selected", choiceEl.dataset.character === character);
  });
}

characterChoices.forEach((choiceEl) => {
  choiceEl.addEventListener("click", () => {
    selectCharacter(choiceEl.dataset.character);
  });
});

selectCharacter(selectedCharacter);

const livesHud = document.createElement("div");
livesHud.className = "lives-hud";
gameScreen.appendChild(livesHud);

const ammoHud = document.createElement("div");
ammoHud.className = "ammo-hud";
gameScreen.appendChild(ammoHud);

const scoresHud = document.createElement("div");
scoresHud.className = "scores-hud";
gameScreen.appendChild(scoresHud);

function renderScore() {
  scoresHud.textContent = `Score: ${score} | Best: ${highScore}`;
}

function renderLives() {
  const filledHearts = "♥".repeat(Math.max(0, lives));
  const emptyHearts = "♡".repeat(Math.max(0, MAX_LIVES - lives));
  livesHud.textContent = `Lives: ${filledHearts}${emptyHearts}`;
}

function renderAmmo() {
  ammoHud.textContent = `Ammo: ${ammo}/${MAX_AMMO}`;
  if (ammo === 0) {
    ammoHud.classList.add("empty");
  } else {
    ammoHud.classList.remove("empty");
  }
}

function addScore(points) {
  if (!isGameActive) return;

  score += points;
  if (score > highScore) {
    highScore = score;
    saveHighScore();
  }
  renderScore();

  if (score >= WIN_SCORE) {
    winGame();
  }
}

function clearEnemies() {
  while (enemies.length > 0) {
    const enemy = enemies.pop();
    if (enemy && enemy.element) {
      enemy.element.remove();
    }
  }
}

function clearBullets() {
  while (bullets.length > 0) {
    const bullet = bullets.pop();
    if (bullet && bullet.element) {
      bullet.element.remove();
    }
  }
}

function clearBobbies() {
  while (bobbies.length > 0) {
    const bobby = bobbies.pop();
    if (bobby && bobby.element) {
      bobby.element.remove();
    }
  }
}

function stopInvulnerability() {
  isInvulnerable = false;
  clearTimeout(invulnerableTimer);
  invulnerableTimer = null;
  if (player && player.element) {
    player.element.classList.remove("invulnerable");
  }
}

function activateInvulnerability() {
  isInvulnerable = true;
  if (player && player.element) {
    player.element.classList.add("invulnerable");
  }
  clearTimeout(invulnerableTimer);
  invulnerableTimer = setTimeout(stopInvulnerability, INVULNERABLE_TIME);
}

function endGame() {
  isGameActive = false;
  clearTimeout(spawnTimer);
  clearTimeout(bobbySpawnTimer);
  clearInterval(loopIntervalId);
  stopInvulnerability();
  gameMusic.pause();
  clearInterval(ammoTimer);
  const hellImage = selectedCharacter === "sam" ? "SamHell.png" : "deanhell.png";
  gameOverScreen.style.backgroundImage = `url("./images/${hellImage}")`;
  showScreen(gameOverScreen);
}

function winGame() {
  isGameActive = false;
  clearTimeout(spawnTimer);
  clearTimeout(bobbySpawnTimer);
  clearInterval(loopIntervalId);
  stopInvulnerability();
  gameMusic.pause();
  clearInterval(ammoTimer);
  if (typeof heavenPage !== "undefined" && heavenPage) {
    heavenPage.show();
  } else {
    showScreen(winScreen);
  }
}

function handlePlayerHit(enemyIndex) {
  if (!isGameActive) return;

  const hitEnemy = enemies[enemyIndex];
  if (hitEnemy && hitEnemy.element) {
    hitEnemy.element.remove();
  }
  enemies.splice(enemyIndex, 1);

  if (isInvulnerable) return;

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
    enemy.speed += Math.floor(score / 30);
    enemy.x = nextSpawnX;
    enemy.element.style.left = `${enemy.x}px`;
    enemies.push(enemy);

    const extraRandomSpace = randomBetween(40, 120);
    nextSpawnX += enemy.width + minGap + extraRandomSpace;
  }

  const nextTime = Math.max(800, randomBetween(1450, 2650) - score * 7);
  spawnTimer = setTimeout(spawnEnemies, nextTime);
}

function spawnBobby() {
  if (!isGameActive) return;

  bobbies.push(new Bobby());
  bobbySpawnTimer = setTimeout(spawnBobby, randomBetween(8000, 15000));
}

function startNewGame() {
  clearTimeout(spawnTimer);
  clearTimeout(bobbySpawnTimer);
  clearInterval(loopIntervalId);
  clearInterval(ammoTimer);
  clearEnemies();
  clearBullets();
  clearBobbies();
  if (player && player.element) {
    player.element.remove();
  }
  player = selectedCharacter === "sam" ? new Player("Sam") : new Player("Dean");
  stopInvulnerability();

  lives = MAX_LIVES;
  ammo = MAX_AMMO;
  score = 0;
  lastShotTime = 0;
  renderLives();
  renderAmmo();
  renderScore();

  player.element.style.backgroundImage = `url("${player.image}")`;

  showScreen(gameScreen);
  player.syncToViewport(true);
  gameMusic.currentTime = 0;
  gameMusic.play();
  isGameActive = true;

  ammoTimer = setInterval(() => {
    if (!isGameActive) return;
    ammo = MAX_AMMO;
    renderAmmo();
  }, AMMO_RECHARGE_TIME);

  spawnEnemies();
  bobbySpawnTimer = setTimeout(spawnBobby, randomBetween(6000, 10000));

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

    if (!isGameActive) return;

    for (let b = bullets.length - 1; b >= 0; b--) {
      const bullet = bullets[b];
      bullet.x += bullet.speed;
      bullet.element.style.left = `${bullet.x}px`;

      let hit = false;

      for (let e = enemies.length - 1; e >= 0; e--) {
        if (areTouching(bullet, enemies[e])) {
          enemies[e].element.remove();
          enemies.splice(e, 1);
          bullet.element.remove();
          bullets.splice(b, 1);
          addScore(POINTS_PER_ENEMY);
          hit = true;
          break;
        }
      }

      if (!isGameActive) break;
      if (hit) continue;

      for (let k = bobbies.length - 1; k >= 0; k--) {
        if (areTouching(bullet, bobbies[k])) {
          bobbies[k].element.remove();
          bobbies.splice(k, 1);
          bullet.element.remove();
          bullets.splice(b, 1);
          lives -= 1;
          renderLives();
          if (lives <= 0) {
            endGame();
          }
          hit = true;
          break;
        }
      }

      if (!isGameActive) break;
      if (hit) continue;

      if (bullet.x > gameScreen.clientWidth) {
        bullet.element.remove();
        bullets.splice(b, 1);
      }
    }

    if (!isGameActive) return;

    for (let k = bobbies.length - 1; k >= 0; k--) {
      const bobby = bobbies[k];
      bobby.move();

      if (areTouching(player, bobby)) {
        bobby.element.remove();
        bobbies.splice(k, 1);
        activateInvulnerability();
        continue;
      }

      if (bobby.x + bobby.width < 0) {
        bobby.element.remove();
        bobbies.splice(k, 1);
      }
    }
  }, 20);
}

window.addEventListener("resize", () => {
  if (player) {
    player.syncToViewport(false);
  }

  const floor = gameScreen.querySelector(".floor");
  const floorHeight = floor ? floor.clientHeight : 60;
  enemies.forEach((enemy) => {
    enemy.y = Math.max(0, floorHeight - 2);
    enemy.element.style.bottom = `${enemy.y}px`;
  });
  bobbies.forEach((bobby) => {
    bobby.y = Math.max(0, floorHeight - 2);
    bobby.element.style.bottom = `${bobby.y}px`;
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

gameScreen.addEventListener("mousedown", (event) => {
  if (!isGameActive || event.button !== 0) return;
  if (ammo <= 0) return;

  const now = Date.now();
  if (now - lastShotTime < SHOOT_COOLDOWN) return;
  lastShotTime = now;

  ammo -= 1;
  renderAmmo();
  shoot();
});

if (bonusNextButton) {
  bonusNextButton.addEventListener("click", () => {
    showScreen(screenOne);
  });
}

if (nextButton1) {
  nextButton1.addEventListener("click", () => {
    showScreen(screenTwo);
  });
}

if (nextButton2) {
  nextButton2.addEventListener("click", () => {
    showScreen(startGameScreen);
  });
}

if (startGameButton) {
  startGameButton.addEventListener("click", () => {
    startNewGame();
  });
}

if (restartGameOverButton) {
  restartGameOverButton.addEventListener("click", () => {
    showScreen(startGameScreen);
  });
}

if (restartWinButton) {
  restartWinButton.addEventListener("click", () => {
    showScreen(startGameScreen);
  });
}

renderLives();
renderAmmo();
renderScore();