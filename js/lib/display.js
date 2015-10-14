var dataFunctions = require('./data');
var $app = $('#app');
var _ = require('underscore');

function displayAddressBooksList(limit, offset) {
    dataFunctions.getAddressBooks(limit, offset).then(
        function(result) {
            $app.html(''); // Clear the #app div
            $app.append('<h2>Address Books List</h2>');
            $app.append('<ul>');
            
            result.addressBooks.forEach(function(ab) {
                $app.find('ul').append('<li data-id="' + ab.id + '">' + ab.name + '</li>');
            });
            
            $app.find('li').on('click', function() {
                var addressBookId = $(this).data('id');
                var addressBookName = $(this).text();
                displayAddressBook(5,0,addressBookId,addressBookName);
            });
            $app.append(
               $("<div class='text-center'/>").append(
                   $("<button class='btn-previous'><</button>")).append(
                       $("<button class='btn-next'>></button>")
               )
            );
            $("button").css("margin","0.5em");
            $(".btn-next").on("click", function(){
                offset += limit;
                return displayAddressBooksList(limit, offset);
            });
            
            if(offset === 0){
                $(".btn-previous").attr("disabled","disabled");
            }
            if (!result.hasNext) {
                $(".btn-next").attr("disabled","disabled");
            }
            $(".btn-previous").on("click", function(){
                offset -= limit;
                return displayAddressBooksList(limit, offset);
            });
        }
    );
}

function displayAddressBook(limit,offset,addressBookId,addressBookName) {
    dataFunctions.getAddressBook(limit,offset,addressBookId).then(function(result){
        $app.html('');
        $app.append("<h2>"+addressBookName+"'s Friends</h2>");
        $app.append('<p class="return-listing"><<< Return to Address Book Listing</p>');
        $(".return-listing").on("click", function(){
            
            displayAddressBooksList(5, 0);
        });
        $app.append('<ul>');
        
        result.addressBook.forEach(function(ab) {
            $app.find('ul').append('<li data-id="' + ab.id + '">' + ab.lastName+', '+ab.firstName + '</li>');
        });
        $app.append(
           $("<div class='text-center'/>").append(
               $("<button class='btn-previous'><</button>")).append(
                   $("<button class='btn-next'>></button>")
           )
        );
        $("button").css("margin","0.5em");
        $(".btn-next").on("click", function(){
            offset += limit;
            return displayAddressBook(limit,offset,addressBookId,addressBookName);
        });
        if(offset === 0){
                $(".btn-previous").attr("disabled","disabled");
            }
            
        if (!result.hasNext) {
            $(".btn-next").attr("disabled","disabled");
        }
        $(".btn-previous").on("click", function(){
            offset -= limit;
            return displayAddressBook(limit,offset,addressBookId,addressBookName);
        });
        
        $('li').on('click', function() {
            displayEntry($(this),addressBookId,addressBookName);
        });
    });
}

function displayEntry(entry, addressBookId, addressBookName) {
    dataFunctions.getEntry(entry, addressBookId, addressBookName).then(function(result) {
        
        if(result.birthday !== undefined) {
            var birthday = new Date(result.birthday);
            var month = birthday .getMonth()+1;
                if (month <= 9) {
                    month = '0'+month.toString();
                }
            var birthdayFormat = birthday.getFullYear()+' / '+month+' / '+ birthday.getDate();
        }
        
        $app.html('');
        $app.append('<h2>'+result.firstName+' '+result.lastName+'</h2>');
        $app.append('<p class="return-listing"><<< Return to Address Book Entries</p>');
        $(".return-listing").on("click", function(){
            displayAddressBook(5,0,addressBookId,addressBookName);
        });
        
        var entryTemplateText = require('raw!./templates/entry-template.ejs');
        var entryTemplate = _.template( entryTemplateText );
        var output = entryTemplate({entry: result, birthday: birthdayFormat});
        $app.append(output);
    });
}

module.exports = {
    displayAddressBooksList: displayAddressBooksList,
    displayAddressBook: displayAddressBook,
    displayEntry: displayEntry
};