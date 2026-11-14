const nextButton1 = document.getElementById(`next-button1`);
const nextButton2 = document.getElementById(`next-button2`);
const screenOne = document.getElementById(`intro-screen1`);
const screenTwo = document.getElementById(`intro-screen2`);
const gameScreen = document.getElementById(`game-screen`);
const gameOverScreen = document.getElementById(`gameover-screen`);
const winScreen = document.getElementById(`win-screen`);
const music = document.getElementById(`music`);
const player = new Player();

// function playAudio() {
//     music.play();
// }


// if (screenOne.style.display = `block`) {
//     music = ``
// }

nextButton1.addEventListener(`click`, (()=>{
    screenOne.style.display = `none`;
    screenTwo.style.display = `flex`;
}))

nextButton2.addEventListener(`click`,(()=>{
    screenTwo.style.display = `none`;
    gameScreen.style.display = `flex`;
}) )

