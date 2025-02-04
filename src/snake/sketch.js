// @ts-check
import P5 from 'p5';

/**
 * @param {P5} p
 */
function sketch(p) {
  let snekSpeedX = 1;
  let snekSpeedY = 0;
  /** @type {Number[]} */
  const snekFields = [];

  const fieldWidth = 40;
  const fieldHeight = 30;

  const cellSize = 15;
  let speed = 8;
  const maxSpeed = 3;

  const initSnekSize = 3;

  const field = new Array(fieldWidth * fieldHeight).fill(0);

  p.setup = () => {
    p.createCanvas(cellSize * fieldWidth, cellSize * fieldHeight);
    p.frameRate(10);
    p.background(32);
    initSnek();
    spawnFood();
  };

  p.draw = () => {
    // if (p.frameCount % speed !== 0) return;
    drawField();
    if (isSnekDead()) {
      console.log('Game Over');
      console.log(`Score: ${snekFields.length}`);
      p.noLoop();
      return;
    }
    const eaten = eat();
    moveSnek(eaten);
  };

  function snekHead() {
    const snekHead = snekFields.at(-1);
    if (!snekHead) {
      throw new Error('No Snek Head!');
    }
    return snekHead;
  }

  function snekNextHead() {
    return snekHead() + snekSpeedX + Math.floor(snekSpeedY * fieldWidth);
  }

  function spawnFood() {
    let nextFoodCandiate = Math.floor(Math.random() * field.length);
    while (field[nextFoodCandiate] !== 0) {
      nextFoodCandiate = Math.floor(Math.random() * field.length);
    }
    field[nextFoodCandiate] = 2;
  }

  function eat() {
    const willEat = field[snekNextHead()] === 2;
    if (willEat) {
      if (snekFields.length % 5 === 0) {
        speed = Math.max(speed - 1, 1);
      }
      spawnFood();
    }
    return willEat;
  }

  function moveSnek(ate = false) {
    const nextHead = snekNextHead();
    snekFields.push(nextHead);
    if (!ate) {
      const snekTail = snekFields.shift();
      if (snekTail === undefined) {
        throw new Error('No Snek Tail!');
      }
      field[snekTail] = 0;
    }
    field[nextHead] = 1;
  }

  function initSnek() {
    const snekStart = 0;
    for (let i = snekStart; i < snekStart + initSnekSize; i++) {
      field[i] = 1;
      snekFields.push(i);
    }
  }

  function isSnekDead() {
    const headX = snekHead() % fieldWidth;
    const headY = Math.floor(snekHead() / fieldWidth);
    if (headX === 0 && snekSpeedX < 0) {
      return true;
    }
    if (headX === fieldWidth - 1 && snekSpeedX > 0) {
      return true;
    }
    if (headY === 0 && snekSpeedY < 0) {
      return true;
    }
    if (headY === fieldHeight - 1 && snekSpeedY > 0) {
      return true;
    }
    if (field[snekNextHead()] === 1) {
      // collision with self
      return true;
    }
    return false;
  }

  function drawField() {
    for (let i = 0; i < field.length; i++) {
      switch (field[i]) {
        case 0: // play field
          p.fill(0);
          break;
        case 1: // snek
          p.fill(0, 255, 0);
          break;
        case 2: // apple
          p.fill(255, 0, 0);
          break;
        default:
          console.error(`unknown field value for ${i}:`, field[i]);
      }
      p.stroke(40);
      const row = Math.floor(i / fieldWidth);
      const col = i % fieldWidth;
      p.square(col * cellSize, row * cellSize, cellSize);
    }
  }

  p.keyPressed = () => {
    if (p.keyCode === 87) {
      // W
      if (snekSpeedY < 0) return;
      snekSpeedY = -1;
      snekSpeedX = 0;
    }
    if (p.keyCode === 65) {
      // A
      if (snekSpeedX > 0) return;
      snekSpeedY = 0;
      snekSpeedX = -1;
    }
    if (p.keyCode === 83) {
      // S
      if (snekSpeedY > 0) return;
      snekSpeedY = 1;
      snekSpeedX = 0;
    }
    if (p.keyCode === 68) {
      // D
      if (snekSpeedX < 0) return;
      snekSpeedY = 0;
      snekSpeedX = 1;
    }
  };
}

new P5(sketch);
