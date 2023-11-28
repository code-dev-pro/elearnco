/**
 * It takes a center point, a radius, and an angle in degrees, and returns the point on the
 * circumference of a circle that corresponds to that angle
 * @param {number} centerX - The x-coordinate of the center of the circle.
 * @param {number} centerY - The y-coordinate of the center of the circle.
 * @param {number} radius - The radius of the circle.
 * @param {number} angleInDegrees - The angle of the point, in degrees, starting from the x-axis and
 * moving clockwise.
 * @returns An object with two properties, x and y.
 */
export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

/**
 * The `describeArc` function calculates the SVG path description for an arc given its center
 * coordinates, radius, start angle, and end angle.
 * @param {number} x - The x parameter represents the x-coordinate of the center of the arc.
 * @param {number} y - The `y` parameter represents the y-coordinate of the center point of the arc.
 * @param {number} radius - The radius parameter represents the distance from the center of the circle
 * to any point on its circumference.
 * @param {number} startAngle - The startAngle parameter represents the starting angle of the arc in
 * degrees.
 * @param {number} endAngle - The `endAngle` parameter represents the end angle of the arc in degrees.
 * @returns The function `describeArc` returns a string representing the path of an arc.
 */
export const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "L",
    start.x,
    start.y,
  ].join(" ");

  return d;
};

/**
 * The `interpolate` function takes in a start value, an end value, and a progress value, and returns
 * the interpolated value between the start and end values based on the progress.
 * @param {number} start - The start parameter represents the starting value of the range you want to
 * interpolate between. It is a number.
 * @param {number} end - The `end` parameter represents the ending value of the range you want to
 * interpolate between.
 * @param {number} t - The parameter "t" represents the interpolation factor, which determines how much
 * of the difference between the start and end values should be applied. It is a number between 0 and
 * 1, where 0 represents the start value and 1 represents the end value.
 * @returns a rounded number that is the result of interpolating between the start and end values based
 * on the given t value.
 */
export const interpolate = (start: number, end: number, t: number): number => {
  return Math.round(start + (end - start) * t);
};

/**
 * The function `rgbToHex` converts RGB values to a hexadecimal color code.
 * @param {number} r - The parameter `r` represents the red value in the RGB color model. It is an
 * integer between 0 and 255, indicating the intensity of red in the color.
 * @param {number} g - The parameter "g" in the rgbToHex function represents the value of the green
 * color component in the RGB color model. It is a number between 0 and 255, indicating the intensity
 * of the green color.
 * @param {number} b - The parameter "b" represents the blue component of the RGB color. It is a number
 * between 0 and 255, indicating the intensity of blue in the color.
 * @returns The function `rgbToHex` returns a string representing the hexadecimal value of the RGB
 * color.
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

/**
 * The function `generateColorPalette` takes a base color and the number of colors desired, and returns
 * an array of hex color codes that gradually interpolate from the base color to white.
 * @param {{ r: number; g: number; b: number } | null} baseColor - The baseColor parameter is an object
 * that represents the RGB values of a color. It has three properties: r, g, and b, which represent the
 * red, green, and blue values respectively. Each value should be a number between 0 and 255.
 * @param {number} numColors - The `numColors` parameter is the number of colors you want to generate
 * in the color palette.
 * @returns The function `generateColorPalette` returns an array of strings representing color values.
 */
export const generateColorPalette = (
  baseColor: { r: number; g: number; b: number } | null,
  numColors: number
): string[] => {
  const colorPalette = [] as string[];
  const step = 1 / numColors;
  if (baseColor)
    for (let i = 0; i < numColors; i++) {
      const t = i * step;
      const r = interpolate(baseColor.r, 255, t);
      const g = interpolate(baseColor.g, 255, t);
      const b = interpolate(baseColor.b, 255, t);
      const color = rgbToHex(r, g, b);
      colorPalette.push(color);
    }

  return colorPalette;
};

export function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
  } | null {
    const hexValue = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (r, g, b) => {
        return r + r + g + g + b + b;
      }
    );
    const rgbValues = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    return rgbValues
      ? {
          r: parseInt(rgbValues[1], 16),
          g: parseInt(rgbValues[2], 16),
          b: parseInt(rgbValues[3], 16),
        }
      : null;
  }
