import { BaseSketch, StateDependent } from "./Base";

import * as fft from "fft-js";
import jsfft from "jsfft";
import { AppState } from "../state";
import { getASCII } from "../utils";

console.log({ fft });

export class Fourier extends BaseSketch implements StateDependent {
  draw() {
    this.prepDraw();
    const p = this.parentP5;
    const vals = this.vals;
    const padding = p.height * 0.1;
    const tileWidth = (p.width - padding * 2) / vals.length;
    const height = p.height / 2 - padding;

    p.translate(padding, 0);
    p.beginShape();

    for (let i = 0; i < vals.length; i++) {
      const x = i * tileWidth;
      const y = vals[i];
      p.vertex(x, y);
    }

    p.endShape();
  }

  update(state: AppState): void {
    if (!state.message) {
      return;
    }

    let rawVals = getASCII(state.message, 2);

    const nextPw2 = ceilPowerOf2(rawVals.length);

    while (rawVals.length < nextPw2) {
      rawVals += rawVals;
    }
    rawVals = rawVals.slice(0, nextPw2);

    const vals = rawVals.split("").map(Number);
    console.log(
      { vals }
      // getASCII(state.message, 2).length,
      // ceilPowerOf2(rawVals.length)
    );
    const phasors = fft.fft(vals);
    console.log({ phasors });
    const inverse = fft.ifft(phasors);
    console.log({ inverse });
    // let getVal = (t: number) =>
    //   phasors
    //     .map(([a, b], index) => a * Math.cos((index + 1) * t + b))
    //     .reduce((acc, cur) => acc + cur, 0);

    // const ffVals = Array(1000)
    //   .fill(0)
    //   .map((_, index) => getVal(index / 10));

    // console.log(ffVals);

    // this.vals = ffVals;
    this.vals = inverse;
  }
}

function ceilPowerOf2(n: number) {
  return 1 << Math.ceil(Math.log2(n));
}
