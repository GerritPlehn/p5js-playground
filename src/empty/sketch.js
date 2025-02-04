// @ts-check
import P5 from 'p5';

/**
 * @param {P5} p
 */
function sketch(p) {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(32);
  };
}

new P5(sketch);
