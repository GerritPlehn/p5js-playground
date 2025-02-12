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
  const cellSize = 10;
  const w = Math.floor(width / cellSize);
  const h = Math.floor(height / cellSize);
  let field = createArray(w, h, 0);
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(255);
    drawField();
    updateField();
  };

  function updateField() {
    const newField = createArray(w, h, 0);
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        const cell = field[i][j];
        if (cell !== 1) continue;
        if (i === field.length - 1) {
          newField[i][j] = 1;
          continue;
        }
        const cellBelow = field[i + 1][j];
        if (cellBelow === 0) {
          // drop below if below is empty
          newField[i][j] = 0;
          newField[i + 1][j] = 1;
          continue;
        }

        const cellBelowL = field[i + 1][j - 1];
        const cellBelowR = field[i + 1][j + 1];
        if (cellBelowL === 0) {
          newField[i][j] = 0;
          newField[i][j - 1] = 1;
          continue;
        }
        if (cellBelowR === 0) {
          newField[i][j] = 0;
          newField[i][j + 1] = 1;
          continue;
        }

        newField[i][j] = 1;
      }
    }
    field = newField;
  }

  function drawField() {
    // p.stroke(255);

    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        p.fill(field[i][j] * 255);
        p.square(j * cellSize, i * cellSize, cellSize);
      }
    }
  }

  function spawSand(mouseX: number, mouseY: number) {
    const row = Math.floor(mouseY / cellSize);
    const col = Math.floor(mouseX / cellSize);
    field[row][col] = 1;
  }

  p.mouseDragged = () => {
    spawSand(p.mouseX, p.mouseY);
  };
}

new P5(sketch);
