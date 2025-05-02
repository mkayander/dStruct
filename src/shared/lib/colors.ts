export const colors = {
  primary: {
    main: "#556cd6",
    light: "#7986cb",
    dark: "#303f9f",
  },
  secondary: {
    main: "#19857b",
    light: "#4db6ac",
    dark: "#00796b",
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
  },
  success: {
    main: "#4caf50",
    light: "#81c784",
    dark: "#388e3c",
  },
  info: {
    main: "#2196f3",
    light: "#64b5f6",
    dark: "#1976d2",
  },
  question: {
    easy: "#4bffea",
    medium: "#ffc52f",
    hard: "#ff4066",
  },
  tags: {
    "two-pointers": ["#009ab2", "#095abd"],
    "union-find": ["#2a40a6", "#00d9ff"],
    string: ["#a35382", "#70ceac"],
    queue: ["#509e26", "#b2eb50"],
    design: ["#395af9", "#aacafd"],
    array: ["#095abd", "#009ab2"],
    "dynamic-programming": ["#15b792", "#45e88c"],
    graph: ["#abaeff", "#93b9bc"],
    "linked-list": ["#feaa7b", "#abaeff"],
    heap: ["#ec75b1", "#f7cae0"],
  },
} as const;

export const getThemeColors = (isDarkMode: boolean) => ({
  ...colors,
  primary: {
    ...colors.primary,
    main: isDarkMode ? colors.primary.light : colors.primary.main,
  },
  secondary: {
    ...colors.secondary,
    main: isDarkMode ? colors.secondary.light : colors.secondary.main,
  },
  error: {
    ...colors.error,
    main: isDarkMode ? colors.error.light : colors.error.main,
  },
  success: {
    ...colors.success,
    main: isDarkMode ? colors.success.light : colors.success.main,
  },
  info: {
    ...colors.info,
    main: isDarkMode ? colors.info.light : colors.info.main,
  },
});
