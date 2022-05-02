export const getASCII = (
  message: string,
  radix = 16,
  padToByte = true
): string => {
  return message
    .split("")
    .map((char) =>
      char
        .charCodeAt(0)
        .toString(radix)
        .padStart(padToByte ? 8 : 2, "0")
    )
    .join("")
    .toUpperCase();
};
