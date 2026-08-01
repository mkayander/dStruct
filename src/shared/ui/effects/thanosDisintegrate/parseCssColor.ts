export type RgbaColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

const clampByte = (value: number): number =>
  Math.min(255, Math.max(0, Math.round(value)));

export const parseCssColor = (color: string): RgbaColor | null => {
  const trimmed = color.trim();
  if (
    trimmed === "" ||
    trimmed === "transparent" ||
    trimmed === "currentcolor"
  ) {
    return null;
  }

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        red: parseInt(hex[0]! + hex[0]!, 16),
        green: parseInt(hex[1]! + hex[1]!, 16),
        blue: parseInt(hex[2]! + hex[2]!, 16),
        alpha: 1,
      };
    }
    if (hex.length === 6) {
      return {
        red: parseInt(hex.slice(0, 2), 16),
        green: parseInt(hex.slice(2, 4), 16),
        blue: parseInt(hex.slice(4, 6), 16),
        alpha: 1,
      };
    }
    return null;
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (!rgbMatch) {
    return null;
  }

  const alpha =
    rgbMatch[4] === undefined
      ? 1
      : Math.min(1, Math.max(0, Number(rgbMatch[4])));
  if (alpha <= 0.04) {
    return null;
  }

  return {
    red: clampByte(Number(rgbMatch[1])),
    green: clampByte(Number(rgbMatch[2])),
    blue: clampByte(Number(rgbMatch[3])),
    alpha,
  };
};

export const rgbaToCss = ({ red, green, blue }: RgbaColor): string =>
  `rgb(${red}, ${green}, ${blue})`;

/** Alpha-composites `foreground` over `background` (both premultiplied-friendly inputs). */
export const blendColors = (
  foreground: RgbaColor,
  background: RgbaColor,
): RgbaColor => {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (alpha <= 0.04) {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }

  const blendChannel = (foregroundChannel: number, backgroundChannel: number) =>
    (foregroundChannel * foreground.alpha +
      backgroundChannel * background.alpha * (1 - foreground.alpha)) /
    alpha;

  return {
    red: clampByte(blendChannel(foreground.red, background.red)),
    green: clampByte(blendChannel(foreground.green, background.green)),
    blue: clampByte(blendChannel(foreground.blue, background.blue)),
    alpha,
  };
};
