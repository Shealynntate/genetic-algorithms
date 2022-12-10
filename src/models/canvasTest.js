import { canvasParameters } from '../constants';

const { width, height } = canvasParameters;

const runCount = 10_000;

const scalePoint = (point) => [point[0] * width, point[1] * height];

// Web GL
// ----------------------------------------
export const runWebGLExample = () => {
  const options = { width, height };
  const canvas = document.createElement('canvas', options);
  canvas.width = width;
  canvas.height = height;
  // document.body.appendChild(canvas);
  const gl = canvas.getContext('webgl2');

  // ----------------------------------------
  const vertices = [
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ];
  const indices = [0, 1, 2];
  // Create empty buffer object for vertex buffer
  const vertexBuffer = gl.createBuffer();
  // Create an empty buffer object to store Index buffer
  const indexBuffer = gl.createBuffer();

  // Vertex shader source code
  const vertCode = `
    attribute vec3 coordinates;
    void main(void) {
      gl_Position = vec4(coordinates, 1.0);
    }
  `;
  // Create a vertex shader object
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);
  // Compile the vertex shader
  gl.compileShader(vertShader);

  // eslint-disable-next-line no-unused-vars
  const pixels = new Uint8ClampedArray(width * height * 4);

  // Bind appropariate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Bind the appropriate array buffer to it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // Pass the vertex data to the buffer
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  // Unbind the buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Fragment shader source code
  const fragCode = `
    void main(void) {
      gl_FragColor = vec4(0.5, 1.0, 0.5, 1.0);
    }
  `;
  // Create fragment shader object
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);
  // Compile the fragment shader
  gl.compileShader(fragShader);
  // Create a shader program object to store the combined shader program
  const shaderProgram = gl.createProgram();
  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);
  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);
  // Link both the programs
  gl.linkProgram(shaderProgram);
  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Bind index buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // Get the attribute location
  const coord = gl.getAttribLocation(shaderProgram, 'coordinates');
  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  // Enable the depth test
  // gl.enable(gl.DEPTH_TEST);
  // CLear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Set the view port
  gl.viewport(0, 0, canvas.width, canvas.height);

  console.time('WebGL Test');
  // ----------------------------------------
  for (let i = 0; i < runCount; ++i) {
    // Associating shaders to buffer objects
    // ----------------------------------------

    // Drawing the triangle
    // ----------------------------------------

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // ----------------------------------------
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  }
  console.timeEnd('WebGL Test');
};

export const runContext2DExample = () => {
  const options = { width, height };
  const canvas = document.createElement('canvas', options); // .transferControlToOffscreen();
  canvas.width = width;
  canvas.height = height;
  // document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // ----------------------------------------
  const color = [100, 255, 100, 1];
  const points = [
    [0.1, 0.1],
    [0.1, 0.8],
    [0.7, 0.1],
  ];
  console.time('Context 2D Test');
  for (let i = 0; i < runCount; ++i) {
    // ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    ctx.beginPath();
    ctx.moveTo(...scalePoint(points[0]));
    ctx.lineTo(...scalePoint(points[1]));
    ctx.lineTo(...scalePoint(points[2]));
    ctx.closePath();
    ctx.fill();

    // eslint-disable-next-line no-unused-vars
    const check = ctx.getImageData(0, 0, width, height);
  }
  console.timeEnd('Context 2D Test');
};
