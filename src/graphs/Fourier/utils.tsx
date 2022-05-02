function ceilPowerOf2(n: number) {
  return 1 << Math.ceil(Math.log2(n));
}
export function calcFourierCoeff(t: number[], x: number[], N: number) {
  if (t.length != x.length) {
    throw new Error("dft: x and t need to be same size");
  }

  // cumulative sum
  let dt = diff(t);
  let totalT = t[t.length - 1] - t[0];
  let groundFreq = (2 * Math.PI) / totalT;

  // calculate average
  let average = 0;
  for (let i = 0; i < x.length - 1; i++) {
    average += x[i] * dt[i];
  }
  average *= 1 / totalT;

  // calculate sin and cos coefficients
  let coeffArr = [];
  for (let n = 1; n < N; n++) {
    let cosCoeff = 0;
    let sinCoeff = 0;
    for (let i = 0; i < x.length - 1; i++) {
      cosCoeff += x[i] * dt[i] * Math.cos(n * groundFreq * t[i]);
      sinCoeff += x[i] * dt[i] * Math.sin(n * groundFreq * t[i]);
    }
    cosCoeff *= 2 / totalT;
    sinCoeff *= 2 / totalT;
    coeffArr.push({ cos: cosCoeff, sin: sinCoeff, freq: n * groundFreq });
  }

  // // sort descending order (big to small) on the size of the cos and sin coefficients
  // coeffArr.sort(function(a, b) {
  //   let aCoeffMag = a.cos**2 + a.sin**2;
  //   let bCoeffMag = b.cos**2 + b.sin**2;
  //   if (aCoeffMag > bCoeffMag) return -1;
  //   if (aCoeffMag < bCoeffMag) return +1;
  //   return 0;
  // });
  return {
    groundFreq: groundFreq,
    average: average,
    coeff: coeffArr,
  };
}
// calculate the discrete difference i.e. out[n] = in[n+1] - in[n]
function diff(arr: number[]) {
  let diff = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diff.push(arr[i + 1] - arr[i]);
  }
  return diff;
}
