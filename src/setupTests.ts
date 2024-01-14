// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

interface MyImageData {
  width: number
  height: number
  data: Uint8ClampedArray
}

Object.defineProperty(
  window,
  'ImageData',
  {
    value: class ImageData implements MyImageData {
      constructor (
        public width: number,
        public height: number,
        public data: Uint8ClampedArray
      ) {}
    }
  }
)
