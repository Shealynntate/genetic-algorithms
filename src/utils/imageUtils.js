import gifshot from 'gifshot';
import { canvasParameters } from '../constants/constants';

// Internal Helper Functions
// --------------------------------------------------
/**
 * A helper method that asynchronously creates an Image element
 * @param {*} src - the src parameter for an HTML image element to load
 * @returns a Promise that resolves into the created Image object or an error
 */
const createImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = (error) => reject(error);
  image.src = src;
});

/**
 * A helper method that asynchronously creates an Image element from canvas ImageData
 * @param {*} imageData - an ImageData object of canvas pixel data
 * @returns a new Image object whose src data is set to the ImageData provided
 */
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
