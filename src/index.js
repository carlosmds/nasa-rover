
const inquirer = require('inquirer');
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const { handleAwnsers, prompts } = require('./app.js')

inquirer.prompt(prompts())
    .then((awnsers) => { handleAwnsers(awnsers) })
    .finally(() => { console.log("\nGoodbye!👋") });