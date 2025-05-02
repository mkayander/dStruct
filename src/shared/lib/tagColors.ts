import { colors } from "./colors";

const tagColors = colors.tags;
type TagKey = keyof typeof tagColors;

export const getTagColors = (slug?: string): [string, string] => {
  if (slug && slug in tagColors) {
    return tagColors[slug as TagKey] as [string, string];
  }

  const colorValues = Object.values(tagColors);
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  return colorValues[randomIndex] as [string, string];
};

export const getTagGradient = (slug?: string): string => {
  const [color1, color2] = getTagColors(slug);
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};
