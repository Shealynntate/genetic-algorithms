import GIFEncoder from './gifEncoder';
import { canvasParameters } from '../constants';

export const genRange = (max) => ([...Array(max).keys()]);

export const genMinMaxRange = (min, max) => ([...Array(max).keys()].slice(min));

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
export const hsv2rgb = (h, s, v) => {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
};

const toHex = (c) => Math.trunc(c * 255).toString(16);

export const rgb2Hex = (r, g, b) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

export const hsvtoHex = (h, s, v) => {
  const rgb = hsv2rgb(h, s, v);
  return rgb2Hex(...rgb);
};

const { width, height } = canvasParameters;

export const createImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = (error) => reject(error);
  image.src = src;
});

export const createImageData = async (src) => {
  const image = await createImage(src);

  const canvas = document.createElement('canvas', { width, height });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  return ctx.getImageData(0, 0, width, height);
};

export const fileToBase64 = async (file) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => { resolve(reader.result); };
    reader.onerror = (error) => { reject(error); };
  });
  reader.readAsDataURL(file);

  return promise;
};

export const downloadFile = (fileName, data, blobType, fileType) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: blobType });
  const href = URL.createObjectURL(blob);
  // Create "a" element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.${fileType}`;
  document.body.appendChild(link);
  link.click();
  // cCean up element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const downloadJSON = (fileName, data) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(fileName, json, 'application/json', 'json');
};

export const createGif = (images, filename) => {
  const encoder = GIFEncoder();
  encoder.setDelay(1e3);
  encoder.setSize(width, height);

  if (!encoder.start()) {
    throw new Error('[GIFEncoder] unable to start encoding process');
  }
  images.forEach((image) => {
    if (!encoder.addFrame(image, true)) {
      throw new Error('[GifEncode] unable to addFrame');
    }
  });
  if (!encoder.finish()) {
    throw new Error('[GIFEncoder] unable to finish encoding process');
  }

  encoder.download(filename);
};
