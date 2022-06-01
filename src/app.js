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
    generateRoverSummary,
    deployRover,
    parsePosition,
    runInstructions,
    instructRover,
    moveRover,
    updateRoverPosition,
    canMoveToPosition,
    moveRoverIndicator,
    rotateRover,
    rotateRoverIndicator,
    placeRover,
    getRoverIndicator,
    validateRoverPosition,
    validateRoverInstructions,
    validateXCoordinate,
    validateYCoordinate,
    validateDirection,
    validateInstruction,
    createMatrix,
    initializeMatrix,
    printMatrix,
    generateMatrixString
};

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
function parsePosition(initial_position) {
    data = initial_position.split(' ')
    return {
        x: data[0],
        y: data[1],
        direction: data[2]
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
function canMoveToPosition(matrix, new_x, new_y) {
    return (matrix[new_y] !== undefined && matrix[new_y][new_x] !== undefined && matrix[new_y][new_x] == '#')
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