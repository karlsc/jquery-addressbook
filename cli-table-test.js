var Table = require('cli-table');

var table = new Table();

table.push(
  { "First Name": "Marjorie" },
  { "Last Name": "G. Nguyen" },
  { "Birthday": "January 15, 1959" },
  { "Adress": "home: \n159 Karen Lane\nBougonville, QC H0E 1V1\nCanada" },
  { "Phones": "home: 502-806-2996\nwork: 681-913-8349\nother: 432-342-5435" },
  { "Emails": "home: MarjorieNguyen@dayrep.com\nwork: mgnguyen@megacorp.com" }
);

console.log(table.toString());
