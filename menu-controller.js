var inquirer = require("inquirer");
var adressList = require('./adress-list.js');
var displayTable = require('./display-table.js');

function mainMenu() {
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        "Add",
        "Display all",
        "Search",
        "Quit"
      ]
    } ], function( answers ) {

      if (answers.action === "Add" || answers.action === "Search") {
        mainMenu();
      }
      else if (answers.action === "Display all") {
        // adressList.forEach( function(entry) {
        //   console.log(entry["First Name"]+" "+entry["Last Name"]);
        // })
        selectEntry(adressList);
      }
      else { console.log("Good bye!"); }
  });
};

function selectEntry(entries) {

  var entryChoices = [];
  entries.forEach( function(entry) {
    entryChoices.push(entry["First Name"]+" "+entry["Last Name"]);
  })
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Pick a person",
      choices: entryChoices
    }
  ], function(answer) {
    var index = entryChoices.indexOf(answer.action);
    var idNumber = adressList[index].id;
    displayTable(idNumber);
  });
}

mainMenu();
