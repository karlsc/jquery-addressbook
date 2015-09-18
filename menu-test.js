var inquirer = require("inquirer");

inquirer.prompt([
  {
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: [
      "Add",
      "Search",
      "Quit"
    ]
  } ], function( answers ) {
    console.log(answers.action);
});
