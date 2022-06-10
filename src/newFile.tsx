import { getDecodedBits } from "./state";

describe("decode message", () => {
  describe("get bits", () => {
    it("should decode NRZ", () => {
      const input = [
        -1,  1,  1, -1,  1,  1, -1, -1,
        -1,  1,  1, -1, -1,  1, -1,  1,
        -1,  1,  1, -1,  1,  1,  1,  1,
        -1,  1,  1, -1,  1,  1,  1, -1,
      ];

      const output = getDecodedBits(input, "NRZ", "Physical");

      expect(output).toEqual([
        0, 1, 1, 0, 1, 1, 0, 0,
        0, 1, 1, 0, 0, 1, 0, 1,
        0, 1, 1, 0, 1, 1, 1, 1,
        0, 1, 1, 0, 1, 1, 1, 0,
      ]);
    });
  });
});
