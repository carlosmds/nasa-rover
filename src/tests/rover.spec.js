const {
  generateRoverSummary,
  deployRover,
  runInstructions,
  instructRover,
  moveRover,
  updateRoverPosition,
  moveRoverIndicator,
  rotateRover,
  rotateRoverIndicator,
  placeRover,
  getRoverIndicator,
} = require('../rover.js');

const { createMatrix } = require('../matrix.js');

describe("General rover logic functions", () => {
  
  const sampleAwnsers = {
    matrix_size: '6x6',
    debug: false,
    rovers: [
        { position: '1 2 n', instructions: 'lmlmlmlmm', actual_x: 1, actual_y: 2, actual_direction: 'n' },
        { position: '3 3 e', instructions: 'MRRMMRMRRM', actual_x: 3, actual_y: 3, actual_direction: 'e' }
    ]
  }

  const sampleMatrix = createMatrix(sampleAwnsers.matrix_size)
  
  test("it should generate the rover coordinates summary without errors", () => {
    generateRoverSummary(sampleAwnsers.rovers[0], 0)
  });

  test("it should deploy rover without errors", () => {
    deployRover(sampleMatrix, sampleAwnsers.rovers[0], 0)
  });

  test("it should run the rover instructions without errors", () => {
    runInstructions(sampleMatrix, sampleAwnsers.rovers[0], 0, false)
  });

  test("it should run a rovers single instruction without error", () => {
    instructRover(sampleMatrix, sampleAwnsers.rovers[0], sampleAwnsers.rovers[0].instructions.split("")[0], 0)
  });

  test("it should move the rover without throwing errors", () => {
    moveRover(sampleAwnsers.rovers[0], sampleMatrix, 0)
  });

  test("it should update the rovers position", () => {
    updateRoverPosition(sampleAwnsers.rovers[0], sampleMatrix, 2, 2, 0)
  });

  test("it should ignore the update if the rover cannot perform the move (displays warning on the console)", () => {
    updateRoverPosition(sampleAwnsers.rovers[0], sampleMatrix, 6, 6, 0)
  });

  test("it should move the rover indicator on the matrix", () => {
    moveRoverIndicator(sampleAwnsers.rovers[0], sampleMatrix, 2, 2, 0)
  });

  test("it should not throw erros if the rover cannot be moved", () => {
    moveRoverIndicator(sampleAwnsers.rovers[0], sampleMatrix, 6, 6, 0)
  });

  test("it should rotate rover to the right without errors", () => {
    rotateRover('R', sampleAwnsers.rovers[0], sampleMatrix, 0)
  });

  test("it should rotate rover to the left without errors", () => {
    rotateRover('L', sampleAwnsers.rovers[0], sampleMatrix, 0)
  });

  test("it should perform rotate 360", () => {
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'N')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'E')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'S')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'W')
  });

  test("it should perform rotate 360 +reversed 360 without errors", () => {
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'N')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'E')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'S')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'W')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'N')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'W')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'S')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'E')
    rotateRoverIndicator(sampleMatrix, sampleAwnsers.rovers[0], 'N')
  });

  test("it should place the rover on given matrix", () => {
    placeRover(2, 2, 'n', sampleMatrix, 0)
  });

  test("if the rover location does not exist on matrix just skip", () => {
    placeRover(9, 9, 'n', sampleMatrix, 0)
  });

  test("it shoulg get the rover string indicator without errors", () => {
    getRoverIndicator('n', 0)
  });
});