import { JSDOM } from 'jsdom';
import jwt from 'jsonwebtoken';
import { UserSelect } from '../models/auth/schema';
import config from '../config';
import UserService from '../services/UserService';
import { NotFoundError } from '@fullstack_package/core-application/errors';

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
