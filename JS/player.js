class Player {
  constructor() {
    this.gameScreen = document.querySelector(".game-screen");
    this.element = document.createElement("div");
    this.image = "./images/Dean.png";
    this.isJumping = false;

    this.element.style.position = "absolute";
    this.element.style.backgroundImage = `url("${this.image}")`;
    this.element.style.backgroundPosition = "center";
    this.element.style.backgroundSize = "cover";

    this.syncToViewport(true);
    this.gameScreen.appendChild(this.element);
  }

  getFloorHeight() {
    const floor = this.gameScreen.querySelector(".floor");
    return floor ? floor.clientHeight : 60;
  }

  syncToViewport(resetPosition = false) {
    const stageWidth = Math.max(this.gameScreen.clientWidth, 300);
    const stageHeight = Math.max(this.gameScreen.clientHeight, 300);
    const floorHeight = this.getFloorHeight();

    const prevSize = this.width || 70;
    this.width = Math.round(Math.max(44, Math.min(84, stageWidth * 0.085)));
    this.height = this.width;

    const baseY = Math.max(0, floorHeight - 2);
    if (resetPosition) {
      this.x = Math.round(stageWidth * 0.04);
      this.y = baseY;
    } else {
      const ratioX = prevSize > 0 ? this.x / Math.max(1, stageWidth - prevSize) : 0;
      this.x = Math.max(
        0,
        Math.min(stageWidth - this.width, Math.round(ratioX * (stageWidth - this.width)))
      );
      if (!this.isJumping) {
        this.y = baseY;
      } else {
        this.y = Math.max(baseY, this.y);
      }
    }

    this.moveStep = Math.max(6, Math.round(stageWidth * 0.014));
    this.jumpHeight = Math.max(70, Math.round(stageHeight * 0.28));

    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.bottom = `${this.y}px`;
  }

  move(direction) {
    const maxX = Math.max(0, this.gameScreen.clientWidth - this.width);
    const newX = this.x + direction * this.moveStep;

    if (newX >= 0 && newX <= maxX) {
      this.x = newX;
      this.element.style.left = `${this.x}px`;
    }
  }

  jump() {
    if (this.isJumping) {
      return;
    }
    this.isJumping = true;

    const originalY = Math.max(0, this.getFloorHeight() - 2);
    this.y = originalY;
    const targetY = originalY + this.jumpHeight;
    const upStep = Math.max(4, Math.round(this.jumpHeight / 20));
    const downStep = Math.max(2, Math.round(this.jumpHeight / 45));

    const upInterval = setInterval(() => {
      if (this.y >= targetY) {
        clearInterval(upInterval);

        const downInterval = setInterval(() => {
          if (this.y <= originalY) {
            this.y = originalY;
            this.element.style.bottom = `${this.y}px`;
            clearInterval(downInterval);
            this.isJumping = false;
          } else {
            this.y = Math.max(originalY, this.y - downStep);
            this.element.style.bottom = `${this.y}px`;
          }
        }, 20);
      } else {
        this.y = Math.min(targetY, this.y + upStep);
        this.element.style.bottom = `${this.y}px`;
      }
    }, 20);
  }
}