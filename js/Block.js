
class Block {
  constructor(x, y, w, h, src){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.src = src; // source
  }
  
  render(ctx){
    const {x, y, w, h, src} = this;
    ctx.fillStyle = "#000";
    const img = new Image();
    img.src = src;
    ctx.drawImage(img, x*w, y*h, w, h);
  }
  
  collided(block){
    return (this.x === block.x && this.y === block.y);
  }
}

export default Block;