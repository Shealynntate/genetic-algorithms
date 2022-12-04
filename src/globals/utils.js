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

export const downloadFile = (fileName, data) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  // Create "a" element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  // cCean up element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

// [0, 100, 200, 300, 400, 600, 800, 1000, 1500, 2000, ...]
// const saveThresholds = [
//   { threshold: 50, mod: 10 },
//   { threshold: 100, mod: 50 },
//   { threshold: 300, mod: 100 },
//   { threshold: 1000, mod: 200 },
//   { threshold: 5000, mod: 500 },
//   { threshold: 10000, mod: 1000 },
//   { threshold: Math.MAX_SAFE_INTEGER, mod: 5000 },
// ];

export const shouldSaveGenImage = (genId) => {
  let mod = 5000;
  if (genId <= 10000) {
    mod = 1000;
  }
  if (genId <= 5000) {
    mod = 500;
  }
  if (genId <= 1000) {
    mod = 200;
  }
  if (genId <= 300) {
    mod = 100;
  }
  if (genId <= 100) {
    mod = 50;
  }
  if (genId <= 60) {
    mod = 20;
  }
  return (genId % mod) === 0;
};
