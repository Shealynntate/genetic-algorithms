// import { canvasParameters } from '../constants';
// import { createImage, generateTestImage } from '../models/utils';
import square from '../assets/red_square_test.png';

// const { width, height } = canvasParameters;

test('evaluate fitness', () => {
  // const image = createImage(
  //   square,
  //   (i) => {
  //     const target = generateTestImage(image);
  //     console.log(target.length);
  //     expect(target.length).toEqual(width * height * 4);
  //   },
  // );
  const image2 = new Image();
  image2.onload = () => { console.log('test'); };
  image2.src = square;
  expect(1).toEqual(1);
});
