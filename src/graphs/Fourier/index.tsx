import * as jsfft from "jsfft";
import type { AppState } from "../../state";
import { getASCII } from "../../utils";
import { BaseSketch, StateDependent } from "../Base";

export class Fourier extends BaseSketch implements StateDependent {
  private complexArray?: jsfft.ComplexArray;
  private highest?: number;
  private lowest?: number;
  private noise?: number;
  private average?: number;

  draw() {
    this.prepDraw();
    const p = this.parentP5;
    const padding = this.padding;
    const width = p.width;
    const highest = this.highest!;
    const lowest = this.lowest!;
    const noise = this.noise!;
    const average = this.average!;

    if (!this.complexArray) {
      return;
    }

    const inputT = Array(width)
      .fill(0)
      .map((v, i, arr) => (i / arr.length) * highest);
    const vals = [];

    const groundFreq = (2 * Math.PI) / highest;

    const noisedReal = this.complexArray!.real.map(
      (value) => value + (Math.random() - 0.5) * noise
    );
    const noisedImag = this.complexArray!.imag.map(
      (value) => value + (Math.random() - 0.5) * noise
    );

    for (let i = 0; i < inputT.length; i++) {
      let t = inputT[i];
      let x = 0;

      for (let index = lowest; index < highest; index++) {
        const real = noisedReal[index];
        const imag = noisedImag[index];

        x += real * Math.cos(groundFreq * index * t);
        x += imag * Math.sin(groundFreq * index * t);
      }

      vals.push((x / Math.sqrt(width)) * 2 - average);
    }

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
    let now = Date.now();
    super.update(state);

    if (!state.message) {
      return;
    }

    const width = this.parentP5.width;
    const highest = state.highest || 128;
    const lowest = state.lowest || 0;
    this.highest = highest;
    this.lowest = lowest;
    this.noise = state.noise;

    const vals = state.encodedMessage;

    this.average = vals.reduce((a, b) => a + b, 0) / vals.length;

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

    this.complexArray = data;
  }
}
