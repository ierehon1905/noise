import { AppContextType, AppState } from "../../state";
import { getASCII } from "../../utils";
import { BaseSketch, StateDependent } from "./Base";

export default class Received extends BaseSketch implements StateDependent {
  private noisedValsRef?: AppState["noisedMessage"];
  private receivedMessageRef?: AppState["receivedMessage"];
  private dispatch?: AppContextType["dispatch"];

  draw() {
    const p = this.parentP5;
    const padding = this.padding;

    this.prepDraw();

    const vals = this.noisedValsRef?.current || [];
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

    p.beginShape();

    for (let index = 0; index < counts; index++) {
      const measurementIndex = index * measurementDistance + measurementOffset;
      const measurementValue = vals[Math.round(measurementIndex)];

      const x = measurementIndex * tileWidth;

      let y = Math.round(measurementValue);
      receivedMessageVals.push(y);
      y *= height;
      // p.circle(x, measurementValue * height, 5);
      p.vertex(x - measurementOffset, y);
      p.vertex(x + measurementOffset, y);
    }

    p.endShape();

    // if (this.receivedMessageRef?.current) {
    //   this.receivedMessageRef.current = receivedMessageVals;
    // }

    if (this.dispatch) {
      this.dispatch({
        type: "set",
        key: "receivedMessage",
        payload: receivedMessageVals,
      });
    }
  }

  update(state: AppState, dispatch: AppContextType["dispatch"]): void {
    super.update(state, dispatch);
    this.noisedValsRef = state.noisedMessage;
    this.receivedMessageRef = state.receivedMessage;
    this.dispatch = dispatch;
  }
}
