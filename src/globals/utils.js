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

export const createImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = (error) => reject(error);
  image.src = src;
});

export const createImageData = async (src, options = {}) => {
  const image = await createImage(src);
  const { width = canvasParameters.width, height = canvasParameters.height } = options;

  const canvas = document.createElement('canvas', { width, height });
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = width;
  ctx.canvas.height = height;
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

export const fileToText = async (file) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => { resolve(reader.result); };
    reader.onerror = (error) => { reject(error); };
  });
  reader.readAsText(file);

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
  const json = JSON.stringify(data);
  downloadFile(fileName, json, 'application/json', 'json');
};

export const downloadGIF = (fileName, data) => {
  downloadFile(fileName, data, 'image/gif', 'gif');
};

export const download = (filename, contents) => {
  const a = document.createElement('a');
  a.download = filename;
  a.href = contents;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const createGif = async (images) => {
  const { width, height } = canvasParameters;
  const imgs = await Promise.all(images.map(async (image) => (imageDataToImage(image))));
  const promise = new Promise((resolve, reject) => {
    gifshot.createGIF(
      {
        images: imgs,
        frameDuration: 3, // 10 = 1.0 seconds
        sampleInterval: 1, // sampling rate for image quality, 1 is best, 10 is default
        gifWidth: width,
        gifHeight: height,
        numFrames: images.length,
      },
      ({
        error,
        errorCode,
        errorMsg,
        image, // base64 image (gif)
      }) => {
        if (error) {
          reject(new Error(`[Gifshot] ${errorCode}: ${errorMsg}`));
        }
        resolve(image);
      },
    );
  });
  return promise;
};

export const fitnessBounds = (orgs) => {
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  let total = 0;
  orgs.forEach(({ fitness }) => {
    if (fitness < min) min = fitness;
    if (fitness > max) max = fitness;
    total += fitness;
  });

  return [min, total / orgs.length, max];
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

// TODO: Move this!!
const { width, height } = canvasParameters;
const scalePoint = (point) => [Math.round(point[0] * width), Math.round(point[1] * height)];

export const chromosomesToPhenotype = (chromosomes) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  chromosomes.forEach(({ color, points }) => {
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    ctx.beginPath();
    ctx.moveTo(...scalePoint(points[0]));
    for (let i = 1; i < points.length; ++i) {
      ctx.lineTo(...scalePoint(points[i]));
    }
    ctx.closePath();
    ctx.fill();
  });
  return ctx.getImageData(0, 0, width, height);
};

export const computeProb = ({
  startValue,
  endValue,
  startFitness,
  endFitness,
}, fitness) => {
  if (fitness <= startFitness) return startValue;
  if (fitness >= endFitness) return endValue;
  return startValue + fitness * ((endValue - startValue) / (endFitness - startFitness));
};
