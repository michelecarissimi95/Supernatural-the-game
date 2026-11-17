class Player {
  constructor() {
    this.gameScreen = document.querySelector(".game-screen");
    this.element = document.createElement("div");
    this.x = 0;
    this.y = 58;
    this.width = 70;
    this.height = 70;
    this.image = "../images/Dean.png";
    this.isJumping = false;

    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.bottom = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.backgroundImage = `url("${this.image}")`;
    this.element.style.backgroundPosition = `center`;
    this.element.style.backgroundSize = `cover`;

    this.gameScreen.appendChild(this.element);
  }

  move(direction) {
    let newX = this.x + direction * 10;
    let minX = 0;
    let maxX = this.gameScreen.clientWidth - this.width;

    if (newX >= minX && newX <= maxX) {
      this.x = newX;
      this.element.style.left = `${this.x}px`;
    }
  }

  jump() {
    if (this.isJumping === true) {
      return;
    } else if (this.isJumping === false) {
      this.isJumping = true;
    }

    let originalY = this.y;
    let jumpHeight = 100;

    let upInterval = setInterval(() => {
      if (this.y >= originalY + jumpHeight) {
        clearInterval(upInterval);

        let downInterval = setInterval(() => {
          if (this.y <= originalY) {
            this.y = originalY;
            this.element.style.bottom = `${this.y}px`;
            clearInterval(downInterval);
            this.isJumping = false;
          } else {
            this.y -= 2;
            this.element.style.bottom = `${this.y}px`;
          }
        }, 20);
      } else {
        this.y += 5;
        this.element.style.bottom = `${this.y}px`;
      }
    }, 20);
  }
}