import {
  charToCode,
  codeToChar,
  createRandomGenome,
  genCharRange,
  genNumRange,
  randomIndex,
  tweakPoint,
} from '../models/utils';

const startPoint = () => [0.5, 0.5];

test('Adds Gaussian noise to Point', () => {
  genNumRange(100).forEach(() => {
    let p = startPoint();
    p = tweakPoint(...p);
  });
});

test('Converts code to character', () => {
  expect(charToCode('a')).toEqual(97);
  expect(charToCode('z')).toEqual(122);
  expect(charToCode('A')).toEqual(65);
  expect(charToCode('Z')).toEqual(90);
  expect(charToCode(' ')).toEqual(32);
});

test('Converts character to code', () => {
  expect(codeToChar(97)).toEqual('a');
  expect(codeToChar(122)).toEqual('z');
  expect(codeToChar(65)).toEqual('A');
  expect(codeToChar(90)).toEqual('Z');
  expect(codeToChar(32)).toEqual(' ');
});

test('Creates range of characters', () => {
  expect(genCharRange('a', 6)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
});

test('Generates random indices', () => {
  // Setup a dictionary of ten 0 value entries
  const results = {};
  [...Array(10)].forEach((_, i) => { results[i] = 0; });

  // Sample a ton of random indices and keep track of results
  [...Array(1e6)].forEach(() => {
    const index = randomIndex(10);
    results[index] += 1;
  });

  Object.entries(results).forEach(([key, value]) => {
    // Check that only the expcted keys exist in the dictionary
    expect(parseInt(key, 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(key, 10)).toBeLessThan(10);
    // Expect a less than 1% deviation from an idealized distribution
    const ideal = 1e5;
    const ratio = Math.abs(value - ideal) / ideal;
    expect(ratio).toBeLessThan(0.01);
  });
});

test('Creates random Genomes', () => {
  // Check that it creates genomes of the correct length
  [...Array(10)].forEach((_, i) => {
    const genome = createRandomGenome(i);
    expect(genome.length).toEqual(i);
  });

  let duplicateCount = 0;
  const genomeMap = {};
  [...Array(1e5)].forEach(() => {
    const genome = createRandomGenome(20).join('');
    if (genomeMap[genome]) {
      duplicateCount += 1;
      genomeMap[genome] += 1;
    } else {
      genomeMap[genome] = 1;
    }
  });
  // Would not expect any duplicate permutions
  expect(duplicateCount).toEqual(0);
});
