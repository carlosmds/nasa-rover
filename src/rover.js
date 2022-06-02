#! /usr/bin/env node

module.exports = { 
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
    getRoverIndicator
};

const { parsePosition } = require('./app.js');
const { printMatrix, canMoveToPosition } = require('./matrix.js');

function generateRoverSummary(rover, rover_index) {
    return `\nRover #${rover_index} (${rover.actual_x},${rover.actual_y},${rover.actual_direction})`
}
function deployRover(matrix, rover, rover_index) {
    roverData = parsePosition(rover.position)
    placeRover(roverData.x, roverData.y, roverData.direction, matrix, rover_index)
    return {
        ...rover, 
        actual_x: roverData.x, 
        actual_y: roverData.y, 
        actual_direction: roverData.direction 
    }
}
function runInstructions(matrix, rover, rover_index, debug) {
    rover.instructions
    .split("")
    .forEach((instruction, i) => {
        if (debug) console.log(`Running rover #${rover_index}(${rover.actual_x},${rover.actual_y},${rover.actual_direction}) instruction #${i} '${instruction}'`);
        if (debug) printMatrix(matrix)
        instructRover(matrix, rover, instruction, rover_index)
        if (debug) console.log("Result:");
        if (debug) printMatrix(matrix)
    });
}
function instructRover(matrix, rover, instruction, rover_index) {
    switch (instruction.toUpperCase()) {
        case 'R':
        case 'L':
            rotateRover(instruction, rover, matrix, rover_index)
            break;
        case 'M':
            moveRover(rover, matrix, rover_index)
            break;
    }
}
function moveRover(rover, matrix, rover_index) {
    y = parseInt(rover.actual_y)
    x = parseInt(rover.actual_x)
    switch (rover.actual_direction.toUpperCase()) {
        case 'N':
            y += 1
            break;
        case 'S':
            y -= 1
            break;
        case 'W':
            x -= 1 
            break;
        case 'E':
            x += 1 
            break;
    }
    updateRoverPosition(rover, matrix, x, y, rover_index)
}
function updateRoverPosition(rover, matrix, new_x, new_y, rover_index) {
    if (canMoveToPosition(matrix, new_x, new_y)) {
        moveRoverIndicator(rover, matrix, new_x, new_y, rover_index)
        rover.actual_x = new_x
        rover.actual_y = new_y
    } else {
        console.log(`\n❕Warning: rover #${rover_index} couldn't move to ${new_x},${new_y} coordinates on the plateau.`);
    }
}
function moveRoverIndicator(rover, matrix, new_x, new_y, index) {
    if (canMoveToPosition(matrix, new_x, new_y)) {
        matrix[new_y][new_x] = getRoverIndicator(rover.actual_direction, index)
        matrix[rover.actual_y][rover.actual_x] = "#"
    }
}
function rotateRover(instruction, rover, matrix, rover_index) {
    switch (rover.actual_direction.toUpperCase()) {
        case 'N':
            switch (instruction.toUpperCase()) {
                case 'L':
                    new_direction = 'W'
                    break;
                case 'R':
                    new_direction = 'E'
                    break;
            }
            break;
        case 'S':
            switch (instruction.toUpperCase()) {
                case 'L':
                    new_direction = 'E'
                    break;
                case 'R':
                    new_direction = 'W'
                    break;
            }
            break;
        case 'W':
            switch (instruction.toUpperCase()) {
                case 'L':
                    new_direction = 'S'
                    break;
                case 'R':
                    new_direction = 'N'
                    break;
            }
            break;
        case 'E':
            switch (instruction.toUpperCase()) {
                case 'L':
                    new_direction = 'N'
                    break;
                case 'R':
                    new_direction = 'S'
                    break;
            }
            break;
    }
    rotateRoverIndicator(matrix, rover, new_direction, rover_index)
}
function rotateRoverIndicator(matrix, rover, new_direction, rover_index) {
    matrix[rover.actual_y][rover.actual_x] = getRoverIndicator(new_direction, rover_index)
    rover.actual_direction = new_direction
}
function placeRover(xCoordinate, yCoordinate, direction, matrix, rover_index) {
    if (canMoveToPosition(matrix, xCoordinate, yCoordinate)) {
        matrix[yCoordinate][xCoordinate] = getRoverIndicator(direction, rover_index)
    } else {
        console.log(`\n❕Warning: rover #${rover_index} couldn't be placed in ${xCoordinate},${yCoordinate} coordinates on the plateau.`);
    }
}
function getRoverIndicator(direction, index) {
    switch (direction.toUpperCase()) {
        case 'N':
            indicator = "⏫"
            break;
        case 'S':
            indicator = "⏬"
            break;
        case 'E':
            indicator = "⏩"
            break;
        case 'W':
            indicator = "⏪"
            break;
    }
    return `#${index}${indicator}`
}