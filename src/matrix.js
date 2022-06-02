#! /usr/bin/env node

module.exports = { 
    canMoveToPosition,
    validateXCoordinate,
    validateYCoordinate,
    createMatrix,
    initializeMatrix,
    printMatrix,
    generateMatrixString
};

function canMoveToPosition(matrix, new_x, new_y) {
    return (matrix[new_y] !== undefined && matrix[new_y][new_x] !== undefined && matrix[new_y][new_x] == '#')
}
function validateXCoordinate(xCoordinate, matrix, rover_index) {
    xMaxValue = parseInt(matrix[0].length-1);
    if (isNaN(xCoordinate) || xCoordinate > xMaxValue) {
        throw `❌ Sorry, '${xCoordinate}' is not a valid 'X' coordinate for rover #${rover_index}. (max ${xMaxValue})`
    }
    return
}
function validateYCoordinate(yCoordinate, matrix, rover_index) {
    yMaxValue = (parseInt(matrix.length)-1);
    if (isNaN(yCoordinate) || yCoordinate > yMaxValue) {
        throw `❌ Sorry, '${yCoordinate}' is not a valid 'Y' coordinate for rover #${rover_index}. (max ${yMaxValue})`
    }
    return
}
function createMatrix(matrixSize) {
    switch (matrixSize) {
        case '3x6':
            var matrix = initializeMatrix(3, 6, '#')
            break;
        case '6x6':
            var matrix = initializeMatrix(6, 6, '#')
            break;
        case '6x9':
            var matrix = initializeMatrix(6, 9, '#')
            break;
        case '6x12':
            var matrix = initializeMatrix(6, 12, '#')
            break;
        case '9x12':
            var matrix = initializeMatrix(9, 12, '#')
            break;
        default:
            throw `❌ Sorry, '${matrixSize}' is not a valid size.`
    }
    return matrix
}
function initializeMatrix(rows, cols, defaultValue){
    var arr = []
    for(var i=0; i < rows; i++){
        arr.push([])
        arr[i].push(new Array(cols))
        for(var j=0; j < cols; j++) arr[i][j] = defaultValue
    }
    return arr
}
function printMatrix(matrix) {
    console.log(generateMatrixString(matrix)) 
}
function generateMatrixString(matrix) {
    let txt = "\n";
    for (var column = 0; column < matrix[0].length; column++) txt += `\t.${column}`;
    txt += "\n";
    for(var row = matrix.length-1; row >= 0; row--) {
        txt += `.${row}`
        for(var column = 0; column < matrix[row].length; column++) {
            txt += `\t${matrix[row][column]}`
        }
        txt += "\n"
    }
    return txt
}