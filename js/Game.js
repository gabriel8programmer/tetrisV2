
import Block from "./Block.js";
import Shape from "./Shape.js";

class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.cols = 12;
    this.rows = 21;
    this.ts = 20; //tile size
    this.gs = 2; //gap size
    this.width = this.height = 0;
    this.ctx;
    this.loop;
    
    //color blocks
    this.colorBlock = {
      wall: "#777",
      iShape: "#f00",
      lShape: "#0f0",
      oShape: "#0ff",
      tShape: "#ff0",
      zShape: "#f0f",
      complete: "#eee"
    }
    
    //shapes
    this.shapeTypes = [
      {name: "iShape", c: this.colorBlock.iShape},
      {name: "lShape", c: this.colorBlock.lShape},
      {name: "oShape", c: this.colorBlock.oShape},
      {name: "tShape", c: this.colorBlock.tShape},
      {name: "zShape", c: this.colorBlock.zShape}
    ];
    
    this.randomShapeType;
    this.shape;
  }
  
  renderWalls(){
    for (let c = 0; c < this.cols; c++){
      for (let r = 0; r < this.rows; r++){
        if (c === 0 || c === this.cols-1 || r === this.rows-1){
          const {ts, gs, colorBlock} = this;
          const block = new Block(c, r, ts, ts, colorBlock.wall, gs);
          block.render(this.ctx);
        }
      }
    }
  }
  
  render(){
    //draw screen
    this.ctx.fillStyle = "#0000";
    this.ctx.fillRect(0, 0, this.width, this.height);
    //board
    this.renderWalls();
    //shape
    this.shape.render(this.ctx);
  }
  
  update(){
    this.render();
  }
  
  start(){
    this.width = (this.cols * this.ts);
    this.height = (this.rows * this.ts);
    //config canvas
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    
    //define first shape
    this.randomShapeType = this.shapeTypes[Math.floor(Math.random() * this.shapeTypes.length)];
    this.shape = new Shape(this.cols/2-2, 0, this.ts, this.gs, this.randomShapeType);
  
    //game loop
    this.loop = setInterval(this.update.bind(this), 150);
  }
  
  control(key){
    console.log(key);
  }
}

export default Game;