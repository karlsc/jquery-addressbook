var inquirer = require("inquirer");

mainMenu = function() {
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

      if (answers.action === "Add" || answers.action === "Search") {
        mainMenu();
      }
      else { console.log("Good bye!"); }
  });
}

mainMenu();
