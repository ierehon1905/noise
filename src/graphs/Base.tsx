import p5 from "p5";
import { AppState } from "../state";

export interface StateDependent {
  update: (state: AppState) => void;
  destroy: () => void;
}

export class BaseSketch implements StateDependent {
  parent!: p5.Element;
  parentP5!: p5;
  vals: number[] = Array(100).fill(0);
  counts?: number;

  constructor(element: HTMLElement) {
    console.log("init");

    this.parentP5 = new p5((p) => {
      this.parentP5 = p;
      p.setup = this.setup.bind(this);
      p.windowResized = this.windowResized.bind(this);
      p.draw = this.draw.bind(this);
    }, element);
  }

  setup() {
    this.parent = this.parentP5.createCanvas(700, 410).parent();
    this.windowResized();
  }

  windowResized() {
    const element = this.htmlParent;
    this.parentP5.resizeCanvas(element.clientWidth, element.clientHeight);
  }

  draw() {
    this.prepDraw();
    const p = this.parentP5;
    const vals = this.vals;

    for (let i = 0; i < vals.length; i++) {
      const x = (i * p.width) / (vals.length - 1);
      const d = 0; //(p.noise(i, p.frameCount / 100) - 0.5) * 100;
      const y = vals[i] + d;
      p.vertex(x, y);
    }

    p.endShape();
  }

  get htmlParent() {
    return this.parent as unknown as HTMLDivElement;
  }

  destroy() {
    this.htmlParent.innerHTML = "";
  }

  protected prepDraw() {
    const p = this.parentP5;
    p.scale(1, -1);
    p.translate(0, -p.height / 2);
    p.background(70);
    p.stroke(255);
    p.noFill();

    p.translate(this.padding, 0);
    this.drawAxes();
  }

  update(state: AppState) {
    throw new Error("Can not call update on base graph class");
  }

  get padding() {
    return this.parentP5.height * 0.1;
  }

  drawAxes() {
    const p = this.parentP5;
    const padding = this.padding;
    const count = this.counts || this.vals.length;

    p.push();
    p.stroke(100);
    p.line(0, 0, p.width, 0);

    const tileWidth = (p.width - padding * 2) / count;
    for (let index = 0; index < count; index++) {
      const x = index * tileWidth;
      const halfHeight = x % 8 === 0 ? p.height / 4 : p.height / 8;

      p.line(x, -halfHeight, x, halfHeight);
    }

    p.pop();
  }
}
