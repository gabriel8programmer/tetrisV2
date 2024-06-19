
import Block from "./Block.js";

class Shape {
  constructor(x, y, blockSize, gapSize, type){
    this.x = x;
    this.y = y;
    this.blockSize = blockSize;
    this.gapSize = gapSize;
    this.type = type;
    
    //types
    this.iShapes = [[[1,0], [2,0], [3,0], [4,0]], [[1,0], [1,1], [1,2], [1,3]]];
    this.lShapes = [[[1,0], [2,0], [3,0], [1,1]], [[1,0], [2,0], [2,1], [2,2]], [[3,0], [1,1], [2,1], [3,1]], [[1,0], [1,1], [1,2], [2,2]]];
    this.oShapes = [[[1,0], [2,0], [1,1], [2,1]]];
    this.tShapes = [[[1,0], [2,0], [3,0], [2,1]], [[2,0], [1,1], [2,1], [2,2]], [[2,0], [1,1], [2,1], [3,1]], [[1,0], [1,1], [2,1], [1,2]]];
    this.zShapes = [[[1,0], [2,0], [2,1], [3,1]], [[3,0], [1,1], [2,1], [3,1]]];
    
    this.types = {
      iShape: this.iShapes,
      lShape: this.lShapes,
      oShape: this.oShapes,
      tShape: this.tShapes,
      zShape: this.zShapes,
    }
    
    //initial shape
    this.rotation = 0;
    this.shape = this.types[this.type.name];
  }
  
  render(ctx){
    this.shape = this.shape[this.rotation];
    this.shape.forEach(([x,y]) => {
      const { blockSize: ts, gapSize: gs } = this;
      const block = new Block(x+this.x, y+this.y, ts, ts, this.type.c, gs, "shape");
      block.render(ctx);
    });
  }
}

export default Shape;