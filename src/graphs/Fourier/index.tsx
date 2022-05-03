import * as jsfft from "jsfft";
import type { AppState } from "../../state";
import { getASCII } from "../../utils";
import { BaseSketch, StateDependent } from "../Base";

export class Fourier extends BaseSketch implements StateDependent {
  draw() {
    this.prepDraw();
    const p = this.parentP5;
    const padding = this.padding;

    const vals = this.vals;
    const tileWidth = (p.width - padding * 2) / vals.length;
    const height = p.height / 2 - padding;

    p.beginShape();

    for (let i = 0; i < vals.length; i++) {
      const x = i * tileWidth;

      let y = vals[i];
      // console.log(y);
      y *= height;

      p.vertex(x, y);
    }

    p.endShape();
  }

  update(state: AppState): void {
    super.update(state);

    this.noise = state.noise;
    let now = Date.now();

    if (!state.message) {
      return;
    }
    const width = this.parentP5.width;
    const highest = state.highest || 128;
    const lowest = state.lowest || 0;

    const vals = state.encodedMessage;

    let data = new jsfft.ComplexArray(width).map((value, i, n) => {
      value.real = vals[Math.trunc((i / n) * vals.length)];
    });

    data.FFT();
    data.map((frequency, i, n) => {
      if (i < lowest || i > highest) {
        frequency.real = 0;
        frequency.imag = 0;
      }
    });

    const inputT = Array(width)
      .fill(0)
      .map((v, i, arr) => (i / arr.length) * highest);

    const groundFreq = (2 * Math.PI) / highest;

    let outputVerts = [];

    for (let index = lowest; index < highest; index++) {
      data.real[index] += (Math.random() - 0.5) * this.noise;
      data.imag[index] += (Math.random() - 0.5) * this.noise;
    }

    for (let i = 0; i < inputT.length; i++) {
      let t = inputT[i];
      let x = 0;

      for (let index = lowest; index < highest; index++) {
        const real = data.real[index];
        const imag = data.imag[index];

        x += real * Math.cos(groundFreq * index * t);
        x += imag * Math.sin(groundFreq * index * t);
      }

      outputVerts.push((x / Math.sqrt(width)) * 2);
    }

    this.vals = outputVerts;
    console.log("MILLIS", Date.now() - now);
  }
}
