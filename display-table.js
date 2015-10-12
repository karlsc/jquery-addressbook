var Table = require('cli-table');
var adressList = require('./adress-list.js');

module.exports = function displayInfos(idNumber) {

  var table = new Table();

  var entry = adressList.filter( function(adress) {
    return adress.id === idNumber;
  });

  entry = entry[0];

  table.push(
    { "First Name": entry["First Name"] },
    { "Last Name": entry["Last Name"] },
    { "Birthday": entry["Birthday"] }
  );
  var adressStr = "", count = 0;

  for (var key in entry["Adresses"]) {

    adressStr += (key+":");
    adressStr += ("\n"+entry["Adresses"][key]["street"]);
    adressStr += ("\n"+entry["Adresses"][key]["city"]+", "+entry["Adresses"][key]["province"]+" "+entry["Adresses"][key]["postal code"]);
    adressStr += ("\n"+entry["Adresses"][key]["country"]);

    if (count+1 < Object.keys(entry["Adresses"]).length) {
      adressStr += "\n";
      count ++;
    }
  }
  table.push( { "Adresses": adressStr });

  var phoneStr = "";
  count = 0;
  for (var key in entry["Phones"]) {
    phoneStr += (key+': '+entry["Phones"][key]);
    if (count+1 < Object.keys(entry["Phones"]).length) {
      phoneStr += "\n";
      count ++;
    }
  }
  table.push( {"Phones": phoneStr } );

  var emailStr = "";
  count = 0;
  for (var key in entry["Emails"]) {
    emailStr += (key+': '+entry["Emails"][key]);
    if (count+1 < Object.keys(entry["Emails"]).length) {
      emailStr += "\n";
      count ++;
    }
  }
  table.push( {"Emails": emailStr } );

  console.log(table.toString());

};
