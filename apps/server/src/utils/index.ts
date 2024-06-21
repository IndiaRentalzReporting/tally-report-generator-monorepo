export const modifySvgDimensions = (
  svgStr: string,
  newWidth: number,
  newHeight: number
): string => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  svgElement.setAttribute('width', String(newWidth));
  svgElement.setAttribute('height', String(newHeight));

  const serializer = new XMLSerializer();
  const modifiedSvgStr = serializer.serializeToString(svgElement);

  return modifiedSvgStr;
};
