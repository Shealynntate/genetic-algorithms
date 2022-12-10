let w = null;
let h = null;

const scalePoint = (point) => [point[0] * w, point[1] * h];

const drawDNA = (ctx, dna) => {
  dna.forEach(({ color, points }) => {
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    ctx.beginPath();
    ctx.moveTo(...scalePoint(points[0]));
    ctx.lineTo(...scalePoint(points[1]));
    ctx.lineTo(...scalePoint(points[2]));
    ctx.closePath();
    ctx.fill();
  });
  return ctx.getImageData(0, 0, w, h);
};

onmessage = ({
  width, height, ctx, data,
}) => {
  w = width;
  h = height;
  const imageData = drawDNA(ctx, data.dna);
  postMessage({ imageData });
};
