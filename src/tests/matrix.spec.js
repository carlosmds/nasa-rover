const {
  canMoveToPosition,
  validateXCoordinate,
  validateYCoordinate,
  createMatrix,
  initializeMatrix,
  printMatrix,
  generateMatrixString
} = require('../matrix.js');

describe("General matrix logic function tests", () => {

  const sampleMatrix = createMatrix('6x6')

  const sizes = ['3x6', '6x6', '6x9', '6x12', '9x12']

  test("it can create matrix with sizes: '3x6', '6x6', '6x9', '6x12', '9x12'", () => {
    sizes.forEach((size) => {
      createMatrix(size)
    })
  });

  test("it cannot create matrix other than sizes: 3x6, 6x6, 6x9, 6x12 and 9x12", () => {
    expect(() => {
      createMatrix('3x3')
    }).toThrow()
  });

  test("test if can move to position", () => {
    expect(canMoveToPosition(sampleMatrix, 2, 2)).toBe(true)
  });

  test("test if can not move to position", () => {
    expect(canMoveToPosition(sampleMatrix, 6, 2)).toBe(false)
  });

  test("it should be a valid matrix X coordinate", () => {
    validateXCoordinate(2, sampleMatrix, 0)
  });

  test("it should be invalid X coordinate", () => {
    expect(() => {
      validateXCoordinate(6, sampleMatrix, 0)
    }).toThrow()
  });

  test("it should be a valid matrix Y coordinate", () => {
    validateYCoordinate(2, sampleMatrix, 0)
  });

  test("it should be invalid Y coordinate", () => {
    expect(() => {
      validateYCoordinate(6, sampleMatrix, 0)
    }).toThrow()
  });

  test("it should initialize an empty matrix without errors", () => {
    initializeMatrix(6, 6, '#')
  });

  test("it should print the matrix without errors", () => {
    printMatrix(sampleMatrix)
  });

  test("it should generate the string that represents the plateau matrix", () => {
    expect(generateMatrixString(sampleMatrix)).toEqual(expect.stringContaining('#'))
  })
});