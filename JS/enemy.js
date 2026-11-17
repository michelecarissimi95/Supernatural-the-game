class Enemy {
  constructor() {
    this.gameScreen = document.querySelector(".game-screen");
    this.element = document.createElement("div");
    
    
    this.width = 58;
    this.height = 58;
    this.x = this.gameScreen.clientWidth;
    this.y = 58; 

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.bottom = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.backgroundColor = "red";

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.x -= 4; 
    this.element.style.left = `${this.x}px`;
  }
}