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
