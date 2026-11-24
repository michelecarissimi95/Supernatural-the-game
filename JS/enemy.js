class Enemy {
  constructor() {
    this.gameScreen = document.querySelector(".game-screen");
    this.element = document.createElement("div");
    this.image = "images/vampire.png";

    const stageWidth = Math.max(this.gameScreen.clientWidth, 300);
    const floor = this.gameScreen.querySelector(".floor");
    const floorHeight = floor ? floor.clientHeight : 60;

    this.width = Math.round(Math.max(36, Math.min(68, stageWidth * 0.068)));
    this.height = this.width;
    this.x = this.gameScreen.clientWidth;
    this.y = Math.max(0, floorHeight - 2);
    this.speed = Math.max(3, Math.round(stageWidth * 0.005));

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.bottom = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.backgroundImage = `url("${this.image}")`;
    this.element.style.backgroundPosition = "center";
    this.element.style.backgroundSize = "cover";
    this.element.style.backgroundRepeat = "no-repeat";

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.x -= this.speed;
    this.element.style.left = `${this.x}px`;
  }
}