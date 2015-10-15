var displayFunctions = require('./lib/display');
$(document).foundation();

var Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
    routes: {
        'addressbooks(/page:pageNum)': 'showAddressBooks',
        'addressbooks/:id(/page:pageNum)': 'showAddressBook',
        'entry/:id': 'showEntry',
        '': 'showAddressBooks'
    },
    
    showAddressBooks: displayFunctions.displayAddressBooksList,
    showAddressBook: displayFunctions.displayAddressBook,
    showEntry: displayFunctions.displayEntry
});

var myRouter = new AppRouter();
Backbone.history.start();