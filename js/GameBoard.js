
import Shape from "./Shape.js";
import Block from "./Block.js";

class Game {
  constructor(game){
    //canvas variables
    this.game = game;
    this.ctx = this.game.getContext("2d");
    //game variables
    this.cols = 12;
    this.rows = 21;
    this.bs = 20; //block size
    this.width = this.cols * this.bs;
    this.height = this.rows * this.bs;
    this.frames = 400;
    //shape variables
    this.shapes=[];
    this.shapeTypes = [
      {name: "i", src: "../img/block02.png"},
      {name: "j", src: "../img/block03.png"},
      {name: "l", src: "../img/block04.png"},
      {name: "o", src: "../img/block05.png"},
      {name: "s", src: "../img/block06.png"},
      {name: "t", src: "../img/block07.png"},
      {name: "z", src: "../img/block08.png"},
    ];
    this.shapeSortedIndex = 0;
    this.shapeTypeSorted;
    this.shape;
  }
  
  defineNewShape(){
    this.shapeSortedIndex = Math.floor(Math.random() * this.shapeTypes.length);
    this.shapeTypeSorted = this.shapeTypes[this.shapeSortedIndex];
    this.shape = new Shape(this.cols/2-1, 0, this.bs, this.bs, this.shapeTypeSorted);
    //add shape in list shapes
    this.shapes.push(this.shape);
  }
  
  renderScreen(){
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  renderBoard(){
    for (let c = 0; c < this.cols; c++){
      for (let r = 0; r < this.rows; r++){
        const block = new Block(c, r, this.bs, this.bs, "../img/block00.png");
        if (c === 0 || c === this.cols-1 || r === this.rows-1){
          //render walls
          block.src = "../img/block01.png";
          block.render(this.ctx);
        } else {
          //render background
          block.render(this.ctx);
        }
      }
    }
  }
  
  renderShapes(){
    this.shapes.forEach(shape => {
      shape.render(this.ctx);
    });
  }
  
  render(){
    this.renderScreen();
    this.renderBoard();
    this.renderShapes();
  }
  
  checkCollide(callback){
    if (this.shapes.length<=1) return
    const shapes = this.shapes.slice(0, this.shapes.indexOf(this.shape));
    return shapes.some(shape => this.shape[callback](shape));
  }
  
  get collideRight(){
   return this.checkCollide("checkCollideRight");
  }
  
  get collideLeft(){
   return this.checkCollide("checkCollideLeft");
  }
  
  get collideDown(){
    return this.checkCollide("checkCollideDown");
  }
  
  get collideRotate(){
   return this.checkCollide("checkCollideRotate");
  }
  
  get right(){
    const { x } = this.shape.position;
    return x.max < this.cols-2 && !this.collideRight;
  }
  
  get left(){
    const { x } = this.shape.position;
    return x.min > 1 && !this.collideLeft;
  }
  
  get down(){
    const { y } = this.shape.position;
    return y.max < this.rows-2 && !this.collideDown;
  }
  
  get rotate(){
    const { x, y } = this.shape.rotatePosition;
    return x.max <= this.cols-2 && y.max <= this.rows-2 && !this.collideRotate;
  }
  
  checkThereWasCombination(){
    //get all blocks in the board game
    const blocks = this.shapes.reduce((blocks, {shape}) => {
      shape.forEach(block => blocks.push(block));
      return blocks;
    }, []);
  }
  
  freezeShape(){
    if (this.shape.freezed){
      this.checkThereWasCombination();
      this.defineNewShape();
    }
  }
  
  updateShape(){
    this.shape.freezed = !this.down;
    this.freezeShape();
    this.shape.moveDown();
  }
  
  update(){
    //this.render();
    //update
    this.updateShape();
    setTimeout(this.update.bind(this), this.frames);
  }
  
  start(){
    //init canvas
    this.game.width = this.width;
    this.game.height = this.height;
    //define first shape
    this.defineNewShape();
    //render and update game
    setInterval(this.render.bind(this), 1);
    this.update();
  }
  
  control(key){
    if (!key) return;
    if (key === "ArrowRight" && this.right){
      this.shape.moveRight();
    } else if (key === "ArrowLeft" && this.left){
      this.shape.moveLeft();
    } else if (key === "ArrowDown" && this.down){
      this.shape.moveDown();
    } else if (key === "rotate" || key === "ArrowUp" || key === " " && this.rotate){
      this.shape.rotate();
    }
    //render game again
    this.render();
  }
}

export default Game;