declare module "jsfft" {
  type Frequency = { real: number; imag: number };
  type InputValue = ComplexArray | number[] | number;
  type Filterer = (frequency: Frequency, i: number, n: number) => void;

  function FFT(input: InputValue): ComplexArray;
  function InvFFT(input: InputValue): ComplexArray;
  function frequencyMap(input: InputValue, filterer: Filterer): ComplexArray;

  class ComplexArray {
    constructor(input: InputValue);

    length: number;
    real: Float32Array;
    imag: Float32Array;

    ArrayType(args: unknown): Float32Array;

    FFT(): ComplexArray;
    InvFFT(): ComplexArray;
    frequencyMap(filterer: Filterer): ComplexArray;

    conjugate(): unknown;

    forEach(iterator: unknown): unknown;

    magnitude(): Float32Array;

    map(
      mapper: (frequency: Frequency, i: number, n: number) => void
    ): ComplexArray;

    toString(): string;
  }
}
