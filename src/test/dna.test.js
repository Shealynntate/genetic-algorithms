import DNA from '../models/dna';

test('Crossover Point', () => {
  const points1 = [[1, 1], [1, 1], [1, 1]];
  const points2 = [[2, 2], [2, 2], [2, 2]];
  const dna1 = new DNA(points1);
  const dna2 = new DNA(points2);

  DNA.crossoverPoint(dna1, dna2, 1);
  expect(dna1.points).toEqual([[1, 1], [2, 2], [2, 2]]);
  expect(dna2.points).toEqual([[2, 2], [1, 1], [1, 1]]);
});
