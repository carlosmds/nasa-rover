const {
    prompts,
    handleAwnsers,
    startApp,
    playRovers,
    parsePosition,
    validateRoverPosition,
    validateRoverInstructions,
    validateDirection,
    validateInstruction,
} = require('../app.js');

const { createMatrix } = require('../matrix.js');

require('jest');

describe("General application logic tests", () => {

    const validAwnsers = {
        matrix_size: '6x6',
        debug: false,
        rovers: [
            { position: '1 2 n', instructions: 'lmlmlmlmm', actual_x: 1, actual_y: 2, actual_direction: 'n' },
            { position: '3 3 e', instructions: 'MRRMMRMRRM', actual_x: 3, actual_y: 3, actual_direction: 'e' }
        ]
    }

    const invalidAwnsers = {
        matrix_size: '1x1',
        debug: false,
        rovers: [
            { position: '1 x x', instructions: '0lmm0' },
            { position: 'x 3 e', instructions: '1mmrr' }
        ]
    }

    test("`prompts` should be an array with 3 main elements", () => {
        expect(prompts().length).toBe(3)
    });

    test("valid awnsers should be handled without errors", () => {
        handleAwnsers(validAwnsers)
    });

    test("invalid awnsers also should not throw exceptions, but parsed messages", () => {
        handleAwnsers(invalidAwnsers)
    });

    test("application should be started without errors", () => {
        startApp(createMatrix(validAwnsers.matrix_size), validAwnsers.rovers, false)
    });

    test("application should be started without errors even on debug mode", () => {
        startApp(createMatrix(validAwnsers.matrix_size), validAwnsers.rovers, true)
    });

    test("rovers should be played without errors", () => {
        playRovers(createMatrix(validAwnsers.matrix_size), validAwnsers.rovers, false)
    });

    test("on invalid awnsers rovers should throw errors when played", () => {
        expect(() => { playRovers( createMatrix(validAwnsers.matrix_size), invalidAwnsers.rovers, false) }).toThrow()
    });

    test("parse position should return an object with coordinates data", () => {
        const data = parsePosition(validAwnsers.rovers[0].position)
        expect(data).toHaveProperty('x')
        expect(data).toHaveProperty('y')
        expect(data).toHaveProperty('direction')
    });

    test("`validateRoverPosition` shouldn't throw errors with validAwnsers", () => {
        validateRoverPosition(validAwnsers.rovers[0].position, createMatrix(validAwnsers.matrix_size), 0)
    });

    test("`validateRoverPosition` should throw errors with invalidAwnsers", () => {
        expect(() => {
            validateRoverPosition(invalidAwnsers.rovers[0].position, createMatrix(validAwnsers.matrix_size), 0)
        }).toThrow()
    });

    test("`validateRoverInstructions` shouldn't throw errors with validAwnsers", () => {
        validateRoverInstructions(validAwnsers.rovers[0].instructions, 0)
    });

    test("`validateRoverInstructions` should throw errors with invalidAwnsers", () => {
        expect(() => {
            validateRoverInstructions(invalidAwnsers.rovers[0].instructions, 0)
        }).toThrow()
    });

    test("`validateDirection` shouldn't throw errors with validAwnsers", () => {
        validateDirection(parsePosition(validAwnsers.rovers[0].position).direction, 0)
    });

    test("`validateDirection` should throw errors with invalidAwnsers", () => {
        expect(() => {
            validateDirection(parsePosition(invalidAwnsers.rovers[0].position).direction, 0)
        }).toThrow()
    });

    test("`validateInstruction` shouldn't throw errors with validAwnsers", () => {
        validateInstruction(validAwnsers.rovers[0].instructions.split("")[0], 0)
    })

    test("`validateInstruction` should throw errors with invalidAwnsers", () => {
        expect(() => {
            validateInstruction(invalidAwnsers.rovers[0].instructions.split("")[0], 0)
        }).toThrow()
    });
});