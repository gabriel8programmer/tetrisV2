
import Game from "./GameBoard.js";

//create game Object
const game = new Game(document.querySelector("#game"));
game.start();

//events
document.addEventListener("keydown", e => game.control(e.key));
document.querySelector("#controls").addEventListener("click", e => game.control(e.target.dataset.key));