# Supernatural: The Game

An interactive browser game inspired by *Supernatural*, built with vanilla HTML, CSS, and JavaScript using DOM manipulation without external frameworks or game engines.

## Project Description

Players step into the shoes of **Sam** or **Dean Winchester** after a short intro sequence and character/controls selection screen. You move horizontally (`A` and `D`), jump (`Space`), shoot projectiles (`Left Click`), dodge enemies (`vampire.png`), collect friendly **Bobby** pickups (`Bobby.png`) for temporary invulnerability, and race to reach the target score (`100` points) to unlock the Heaven victory screen (`Heaven.png`), or lose if your lives run out (`deanhell.png`).

## MVP & Extra Features

### MVP (Minimum Viable Product)
- Multi-screen flow: intro screens, character & instructions screen, active game screen, game over screen, and win screen.
- Character selection between **Sam** and **Dean** (`Player` class with viewport synchronization, horizontal movement, and jumping).
- Enemy spawning and movement (`Enemy` class) with collision detection (`areTouching`).
- Lives, ammo, and score tracking with live HUD updates and end-game / win triggers.
- Restart flow via `window.location.reload()` on the end screens.

### Extra / Polish Features
- Friendly **Bobby** entity (`Bobby` class) granting timed invulnerability (`5000ms`) with visual blinking/glow feedback.
- Progressive difficulty (faster enemy spawns and higher enemy speed as score increases).
- Dedicated `Heaven` win-screen handler (`heaven.js`) with `Heaven.png` and high-contrast styling for readability.
- Responsive viewport scaling on window resize.

## Tech Stack
- **HTML5** (`index.html`)
- **CSS3** (`style.css`)
- **Vanilla JavaScript** (`index.js`, `player.js`, `enemy.js`, `bobby.js`, `bullet.js`, `collision.js`, `heaven.js`)


## AI Usage Log

This project was developed with AI assistance for UI/styling suggestions, debugging/getting unstuck, and structure ideas, while keeping core game rules, state management, and interactions understood and explainable.

| Tool | Topic / Prompt Summary | How It Helped |
| --- | --- | --- |
| AI Assistant | Adding a restart button using `window.location.reload()` at the end of the game | Suggested wiring restart buttons on `#gameover-screen` and `#win-screen` to reload the page cleanly. |
| AI Assistant | Improving contrast/readability of `YOU WIN` over `Heaven.png` | Suggested `text-shadow` and styling adjustments on `.win-screen h1` over the bright background. |
| AI Assistant | README and project guidelines review | Helped organize documentation and verify alignment with project requirements. |
| AI Assistant | Adjusted the speed of enemy| Explained and guided me to the use of clamp() for screen adaptability | Helped organize documentation and verify alignment with project requirements. |

## Agile & Workflow Notes (Retrospective)
- **What went well:** Breaking the game into separate JS files (`player.js`, `enemy.js`, `bobby.js`, `bullet.js`, `collision.js`, `heaven.js`, `index.js`) made debugging and adding features like invulnerability and the Heaven screen much clearer.
- **Challenges & lessons learned:** keeping UI/screen states clean are just as important as gameplay mechanics. Next time, I will plan end screens, asset paths, and Git tracking earlier from day one.
