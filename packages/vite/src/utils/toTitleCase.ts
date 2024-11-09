export const toTitleCase = (str: string) => str.replace(
  /\b\w+(?:_\w+)*/g,
  (txt) => (txt.includes('_')
    ? txt.replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    : txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
);
