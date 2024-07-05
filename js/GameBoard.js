
import Shape from "./Shape.js";
import Block from "./Block.js";
import Text from "./TextObj.js";

class Game {
  constructor(game){
    //canvas variables
    this.game = game;
    this.ctx = this.game.getContext("2d");
    //game variables
    this.cols = 12;
    this.rows = 21;
    this.panelCols = 8;
    this.bs = 20; //block size
    this.width = this.cols * this.bs + (this.panelCols * this.bs);
    this.height = this.rows * this.bs;
    this.initialFrame = 400;
    this.frames = this.initialFrame;
    this.frameLimit = 100;
    this.loop;
    this.started = false;
    this.gameover = false;
    this.score = 0;
    //shape variables
    this.shapes=[];
    this.blocks=[];
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
    this.nextShape;
    
    //initialize canvas
    this.game.width = this.width;
    this.game.height = this.height;
  }
  
  defineRandomShapeType(){
    this.shapeSortedIndex = Math.floor(Math.random() * this.shapeTypes.length);
    this.shapeTypeSorted = this.shapeTypes[this.shapeSortedIndex];
  }
  
  defineNextShape(){
    //define new shape type and update next shape
    this.defineRandomShapeType();
    this.nextShape = new Shape(this.cols+(this.panelCols/2-1), this.rows/2-3, this.bs, this.bs, this.shapeTypeSorted);
  }
  
  defineNewShape(type){
    this.shape = new Shape(this.cols/2 -1, 0, this.bs, this.bs, type);
    //update shapes
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
  
  renderNextShape(){
    this.nextShape.render(this.ctx);
  }
  
  renderTexts(){
    //render score text
    let text = new Text(`${this.score}`, (this.cols+this.panelCols-1)*this.bs, 1 * this.bs, '20px Arial', 'yellow', 'right', 'top');
    text.render(this.ctx);
    //render next shape text
    text = new Text("Next", (this.cols+(this.panelCols/2))*this.bs, (this.rows/2-4) * this.bs, '24px Arial', 'yellow', 'center', 'bottom');
    text.render(this.ctx);
    //render gameover text
    if (!this.gameover) return;
    text = new Text("Gameover", (this.cols+(this.panelCols/2))*this.bs, (this.rows-8) * this.bs, '28px Arial', 'red', 'center', 'top');
    text.render(this.ctx);
    //press any key text
    if (!this.gameover) return;
    text = new Text("Press any key to play again", (this.cols+(this.panelCols/2))*this.bs, (this.rows-6) * this.bs, '11px Arial', 'yellow', 'center', 'top');
    text.render(this.ctx);
  }
  
  renderPanel(){
    this.renderNextShape();
    this.renderTexts();
  }
  
  render(){
    this.renderScreen();
    this.renderBoard();
    this.renderShapes();
    this.renderPanel();
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
  
  moveRestBlocksForDown(){
    const minRow = Math.min(...this.blocks.map(({y}) => y));
    const maxRow = Math.max(...this.blocks.map(({y}) => y));
    this.shapes.forEach(({shape}) => {
      shape = shape.filter(block => block.y < minRow).map(block => {
        block.y += (maxRow+1-minRow);
        return block;
      });
    });
  }
  
  removeBlockRows(){
    //update blocks in shapes 
    this.blocks.forEach(block => {
      this.shapes.forEach(({shape}) => {
        const blockToRemove = shape.findIndex(({x, y}) => block.x === x && block.y === y);
        if (blockToRemove < 0) return;
        shape.splice(blockToRemove, 1);
      });
    });
  }
  
  checkThereWasCombination(){
    //get all blocks in the board game
    const blockShapes = this.shapes.reduce((blocks, {shape}) => {
      shape.forEach(block => blocks.push(block));
      return blocks;
    }, []);
    
    this.blocks = []
    for (let y = 0; y <= this.rows-2; y++){
      let row = [];
      for (let x = 1; x <= this.cols-2; x++){
        row = blockShapes.filter(block => block.y === y);
      }
      if (row.length === 10){
        this.blocks.push(...row);
      }
    }
    
    if (this.blocks.length > 0){
      //remove block rows combined and move rest blocks for down
      this.removeBlockRows();
      this.moveRestBlocksForDown();
      //update score and velocity
      this.updateScore(100);
      this.updateVelocity(10*(this.blocks.length/this.cols));
    }
  }
  
  checkGameOver(){
    const shapeInTop = this.shapes.some(shape => shape.position.y.min <= 1 && shape.freezed);
    if (shapeInTop){
      this.gameover = true;
      this.shape.freezed = true;
    }
  }
  
  updateScore(inc){
    this.score += inc;
  }
  
  updateVelocity(inc){
    this.frames-=inc;
    if (this.frames <= this.frameLimit) {
      this.frames = this.frameLimit;
    }
    //update game loop
    clearInterval(this.loop);
    this.loop = setInterval(this.update.bind(this), this.frames);
  }
  
  freezeShape(){
    if (this.shape.freezed){
      this.checkThereWasCombination();
      //new shape and next shape
      this.defineNewShape(this.nextShape.type);
      this.defineNextShape();
      this.checkGameOver();
      //define score and frames
      this.updateScore(10);
      this.updateVelocity(1);
    }
  }
  
  updateShape(){
    this.shape.freezed = !this.down;
    this.freezeShape();
    this.shape.moveDown();
  }
  
  update(){
    if (this.gameover || !this.started) return;
    //update
    this.updateShape();
  }
  
  start(){
    //define first shape
    this.defineRandomShapeType();
    this.defineNewShape(this.shapeTypeSorted);
    this.defineNextShape();
    //render and update game
    setInterval(this.render.bind(this), 1000/60);
    this.loop = setInterval(this.update.bind(this), this.frames);
  }
  
  reset(){
    this.shapes = [];
    this.shape = null;
    this.nextShape = null;
    this.started = false;
    this.gameover = false;
    this.score = 0;
    this.frames = this.initialFrame;
    //clear gameloop
    clearInterval(this.loop);
    //play again
    this.start();
  }
  
  control(key){
    if (!key) return;
    if (key === "ArrowRight" && this.right && this.started){
      this.shape.moveRight();
    } else if (key === "ArrowLeft" && this.left && this.started){
      this.shape.moveLeft();
    } else if (key === "ArrowDown" && this.down && this.started){
      this.shape.moveDown();
    } else if ((key === "rotate" || key === "ArrowUp" || key === " ") && this.rotate && this.started){
      this.shape.rotate();
    } else if (this.gameover){
      this.reset();
    } else {
      this.started = true;
    }
  }
}

export default Game;