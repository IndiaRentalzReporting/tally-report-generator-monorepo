import { JSDOM } from 'jsdom';

export const modifySvgDimensions = (
  svgStr: string,
  newWidth: number,
  newHeight: number
): string => {
  const dom = new JSDOM(svgStr, { contentType: 'image/svg+xml' });
  const { document } = dom.window;

  const svgElement = document.querySelector('svg');
  if (!svgElement) {
    throw new Error('No SVG element found');
  }

  svgElement.setAttribute('width', String(newWidth));
  svgElement.setAttribute('height', String(newHeight));

  return dom.serialize();
};

export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};
