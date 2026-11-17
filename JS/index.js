const nextButton1 = document.getElementById(`next-button1`);
const nextButton2 = document.getElementById(`next-button2`);
const startGameButton = document.getElementById(`start-game-btn`)
const screenOne = document.getElementById(`intro-screen1`);
const screenTwo = document.getElementById(`intro-screen2`);
const gameScreen = document.getElementById(`game-screen`);
const gameOverScreen = document.getElementById(`gameover-screen`);
const winScreen = document.getElementById(`win-screen`);
const music = document.getElementById(`music`);
const player = new Player();
const startGameScreen = document.getElementById(`start-game-screen`);


// function playAudio() {
//     music.play();
// }


// if (screenOne.style.display = `block`) {
//     music = ``
// }

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    player.jump();
  }
});

nextButton1.addEventListener(`click`, (()=>{
    screenOne.style.display = `none`;
    screenTwo.style.display = `flex`;
}))



nextButton2.addEventListener(`click`,(()=>{
    screenTwo.style.display = `none`;
    startGameScreen.style.display = `flex`;
}) )

startGameButton.addEventListener(`click`,(()=>{
    startGameScreen.style.display = `none`;
    gameScreen.style.display = `flex`;
}) )


document.addEventListener(`keydown`, (event) => {
  const key = event.key.toLowerCase();

  if (key === `a`) {
    player.move(-1);
  }

  if (key === `d`) {
    player.move(1);
  }
});

const enemies = [];

setInterval(() => {
  enemies.push(new Enemy());
}, 2000);

setInterval(() => {
  enemies.forEach((enemy, index) => {
    enemy.move();

    if (enemy.x + enemy.width < 0) {
      enemy.element.remove(); 
      enemies.splice(index, 1); 
    }
  });
}, 20);