import gifshot from 'gifshot';
import { canvasParameters } from '../constants/constants';

// Internal Helper Functions
// --------------------------------------------------
/**
 * An helper method that asynchronously creates an Image element
 * @param {*} src - the src parameter for an HTML image element to load
 * @returns a Promise that resolves into the created Image object or an error
 */
const createImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = (error) => reject(error);
  image.src = src;
});

const imageDataToImage = async (imageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d').putImageData(imageData, 0, 0);

  return createImage(canvas.toDataURL());
};

const scalePoint = (point, { w, h }) => [point[0] * w, point[1] * h];

// Canvas, ImageData and Phenotype Functions
// --------------------------------------------------
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

export const chromosomesToCanvas = ({
  chromosomes,
  ctx,
  w,
  h,
}) => {
  chromosomes.forEach(({ color, points }) => {
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    ctx.beginPath();
    ctx.moveTo(...scalePoint(points[0], { w, h }));
    for (let i = 1; i < points.length; ++i) {
      ctx.lineTo(...scalePoint(points[i], { w, h }));
    }
    ctx.closePath();
    ctx.fill();
  });
};

export const chromosomesToPhenotype = (chromosomes) => {
  const { width, height } = canvasParameters;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  chromosomesToCanvas({
    chromosomes,
    ctx,
    w: width,
    h: height,
  });

  return ctx.getImageData(0, 0, width, height);
};

// File Conversion and Download Functions
// --------------------------------------------------
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
