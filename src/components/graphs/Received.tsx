import {
  AppContextType,
  AppState,
  getDecodedBits,
  getDecodedMessage,
} from "../../state";
import { getASCII } from "../../utils";
import { BaseSketch, StateDependent } from "./Base";

export default class Received extends BaseSketch implements StateDependent {
  private dispatch?: AppContextType["dispatch"];

  draw() {
    const p = this.parentP5;
    const padding = this.padding;

    this.prepDraw();

    const vals = this.vals;

    if (vals.length === 0) {
      return;
    }

    // console.log(vals);

    const tileWidth = (p.width - padding * 2) / vals.length;
    const height = p.height / 2 - padding;

    p.stroke(100);
    p.beginShape();

    for (let i = 0; i < vals.length; i++) {
      const x = i * tileWidth;
      const y = vals[i] * height;

      p.vertex(x, y);
      p.vertex(x + tileWidth, y);
    }

    p.endShape();

    const counts = this.counts || this.vals.length;
    const measurementDistance = vals.length / counts;
    const measurementOffset = measurementDistance / 2;

    p.stroke(255);

    const receivedMessageVals = [];

    // p.beginShape();

    for (let index = 0; index < counts; index++) {
      const measurementIndex = index * measurementDistance + measurementOffset;
      const measurementValue = vals[Math.round(measurementIndex)];

      // const x = measurementIndex * tileWidth;

      let y = measurementValue > 0 ? 1 : -1;
      receivedMessageVals.push(y);
      y *= height;
      // p.circle(x, measurementValue * height, 5);
      // p.vertex(x - measurementOffset, y);
      // p.vertex(x + measurementOffset, y);
    }

    // p.endShape();

    const bits = getDecodedBits(receivedMessageVals, "NRZ", "Physical");

    p.beginShape();

    for (let index = 0; index < bits.length; index++) {
      const x = index * measurementDistance + measurementOffset;

      // console.log({ index }, x, x + measurementOffset * 2);
      let y = bits[index];
      receivedMessageVals.push(y);
      y *= height;
      // p.circle(x, y * height, 5);
      p.vertex((x - measurementOffset) * tileWidth, y);
      p.vertex((x + measurementOffset) * tileWidth, y);
    }

    // if (p.frameCount > 10) {
    //   p.noLoop();
    // }

    p.endShape();

    if (this.dispatch) {
      this.dispatch({
        type: "set",
        key: "receivedMessageBits",
        payload: bits,
      });
    }
  }

  update(state: AppState, dispatch: AppContextType["dispatch"]): void {
    super.update(state, dispatch);

    this.vals = state.noisedMessage || [];

    this.dispatch = dispatch;
  }
}
