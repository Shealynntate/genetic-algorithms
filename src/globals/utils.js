import gifshot from 'gifshot';
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

const imageDataToImage = async (imageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d').putImageData(imageData, 0, 0);

  return createImage(canvas.toDataURL());
};

export const downloadFile = (fileName, data, blobType, fileType) => {
  const blob = new Blob([data], { type: blobType });
  const href = URL.createObjectURL(blob);
  // Create "a" element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.${fileType}`;
  document.body.appendChild(link);
  link.click();
  // Cean up element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const downloadJSON = (fileName, data) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(fileName, json, 'application/json', 'json');
};

export const downloadGIF = (fileName, data) => {
  downloadFile(fileName, data, 'image/gif', 'gif');
};

export const createGif = async (images, filename) => {
  const imgs = await Promise.all(images.map(async (image) => (imageDataToImage(image))));
  gifshot.createGIF(
    {
      images: imgs,
      frameDuration: 5, // 10 = 1.0 seconds
    },
    ({
      error,
      errorCode,
      errorMsg,
      image, // base64 image (gif)
    }) => {
      if (error) {
        throw new Error(`[Gifshot] ${errorCode}: ${errorMsg}`);
      }
      // Download the GIF
      const a = document.createElement('a');
      a.download = filename;
      a.href = image;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  );
};
