$(document).foundation();

var API_URL = "https://loopback-rest-api-demo-ziad-saab.c9.io/api";
var $app = $('#app');

// Data retrieval functions
function getAddressBooks(limit, offset) {
    var filter = JSON.stringify({order: "name", limit: limit + 1, offset: offset});
    return $.getJSON(API_URL + '/AddressBooks?filter='+ filter).then(
        function(addressBooks) {
            if (addressBooks.length > limit) {
                var hasNext = true;
                addressBooks.pop();
            }
            else {
                hasNext = false;
            }
            return {addressBooks: addressBooks, hasNext: hasNext};
        }
    );
}

function getAddressBook(limit,offset,addressBookId) {
    var filter = JSON.stringify({order: "lastName", limit: limit + 1, offset: offset});
    return $.getJSON(API_URL + '/AddressBooks/'+addressBookId+'/entries?filter='+ filter).then(
        function(addressBook) {
            if (addressBook.length > limit) {
                var hasNext = true;
                addressBook.pop();
            }
            else {
                hasNext = false;
            }
            return {addressBook: addressBook, hasNext: hasNext};
        }
    );
}

function getEntry(entry, addressBookId, addressBookName) {
    var filter = JSON.stringify({include:["addresses","phones","emails"]});
    return $.getJSON(API_URL + '/Entries/' + entry.data('id') + '?filter=' + filter);//.then(
}
// End data retrieval functions





// Functions that display things on the screen (views)
function displayAddressBooksList(limit, offset) {
    getAddressBooks(limit, offset).then(
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
    getAddressBook(limit,offset,addressBookId).then(function(result){
        $app.html('');
        $app.append('<h2>Address Book: '+addressBookName+'</h2>');
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
    getEntry(entry, addressBookId, addressBookName).then(function(result) {
        
        var birthday = new Date(result.birthday);
        var month = birthday .getMonth()+1;
            if (month <= 9) {
                month = '0'+month.toString();
            }
        var birthdayFormat = birthday.getFullYear()+'-'+month+'-'+ birthday.getDate();
        
        $app.html(''); // Clear the #app div
        $app.append('<h2>Entry: '+result.firstName+' '+result.lastName+'</h2>');
        $app.append('<p class="return-listing">Return to address book listing</p>');
        $(".return-listing").on("click", function(){
            displayAddressBook(5,0,addressBookId,addressBookName);
        });
        $app.append('<ul></ul>');
        $app.children('ul').append('<li>Name: '+result.firstName+' '+result.lastName+'</li>');
        $app.children('ul').append('<li>Birthday: '+birthdayFormat+'</li>');
        
        for (var i=0; i < result.addresses.length; i++) {
            $app.append('<h3>Address '+(i+1)+' ('+result.addresses[i].type+')</h3>');
            $app.append('<ul id=address-'+(i+1)+'></ul>');
            if (result.addresses[i].line2) {
                $app.children('#address-'+(i+1)).append('<li>'+result.addresses[i].line1+' '+(result.addresses[i].line2+'</li>'));
            }
            else {
                $app.children('#address-'+(i+1)).append('<li>'+result.addresses[i].line1+'</li>');
            }
            if (result.addresses[i].state) {
                $app.children('#address-'+(i+1)).append('<li>'+result.addresses[i].city+', '+result.addresses[i].state+', '+result.addresses[i].country+'</li>');
            }
            else {
                $app.children('#address-'+(i+1)).append('<li>'+result.addresses[i].city+', '+result.addresses[i].country+'</li>');
            }
            $app.children('#address-'+(i+1)).append('<li>'+result.addresses[i].zip+'</li>');
        }
        for (var i=0; i < result.phones.length; i++) {
            $app.append('<h3>Phone '+(i+1)+' ('+result.phones[i].type+')</h3>');
            $app.append('<ul id=phone-'+(i+1)+'><li>'+result.phones[i].phoneNumber+'</li></ul>');
        }
        for (var i=0; i < result.emails.length; i++) {
            $app.append('<h3>Email '+(i+1)+' ('+result.emails[i].type+')</h3>');
            $app.append('<ul id=phone-'+(i+1)+'><li>'+result.emails[i].email+'</li></ul>');
        }
    });
}
// End functions that display views

displayAddressBooksList(5, 0);