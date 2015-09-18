var inquirer = require("inquirer");
var adressList = require('./adress-list.js');
var displayTable = require('./display-table.js');
var prompt = require('prompt');

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
    } ], function( answer ) {

      if (answer.action === "Add") {
        mainMenu();
      }
      else if (answer.action === "Search") {

        searchPrompt();

      }
      else if (answer.action === "Display all") {
        selectEntry(adressList, 0);
      }
      else { console.log("Good bye!"); }
  });
};

function searchPrompt() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Search for: ',
    }
  ], function(answer) {
    findMatch(answer.query);
  });
}

function selectEntry(entries, search) {

  var entryChoices = [];
  entries.forEach( function(entry) {
    entryChoices.push(entry["First Name"]+" "+entry["Last Name"]);
  });
  if (search === 1) { entryChoices.push("Make another search"); }
  entryChoices.push("Back to main menu");
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Pick a person",
      choices: entryChoices
    }
  ], function(answer) {

    if (answer.action === "Back to main menu") {
      mainMenu();
    }
    else if (answer.action === "Make another search") {
      searchPrompt();
    }
    else {
      var index = entryChoices.indexOf(answer.action);
      var idNumber = entries[index].id;
      displayTable(idNumber);
    }

  });
}

function findMatch(queryStr) {
  var re = new RegExp(queryStr, "i");
  var entries = [];
  adressList.forEach( function(entry) {
    if (re.test(entry["First Name"]+" "+entry["Last Name"])) {
      entries.push(entry);
    }
    else {
      for (var key in entry["Emails"]) {
        if (re.test(entry["Emails"][key])) {
          entries.push(entry);
          break;
        }
      }
    }
  });
  if ( entries.length > 0) {
    selectEntry(entries, 1);
  }
  else {
    console.log("No matches found.");
    mainMenu();
  }
}

mainMenu();
