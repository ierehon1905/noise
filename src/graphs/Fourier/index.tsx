import { BaseSketch, StateDependent } from "../Base";

import * as fft from "fft-js";
import * as jsfft from "jsfft";
import { AppState } from "../../state";
import { getASCII } from "../../utils";
import { calcFourierCoeff } from "./utils";

console.log({ fft, jsfft });

export class Fourier extends BaseSketch implements StateDependent {
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
    }

    p.endShape();
  }

  update(state: AppState): void {
    if (!state.message) {
      return;
    }
    const width = this.parentP5.width;
    const highest = state.highest || 128;
    const lowest = state.lowest || 0;

    let rawVals = getASCII(state.message, 2);

    const vals = rawVals
      .split("")
      .map(Number)
      .map((num) => (num === 0 ? -1 : num));

    ///////////////////////////

    let data = new jsfft.ComplexArray(highest).map((value, i, n) => {
      value.real = vals[Math.trunc((i / highest) * vals.length)];
    });

    data.FFT();
    data.map((frequency, i, n) => {
      if (i < lowest || i > highest) {
        frequency.real = 0;
        frequency.imag = 0;
      }
    });

    // data.InvFFT();
    // console.log([...data.real.slice(0, 10)]);

    const inputT = Array(width)
      .fill(0)
      .map((v, i) => i);
    const inputX = inputT.map(
      (t) => vals[Math.trunc((t / inputT.length) * vals.length)]
    );

    const nCoeff = highest;
    let coeff = calcFourierCoeff(inputT, inputX, nCoeff);
    console.log({ groundFreq: coeff.groundFreq, nCoeff });
    const groundFreq = (2 * Math.PI) / inputT.length;

    let outputVerts = [];
    const delenia = (document.getElementById("1488") as HTMLInputElement)
      .valueAsNumber;
    for (let i = 0; i < inputT.length; i++) {
      let t = inputT[i];
      // let x = coeff.average;
      let x = 0;

      data.map((frequency, j, n) => {
        // x += frequency.real * Math.cos((1 / n ** 2) * j * t);
        // x += frequency.imag * Math.sin((1 / n ** 2) * j * t);
        if (j !== 0) {
          x += frequency.real * Math.cos(groundFreq * j * t);
          x += frequency.imag * Math.sin(groundFreq * j * t);
        }
      });

      // for (let n = 0 /* lowest */; n < nCoeff - 1; n++) {
      //   x += coeff.coeff[n].cos * Math.cos(coeff.coeff[n].freq * t);
      //   x += coeff.coeff[n].sin * Math.sin(coeff.coeff[n].freq * t);
      // }
      outputVerts.push([t, x]);
    }

    const cleanOut = outputVerts.map(([t, x]) => x);
    // const cleanOut = [...data.real];

    this.vals = cleanOut;
    this.counts = rawVals.length;
  }
}
