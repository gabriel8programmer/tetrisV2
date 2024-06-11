
import Game from "./game.js";

const game = new Game();
game.start();

//events
document.addEventListener("keydown", e => game.control(e.key) );
document.querySelector("#controls").addEventListener("keydown", e => game.control(e.target.dataset.key) );