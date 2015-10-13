var dataFunctions = require('./data');
var $app = $('#app');

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
        $app.append("<h2>"+addressBookName+"'s Address Book</h2>");
        $app.append('<p class="return-listing">Return to address book listing</p>');
        $(".return-listing").on("click", function(){
            
            displayAddressBooksList(5, 0);
        });
        $app.append('<ul>');
        
        result.addressBook.forEach(function(ab) {
            $app.find('ul').append('<li data-id="' + ab.id + '">' + ab.lastName+', '+ab.firstName + '</li>');
        });
        
        $app.append("<button class='btn-previous'><</button>");
        $app.append("<button class='btn-next'>></button>");
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
            var birthdayFormat = birthday.getFullYear()+'-'+month+'-'+ birthday.getDate();
        }
        
        $app.html(''); // Clear the #app div
        $app.append('<h2>'+result.firstName+' '+result.lastName+'</h2>');
        $app.append('<p class="return-listing">Return to address book listing</p>');
        $(".return-listing").on("click", function(){
            displayAddressBook(5,0,addressBookId,addressBookName);
        });
        
        $app.append('<table class="main-table"/>');
        $('.main-table').append('<tr><th>Name:</th><td>'+result.lastName+', '+result.firstName+'</td></tr>');
        $('.main-table').append('<tr><th>Birthday:</th><td>'+birthdayFormat+'</td></tr>');
        $('.main-table').append('<tr><th>Address(es):</th><td class="address-table"></td></tr>');
        for (var i = 0; i < result.addresses.length ; i++) {
            var $ul1 = $('<ul class="vcard"/>');
            $ul1.append('<li>'+result.addresses[i].type+':</li>');
            $ul1.append('<li>'+result.addresses[i].line1+'</li>');
            if (result.addresses[i].line2) {
                $ul1.append('<li>'+result.addresses[i].line2+'</li>');
            }
            $ul1.append('<li>'+result.addresses[i].city+', '+result.addresses[i].state+'</li>');
            $ul1.append('<li>'+result.addresses[i].country+'</li>');
            $ul1.append('<li>'+result.addresses[i].zip+'</li>');
            $('.address-table').append($ul1);
        }
        $('.main-table').append('<tr><th>Phone(s):</th><td class="phone-table"></td></tr>');
        for (var i=0; i < result.phones.length; i++) {
            var $ul2 = $('<ul class="vcard"/>');
            $ul2.append('<li>'+result.phones[i].type+':</li>');
            $ul2.append('<li>'+result.phones[i].phoneNumber+'</li>');
            $('.phone-table').append($ul2);
        }
        $('.main-table').append('<tr><th>Email(s):</th><td class="email-table"></td></tr>');
        for (var i=0; i < result.emails.length; i++) {
            var $ul3 = $('<ul class="vcard"/>');
            $ul3.append('<li>'+result.emails[i].type+':</li>');
            $ul3.append('<li>'+result.emails[i].email+'</li>');
            $('.email-table').append($ul3);
        }
    });
}

module.exports = {
    displayAddressBooksList: displayAddressBooksList,
    displayAddressBook: displayAddressBook,
    displayEntry: displayEntry
};