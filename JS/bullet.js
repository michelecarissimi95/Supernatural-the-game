function shoot() {
  const element = document.createElement("div");
  const bullet = {
    element,
    width: 18,
    height: 6,
    x: player.x + player.width,
    y: player.y + Math.round(player.height * 0.55),
    speed: 12,
  };
  element.style.cssText = `position:absolute; width:18px; height:6px; background:#ffd166; left:${bullet.x}px;bottom:${bullet.y}px`;
  gameScreen.appendChild(element);
  bullets.push(bullet);
}