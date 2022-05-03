import { AppState } from "../state";
import { getASCII } from "../utils";
import { BaseSketch, StateDependent } from "./Base";

export default class Signal extends BaseSketch implements StateDependent {
  draw() {
    const p = this.parentP5;
    const padding = this.padding;

    this.prepDraw();

    const vals = this.vals;
    const tileWidth = (p.width - padding * 2) / vals.length;
    const height = p.height / 2 - padding;

    p.beginShape();

    for (let i = 0; i < vals.length; i++) {
      const x = i * tileWidth;
      const y = vals[i] * height;

      p.vertex(x, y);
      p.vertex(x + tileWidth, y);
    }

    p.endShape();
  }

  update(state: AppState): void {
    super.update(state);
    this.vals = state.encodedMessage;
  }
}
