// https://easings.net/
export const easeOutExpo = (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x));
export const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
export const linear = (x) => x;
