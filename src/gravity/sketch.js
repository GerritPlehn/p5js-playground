// @ts-check
import P5 from 'p5';

/**
 * @param {P5} p
 */
function sketch(p) {
  p.setup = () => {
    p.createCanvas(800, 800);
    p.frameRate(60);
    p.background(255);
    p.circle(400, 400, 700);
  };

  let circleX = 400;
  let circleY = 300;
  let circleSpeedX = 40;
  let circleSpeedY = 0;
  const bounceEfficiency = 0.8;
  const circleSize = 50;
  const gravity = 0.5;
  const airResistance = 0.99;

  p.draw = () => {
    if (Math.abs(circleSpeedX) < 0.1 && Math.abs(circleSpeedY) < 0.1) {
      circleSpeedX = 0;
      circleSpeedY = 0;
      p.circle(circleX, circleY, circleSize);
      return;
    }

    circleSpeedY += gravity;
    circleSpeedY += airResistance;
    circleSpeedX *= airResistance;

    if (p.dist(circleX, circleY, 400, 400) > 350 - circleSize / 2) {
      circleSpeedX *= -bounceEfficiency;
      circleSpeedY *= -bounceEfficiency;
      circleX += circleSpeedX;
      circleY += circleSpeedY;
    }

    circleX += circleSpeedX;
    circleY += circleSpeedY;

    p.circle(circleX, circleY, circleSize);
  };
}

new P5(sketch);
