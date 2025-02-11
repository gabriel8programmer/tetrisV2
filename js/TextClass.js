
class Text {
    constructor(text, x, y, font, color, align = 'left', baseline = 'top') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
    }

    render(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.fillText(this.text, this.x, this.y);
    }
}

export default Text;