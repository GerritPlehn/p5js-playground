import P5 from 'p5';

function createArray<T>(width: number, height: number, defaultValue?: T) {
  const array: T[][] = [];
  for (let i = 0; i < height; i++) {
    array.push(new Array(width).fill(defaultValue));
  }
  return array;
}

function sketch(p: P5) {
  const width = 800;
  const height = 800;
  const cellSize = 2;
  const w = Math.floor(width / cellSize);
  const h = Math.floor(height / cellSize);
  const field = createArray(w, h, 0);
  const grains: [number, number][] = [];
  let changedCells: [number, number][] = [];
  let updateTime = 0;
  let drawTime = 0;

  p.setup = () => {
    p.createCanvas(width, height);
    p.frameRate(144);
    p.noStroke(); // 4862 without stroke, 2730 with stroke
    p.fill(255);
    p.textSize(10);
    p.background(0);
  };

  p.draw = () => {
    drawField();
    updateField();
    p.strokeWeight(5);
    p.stroke(0);
    p.text(`Grains: ${grains.length}`, 10, height - 30);
    p.text(`FPS: ${p.frameRate().toFixed(2)}`, 10, height - 20);
    p.text(`draw: ${drawTime.toFixed(2)}`, 10, height - 10);
    p.text(`update: ${updateTime.toFixed(2)}`, 10, height - 0);
    p.noStroke();
    // if (drawTime > 5) p.noLoop();
    // p.noLoop();
  };

  function updateField() {
    const updateStart = performance.now();
    changedCells = [];
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
        changedCells.push([i, j], [i + 1, j]);

        continue;
      }

      const dir = Math.random() > 0.5 ? -1 : 1;
      const offsetA = j - dir;
      const offsetB = j + dir;
      const cellBelowA = field[i + 1][offsetA];
      const cellBelowB = field[i + 1][offsetB];
      if (cellBelowA === 0) {
        field[i][j] = 0;
        field[i][offsetA] = 1;
        grain[1] = offsetA;
        changedCells.push([i, j], [i, offsetA]);
        continue;
      }
      if (cellBelowB === 0) {
        field[i][j] = 0;
        field[i][offsetB] = 1;
        grain[1] = offsetB;
        changedCells.push([i, j], [i, offsetB]);
      }
    }
    updateTime = performance.now() - updateStart;
  }

  function drawField() {
    const drawStart = performance.now();
    for (const cell of changedCells) {
      // destructive assignment
      const [i, j] = cell;
      // ternary operator
      p.fill(field[i][j] === 1 ? 255 : 0);
      p.square(j * cellSize, i * cellSize, cellSize);
    }
    drawTime = performance.now() - drawStart;
  }

  function spawnSand(mouseX: number, mouseY: number) {
    const row = Math.floor(mouseY / cellSize);
    const col = Math.floor(mouseX / cellSize);
    field[row][col] = 1;
    grains.push([row, col]);
    changedCells.push([row, col]);
  }

  p.mouseDragged = () => {
    for (let i = 0; i < 10; i++) {
      spawnSand(
        p.mouseX + (Math.random() * 10 - 10),
        p.mouseY + (Math.random() * 10 - 10)
      );
    }
  };
}

new P5(sketch);
