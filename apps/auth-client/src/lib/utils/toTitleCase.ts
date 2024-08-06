export const toTitleCase = <T extends string>(str: T): T => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  ) as T;
};
