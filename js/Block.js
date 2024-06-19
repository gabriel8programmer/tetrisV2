
class Block {
  constructor(x, y, w, h, c, g=0, type="wall"){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.type = type;
    this.g = g;
  }
  
  render(ctx){
    const {x, y, w, h, c, g} = this;
    ctx.fillStyle = c;
    ctx.fillRect(x*w, y*h, w-g, h-g);
  }
}

export default Block;