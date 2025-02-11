
class Block {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img; // source
  }

  render(ctx) {
    const { x, y, w, h, img } = this;
    ctx.drawImage(img, x * w, y * h, w, h);
  }

  collided(block) {
    return (this.x === block.x && this.y === block.y);
  }
}

export default Block;