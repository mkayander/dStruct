export const a11yProps = (index: number, name = "panel") => {
  return {
    id: `${name}-tab-${index}`,
    "aria-controls": `${name}-tabpanel-${index}`,
  };
};
