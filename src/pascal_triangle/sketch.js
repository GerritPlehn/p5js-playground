// @ts-check
import P5 from 'p5';

const colors = ['red', 'green', 'blue'];

const baseWidth = 10;
const circleDiameter = 400 / 15;
const circleRadius = circleDiameter / 2;
/** @type Array<Number> */
const circleColors = new Array((baseWidth * (baseWidth + 1)) / 2).fill(0);

/**
 * @param {P5} p
 */
function sketch(p) {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.frameRate(60);
    p.background(32);
    p.ellipseMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = () => {
    for (let row = 0, index = 0; row < baseWidth; row++) {
      const rowWidth = baseWidth - row;
      for (let col = 0; col < rowWidth; col++) {
        p.fill(colors[circleColors[index]]);

        const circleTopLeftX = col * circleDiameter;
        const circleTopLeftY = row * circleDiameter;
        const rowOffset = (row / 2) * circleDiameter;
        p.circle(
          circleTopLeftX + rowOffset + circleRadius,
          circleTopLeftY + circleRadius,
          circleDiameter
        );

        p.fill(0);
        p.text(
          index,
          circleTopLeftX + rowOffset + circleRadius,
          circleTopLeftY + circleRadius
        );
        index++;
      }
    }
  };
  p.mouseClicked = () => {
    for (let i = 0; i < baseWidth; i++) {
      const circleMiddleX = i * circleDiameter + circleRadius;
      const circleMiddleY = circleRadius;
      const mouseCircleDist = p.dist(
        p.mouseX,
        p.mouseY,
        circleMiddleX,
        circleMiddleY
      );
      if (mouseCircleDist < circleRadius) {
        console.log(`circle ${i} has been clicked`);
        circleColors[i] = (circleColors[i] + 1) % colors.length;
        refreshColors();
      }
    }
  };
}

function refreshColors() {
  for (let row = 1, index = baseWidth; row < baseWidth; row++) {
    const rowWidth = baseWidth - row;
    for (let col = 0; col < rowWidth; col++) {
      circleColors[index] = determineColor(row, index);
      index++;
    }
  }
}

/**
 *
 * @param {number} row
 * @param {number} index
 */
function determineColor(row, index) {
  const rowWidth = baseWidth - row;
  const leftParentIndex = index - (rowWidth + 1);
  const rightParentIndex = leftParentIndex + 1;
  if (circleColors[leftParentIndex] === circleColors[rightParentIndex]) {
    return circleColors[leftParentIndex];
  }

  for (let i = 0; i < colors.length; i++) {
    if (
      i !== circleColors[leftParentIndex] &&
      i !== circleColors[rightParentIndex]
    )
      return i;
  }
}

new P5(sketch);
