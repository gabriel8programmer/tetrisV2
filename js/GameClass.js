
import Shape from "./ShapeClass.js";
import Block from "./BlockClass.js";
import Text from "./TextClass.js";

class Game {
  constructor(game) {
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

    //timers
    this.initialInterval = 400
    this.moveInterval = this.initialInterval
    this.moveTime = 0
    this.minInterval = 100

    this.fps = 0
    this.loop = null;
    this.started = false;
    this.gameover = false;

    this.score = 0;
    //shape variables
    this.shapes = [];
    this.blocks = [];

    this.blockTypes = [
      document.querySelector("#block00"),
      document.querySelector("#block01"),
      { name: "i", img: document.querySelector("#block02") },
      { name: "j", img: document.querySelector("#block03") },
      { name: "l", img: document.querySelector("#block04") },
      { name: "o", img: document.querySelector("#block05") },
      { name: "s", img: document.querySelector("#block06") },
      { name: "t", img: document.querySelector("#block07") },
      { name: "z", img: document.querySelector("#block08") },
    ]

    this.shapeTypes = this.blockTypes.slice(2);
    this.shape = null;
    this.nextShape = null;

    //initialize canvas
    this.game.width = this.width;
    this.game.height = this.height;
  }

  $Audio(audioId, ended = false) {
    const $audio = document.querySelector(audioId);
    $audio.volume = 0.5;
    if (ended) {
      $audio.addEventListener("ended", $audio.play)
    }
    $audio.play()
  }

  getRandomShapeType() {
    const shapeSortedIndex = Math.floor(Math.random() * this.shapeTypes.length);
    return this.shapeTypes[shapeSortedIndex];
  }

  createNextShape() {
    //define new shape type and update next shape
    const type = this.getRandomShapeType();
    this.nextShape = new Shape(this.cols + (this.panelCols / 2 - 1), this.rows / 2 - 3, this.bs, this.bs, type);
  }

  createNewShape() {
    if (this.nextShape !== null) {
      const { type } = this.nextShape;
      this.shape = new Shape(this.cols / 2 - 1, 0, this.bs, this.bs, type);
    } else {
      const type = this.getRandomShapeType();
      this.shape = new Shape(this.cols / 2 - 1, 0, this.bs, this.bs, type);
    }

    //update shapes
    this.shapes.push(this.shape);

    //create next shape
    this.createNextShape();
  }

