
class Game {
  constructor(){
    //cols and rows
    this.cols = 12;
    this.rows = 21;
    this.colsBoard = 12;
    this.colsPanel = 6;
    this.rowsPanel = 6;
    this.ts = 20;
    this.game = document.querySelector("#game");
    this.width;
    this.height;
    this.ctx;
    //gameloop
    this.gameloop;
  }
  
  start(){
    this.game.width = (this.cols * this.ts);
    this.game.height = (this.rows * this.ts);
    this.ctx = this.game.getContext("2d");
    //width and height
    this.width = this.game.width;
    this.height = this.game.height;
    
    //gameloop
    this.render();
    this.gameloop = setInterval(this.update.bind(this), 1000);
  }
  
  render(){
    //paint the screen of the game
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    //draw-grids
  }
  
  update(){
    //render game
    this.render();
    //console.log("updating...");
  }
  
  control(cmd){
    console.log("commands");
  }
}

export default Game;