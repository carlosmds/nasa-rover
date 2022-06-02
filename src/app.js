#! /usr/bin/env node

const prompts = () => {
    return [ 
        {
            name: "matrix_size",
            type: "list",
            message: "🪐 Welcome to NASA rovers console. Choose from one of the predefined sizes to represent the plateau to be explored in Mars. 🔭✨",
            choices: ["3x6", "6x6", "6x9", '6x12', '9x12'],
        },
        {
            name: "debug",
            type: "confirm",
            message: "🔍 Do you want to see output frames of the matrix for each instruction? (default No)",
            default: false
        },
        {
            type: "loop",
            name: "rovers",
            message: "🤖 Add rover deployment (default Yes)",
            default: false,
            questions: [
                {
                    type: "input",
                    name: "position",
                    message: "Enter rover initial position as `x y N,S,E,W`, for example: 1 2 N ->",
                },
                {
                    type: "input",
                    name: "instructions",
                    message: "Enter rover instructions using the letters `L`, `R` and `M`, for example: LMLMLMLMM ->",
                },
            ],
        },
    ];
}

module.exports = { 
    prompts,
    handleAwnsers,
    startApp,
    playRovers,
    parsePosition,
    validateRoverPosition,
    validateRoverInstructions,
    validateDirection,
    validateInstruction,
};

const { createMatrix, validateXCoordinate, validateYCoordinate } = require('./matrix.js');
const { deployRover, runInstructions, generateRoverSummary } = require('./rover.js');

function handleAwnsers(awnsers) {
    try {
        let plateauMatrix = createMatrix(awnsers.matrix_size)
        startApp(plateauMatrix, awnsers.rovers, awnsers.debug)
    } catch (error) {
        console.log("\n"+error+" Consider picking a larger plateau");
    }
}
function startApp(plateauMatrix, rovers, debug) {
    // handles rovers logic and prints results
    playRovers(plateauMatrix, rovers, debug).forEach(result => console.log(result))
}
function playRovers(matrix, rovers, debug) {
    results = []
    rovers.forEach((rover, rover_index) => {
        validateRoverPosition(rover.position, matrix, rover_index+1)
        validateRoverInstructions(rover.instructions, rover_index+1)
        deployedRover = deployRover(matrix, rover, rover_index+1)
        runInstructions(matrix, deployedRover, rover_index+1, debug)
        results.push(generateRoverSummary(deployedRover, rover_index+1));
    })
    return results
}
function parsePosition(initial_position) {
    data = initial_position.split(' ')
    return {
        x: data[0],
        y: data[1],
        direction: data[2]
    }
}
function validateRoverPosition(positionCoordinates, matrix, rover_index) {
    data = parsePosition(positionCoordinates)
    validateXCoordinate(data.x, matrix, rover_index)
    validateYCoordinate(data.y, matrix, rover_index)
    validateDirection(data.direction.toUpperCase(), rover_index)
}
function validateRoverInstructions(instructionsInput, rover_index) {
    data = [...instructionsInput]
    data.forEach(instruction => {
        validateInstruction(instruction, rover_index)
    });
}
function validateDirection(direction, rover_index) {
    switch (direction.toUpperCase()) {
        case 'N':
        case 'S':
        case 'W':
        case 'E':
            break;
        default:
            throw `❌ Sorry, '${direction}' is not a valid direction for rover #${rover_index}.`
    }
    return
}
function validateInstruction(instruction, rover_index) {
    switch (instruction.toUpperCase()) {
        case 'L':
        case 'R':
        case 'M':
            break;
        default:
            throw `❌ Sorry, '${instruction}' is not a valid instruction for rover #${rover_index}.`
    }
    return
}