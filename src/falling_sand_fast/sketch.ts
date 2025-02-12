import P5 from 'p5';

function createArray<T>(width: number, height: number, defaultValue?: T) {
  const array: T[][] = [];
  for (let i = 0; i < height; i++) {
    array.push(new Array(width).fill(defaultValue));
  }
  return array;
}

function sketch(p: P5) {
  const width = 400;
  const height = 400;
  const cellSize = 2;
  const w = Math.floor(width / cellSize);
  const h = Math.floor(height / cellSize);
  const field = createArray(w, h, 0);
  const grains: [number, number][] = [];
  const grains: Record<number, number>[] = [];
  const grains: [number, number][] = [];
  let updateTime = 0;
  let drawTime = 0;

  p.setup = () => {
    p.createCanvas(400, 400);
    p.frameRate(144);
    p.noStroke(); // 4862 without stroke, 2730 with stroke
    p.fill(255);
    p.textSize(10);
  };

  p.draw = () => {
    drawField();
    updateField();
    p.text(`Grains: ${grains.length}`, 10, height - 30);
    p.text(`FPS: ${p.frameRate().toFixed(2)}`, 10, height - 20);
    p.text(`draw: ${drawTime.toFixed(2)}`, 10, height - 10);
    p.text(`update: ${updateTime.toFixed(2)}`, 10, height - 0);
    if (drawTime > 5) p.noLoop();
    // p.noLoop();
  };

  function updateField() {
    const updateStart = performance.now();
    for (const grain of grains) {
      const [i, j] = grain;
      if (i === field.length - 1) {
        continue;
      }
      const cellBelow = field[i + 1][j];
      if (cellBelow === 0) {
        // drop below if below is empty
        field[i][j] = 0;
        field[i + 1][j] = 1;
        grain[0] = i + 1;
        continue;
      }

      const cellBelowL = field[i + 1][j - 1];
      const cellBelowR = field[i + 1][j + 1];
      if (cellBelowL === 0) {
        field[i][j] = 0;
        field[i][j - 1] = 1;
        grain[1] = j - 1;
        continue;
      }
      if (cellBelowR === 0) {
        field[i][j] = 0;
        field[i][j + 1] = 1;
        grain[1] = j + 1;
      }
    }
    updateTime = performance.now() - updateStart;
  }

  function drawField() {
      const [i, j] = cell;
    p.background(0);
    for (const grain of grains) {
      const i = grain[0];
      const [i, j] = cell;
      p.square(j * cellSize, i * cellSize, cellSize);
    }
    drawTime = performance.now() - drawStart;
  }

  function spawSand(mouseX: number, mouseY: number) {
    const row = Math.floor(mouseY / cellSize);
    const col = Math.floor(mouseX / cellSize);
    field[row][col] = 1;
    grains.push([row, col]);
  }

  p.mouseDragged = () => {
    spawSand(p.mouseX, p.mouseY);
  };
}

new P5(sketch);
