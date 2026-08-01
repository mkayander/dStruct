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
