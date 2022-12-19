// import Genome from '../models/genome';
// import Organism from '../models/organism';
// import { createImageData, Chromosome } from '../models/utils';
// import square from '../assets/red_square_test.png';

test('evaluate fitness', async () => {
  // const target = 'hello friend';

  // // An Organism whose genome completely matches the target
  // const target = await createImageData(square);
  // const points = [[0, 0], [0, 0], [0, 0]];
  // const color = [0, 0, 0, 0];
  // const chromosomes = new Chromosome(points, color);
  // const organism = new Organism({
  //   genome: new Genome({ size: 1, chromosomes }),
  // });
  // const result = organism.evaluateFitness(target);
  // console.log(result);
  // expect(result).toEqual(0);
  // const organism1 = new Organism(target.length);
  // organism1.genome = target;
  // expect(organism1.evaluateFitness(target)).toEqual(target.length);

  // // An Organism whose genome is off-by-one
  // const organism2 = new Organism(target.length);
  // organism2.genome = 'jello friend';
  // expect(organism2.evaluateFitness(target)).toEqual(target.length - 1);

  // // An Organism whose genome is a complete mismatch
  // const organism3 = new Organism(target.length);
  // // organism3.genome = 'xxxxxxxxxxxx';
  // expect(organism3.evaluateFitness(target)).toEqual(0);
});