  renderScreen() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  renderBoard() {
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const block = new Block(c, r, this.bs, this.bs, this.blockTypes[0]);
        if (c === 0 || c === this.cols - 1 || r === this.rows - 1) {
          //render walls
          block.img = this.blockTypes[1];
          block.render(this.ctx);
        } else {
          //render background
          block.render(this.ctx);
        }
      }
    }
  }

  renderShapes() {
    this.shapes.forEach(shape => {
      shape.render(this.ctx);
    });
  }

  renderNextShape() {
    this.nextShape.render(this.ctx);
  }

  renderTexts() {
    //render score text
    let text = new Text(`${this.score}`, (this.cols + this.panelCols - 1) * this.bs, 1 * this.bs, '20px Arial', 'yellow', 'right', 'top');
    text.render(this.ctx);
    //render next shape text
    text = new Text("Next", (this.cols + (this.panelCols / 2)) * this.bs, (this.rows / 2 - 4) * this.bs, '24px Arial', 'yellow', 'center', 'bottom');
    text.render(this.ctx);
    //render gameover text
    if (!this.gameover) return;
    text = new Text("Gameover", (this.cols + (this.panelCols / 2)) * this.bs, (this.rows - 8) * this.bs, '28px Arial', 'red', 'center', 'top');
    text.render(this.ctx);
    //press any key text
    if (!this.gameover) return;
    text = new Text("Press any key to play again", (this.cols + (this.panelCols / 2)) * this.bs, (this.rows - 6) * this.bs, '11px Arial', 'yellow', 'center', 'top');
    text.render(this.ctx);
  }

  renderPanel() {
    this.renderNextShape();
    this.renderTexts();
  }

  render() {
    this.renderScreen();
    this.renderBoard();
    this.renderShapes();
    this.renderPanel();
  }

  checkCollide(callback) {
    if (this.shapes.length <= 1) return
    const shapes = this.shapes.slice(0, this.shapes.indexOf(this.shape));
    return shapes.some(shape => this.shape[callback](shape));
  }

  get collideRight() {
    return this.checkCollide("checkCollideRight");
  }

  get collideLeft() {
    return this.checkCollide("checkCollideLeft");
  }

  get collideDown() {
    return this.checkCollide("checkCollideDown");
  }

  get collideRotate() {
    return this.checkCollide("checkCollideRotate");
  }

  get right() {
    const { x } = this.shape.position;
    return x.max < this.cols - 2 && !this.collideRight;
  }

  get left() {
    const { x } = this.shape.position;
    return x.min > 1 && !this.collideLeft;
  }

  get down() {
    const { y } = this.shape.position;
    return y.max < this.rows - 2 && !this.collideDown;
  }

  get rotate() {
    const { x, y } = this.shape.rotatePosition;
    return x.max <= this.cols - 2 && y.max <= this.rows - 2 && !this.collideRotate;
  }

  moveRestBlocksForDown() {
    const minRow = Math.min(...this.blocks.map(({ y }) => y));
    const maxRow = Math.max(...this.blocks.map(({ y }) => y));
    this.shapes.forEach(({ shape }) => {
      shape = shape.filter(block => block.y < minRow).map(block => {
        block.y += (maxRow + 1 - minRow);
        return block;
      });
    });
  }

  removeBlockRows() {
    //update blocks in shapes 
    this.blocks.forEach(block => {
      this.shapes.forEach(({ shape }) => {
        const blockToRemove = shape.findIndex(({ x, y }) => block.x === x && block.y === y);
        if (blockToRemove < 0) return;
        shape.splice(blockToRemove, 1);
      });
    });
  }

  decreaseMoveInterval(step) {
    if (this.moveInterval <= this.initialInterval) {
      this.moveInterval = this.initialInterval;
      return;
    }
    this.moveInterval -= step;

    console.log(this.moveInterval);
  }

  checkThereWasCombination() {
    //get all blocks in the board game
    const blockShapes = this.shapes.reduce((blocks, { shape }) => {
      shape.forEach(block => blocks.push(block));
      return blocks;
    }, []);

    this.blocks = []
    for (let y = 0; y <= this.rows - 2; y++) {
      let row = [];
      for (let x = 1; x <= this.cols - 2; x++) {
        row = blockShapes.filter(block => block.y === y);
      }
      if (row.length === 10) {
        this.blocks.push(...row);
      }
    }

    if (this.blocks.length > 0) {
      //remove block rows combined and move rest blocks for down
      this.removeBlockRows();
      this.moveRestBlocksForDown();
      //update score and velocity and play sound
      this.updateScore(100 * this.blocks.length / (this.cols - 2));
      this.decreaseMoveInterval(10);
      this.$Audio("#audio-point");
    }
  }

  checkGameOver() {
    const shapeInTop = this.shapes.some(shape => shape.position.y.min <= 1 && shape.freezed);
    if (shapeInTop) {
      this.gameover = true;
      this.started = false;
      this.shape.freezed = true;
    }
  }

  updateScore(inc) {
    this.score += inc;
  }

  checkIfShapeIsFreezed() {
    if (this.shape.freezed) {
      this.checkThereWasCombination();
      //new shape and next shape
      this.checkGameOver();
      this.createNewShape();
      //define score and frames
      this.updateScore(10);
      this.decreaseMoveInterval(2);
    }
  }

  updateShape() {
    this.shape.freezed = !this.down;

    //add timer in the shape movement
    if (this.fps - this.moveTime >= this.moveInterval) {
      this.shape.moveDown();
      this.moveTime = this.fps
    }
  }

  update() {
    if (this.gameover) return;
    this.checkIfShapeIsFreezed();
    this.updateShape();
  }

  start() {
    this.started = true;
    //define first shape
    this.createNewShape();
    //render game
    this.render();
  }

  run(fps) {
    if (this.loop) {
      cancelAnimationFrame(this.loop)
    }
    this.fps = fps
    this.render()
    this.update()
    // game loop
    this.loop = requestAnimationFrame(this.run.bind(this))
  }

  reset() {
    this.shapes = [];
    this.shape = null;
    this.nextShape = null;
    this.started = true;
    this.gameover = false;
    this.score = 0;
    //reset timers
    this.moveInterval = this.initialInterval;
    this.moveTime = 0;
    //play again
    this.start();
  }

  control(key) {

    //define start game
    if (this.gameover) {
      this.reset();
      return;
    }

    //run the game
    if (this.started) this.run();

    //capture keys of HTMLButtons
    if (key === "ArrowRight" && this.right) {
      this.shape.moveRight();
    } else if (key === "ArrowLeft" && this.left) {
      this.shape.moveLeft();
    } else if (key === "ArrowDown" && this.down) {
      this.shape.moveDown();
    } else if ((key === "rotate" || key === "ArrowUp" || key === " ") && this.rotate) {
      this.shape.rotate();
    }
  }
}

export default Game;