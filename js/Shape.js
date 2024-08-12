
import Block from "./block.js";

class Shape {
  //timers
  static moveInterval = 500
  static moveTime = 0
  constructor(x, y, w, h, type){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    //control variables
    this.rotation = 0;
    this.freezed = false;
    //shapes
    this.coords={};
    this.iCoords = [[[0,0], [0,1], [0,2], [0,3]], [[0,0], [1,0], [2,0], [3,0]]];
    this.jCoords = [[[1,0], [1,1], [1,2], [0,2]], [[0,0], [0,1], [1,1], [2,1]], [[0,0], [1,0], [0,1], [0,2]], [[0,0], [1,0], [2,0], [2,1]]];
    this.lCoords = [[[0,0], [0,1], [0,2], [1,2]], [[0,0], [1,0], [2,0], [0,1]], [[0,0], [1,0], [1,1], [1,2]], [[0,1], [1,1], [2,1], [2,0]]];
    this.oCoords = [[[0,0], [1,0], [0,1], [1,1]]];
    this.sCoords = [[[2,0], [1,0], [1,1], [0,1]], [[0,0], [0,1], [1,1], [1,2]]];
    this.tCoords = [[[0,0], [1,0], [2,0], [1,1]], [[1,0], [0,1], [1,1], [1,2]], [[1,0], [0,1], [1,1], [2,1]], [[0,0], [0,1], [1,1], [0,2]]];
    this.zCoords = [[[0,0], [1,0], [1,1], [2,1]], [[1,0], [0,1], [1,1], [0,2]]];
    //define coords
    this.coords.i = this.iCoords;
    this.coords.j = this.jCoords;
    this.coords.l = this.lCoords;
    this.coords.o = this.oCoords;
    this.coords.s = this.sCoords;
    this.coords.t = this.tCoords;
    this.coords.z = this.zCoords;
    //shape Object
    this.shapes = this.coords[this.type.name];
    this.shape = this.$shape();
  }
  
  $shape(){
    const shapeFirst = this.shapes[this.rotation];
    return shapeFirst.map(([x, y]) => {
      return new Block(x + this.x, y + this.y, this.w, this.h, this.type.src);
    });
  }
  
  static decreaseMoveInterval(minInterval, step){
    if (Shape.moveInterval - step < minInterval) return
    Shape.moveInterval -= step
    console.log(Shape.moveInterval)
  }
  
  get position(){
    const x = {
      max: Math.max(...this.shape.map(block => block.x)),
      min: Math.min(...this.shape.map(block => block.x))
    }
    const y = {
      max: Math.max(...this.shape.map(block => block.y)),
      min: Math.min(...this.shape.map(block => block.y)),
    }
    return {x, y};
  }
  
  get rotatePosition(){
    const rotation = this.rotation;
    //rotate for to test positions
    this.rotate();
    const {x, y} = this.position;
    //back the shape
    this.rotation = rotation;
    this.shape = this.$shape();
    return {x, y};
  }
  
  checkCollideWithOtherShape({shape}){
    return this.shape.some(shapeBlock => {
      return shape.some(block => {
        return shapeBlock.collided(block);
      });
    })
  }
  
  checkCollideRight(shape){
    //save current x
    const x = this.x;
    //move for right
    this.moveRight();
    //test if there was a collision with other shape
    const collided = this.checkCollideWithOtherShape(shape);
    //back the shape
    this.x = x;
    this.shape = this.$shape();
    //return collided value (true, false)
    return collided;
  }
  
  checkCollideLeft(shape){
    //save current x
    const x = this.x;
    //move for left
    this.moveLeft();
    //test if there was a collision with other shape
    const collided = this.checkCollideWithOtherShape(shape);
    //back the shape
    this.x = x;
    this.shape = this.$shape();
    //return collided value (true, false)
    return collided;
  }
  
  checkCollideDown(shape){
    //save current y
    const y = this.y;
    //move for down
    this.moveDown();
    //test if there was a collision with other shape
    const collided = this.checkCollideWithOtherShape(shape);
    //back the shape
    this.y = y
    this.shape = this.$shape();
    //return collided value (true, false)
    return collided;
  }
  
  checkCollideRotate(shape){
    //save current rotation
    const rot = this.rotation;
    //rotate
    this.rotate();
    //test if there was a collision with other shape
    const collided = this.checkCollideWithOtherShape(shape);
    //back the shape
    this.rotation = rot;
    this.shape = this.$shape();
    //return collided value (true, false)
    return collided;
  }
  
  render(ctx){
    this.shape.forEach(block => {
      block.render(ctx);
    });
  }
  
  moveRight(){
    if (this.freezed) return
    this.x++;
    this.shape = this.$shape();
  }
  
  moveLeft(){
    if (this.freezed) return
    this.x--;
    this.shape = this.$shape();
  }
  
  moveDown(){
    if (this.freezed) return
    this.y++;
    this.shape = this.$shape();
  }
  
  rotate(){
    if (this.freezed) return
    this.rotation++;
    if (this.rotation >= this.shapes.length){
      this.rotation=0;
    }
    this.shape = this.$shape();
  }
}

export default Shape;