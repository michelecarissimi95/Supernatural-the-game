class Heaven {
  constructor(imagePath = "./images/Heaven.png") {
    this.imagePath = imagePath;
    this.screen = document.getElementById("win-screen");
  }

  applyBackground() {
    if (!this.screen) return;
    this.screen.style.backgroundImage = `url("${this.imagePath}")`;
    this.screen.style.backgroundSize = "cover";
    this.screen.style.backgroundPosition = "center";
    this.screen.style.backgroundRepeat = "no-repeat";
  }

  show() {
    this.applyBackground();
    if (typeof showScreen === "function" && this.screen) {
      showScreen(this.screen);
    } else if (this.screen) {
      this.screen.style.display = "flex";
    }
  }
}

const heavenPage = new Heaven("./images/Heaven.png");