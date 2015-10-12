// Add foundation dynamic functionality on page
$(document).foundation();

// Set the API base url
var API_URL = "https://loopback-rest-api-demo-ziad-saab.c9.io/api";

// Get a reference to the <div id="app">. This is where we will output our stuff
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

function getAddressBook(id) {
    return $.getJSON(API_URL + '/AddressBooks/' + id)
}

function getEntries(addressBookId) {
    // TODO...
}

function getEntry(entryId) {
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
                displayAddressBook(addressBookId,5,0,addressBookName);
            });
            $app.append("<button class='btn-previous'>Previous page</button>");
            $app.append("<button class='btn-next'>Next page</button>");
            
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

function displayAddressBook(addressBookId,limit,offset,addressBookName) {
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
            
            return {addressBook: addressBook, hasNext: hasNext, addressBookName: addressBookName};
        }
    ).then(function(result){
        $app.html(''); // Clear the #app div
        $app.append('<h2>Address Book: '+result.addressBookName+'</h2>');
        $app.append('<p class="return-listing">Return to address book listing</p>');
        $(".return-listing").on("click", function(){
            
            displayAddressBooksList(5, 0);
        });
        $app.append('<ul>');
        
        result.addressBook.forEach(function(ab) {
            $app.find('ul').append('<li data-id="' + ab.id + '">' + ab.lastName+', '+ab.firstName + '</li>');
        });
        
        $app.append("<button class='btn-previous'>Previous page</button>");
        $app.append("<button class='btn-next'>Next page</button>");
        $("button").css("margin","0.5em");
        $(".btn-next").on("click", function(){
            offset += limit;
            return displayAddressBook(addressBookId,limit, offset,result.addressBookName);
        });
        if(offset === 0){
                $(".btn-previous").attr("disabled","disabled");
            }
            
        if (!result.hasNext) {
            $(".btn-next").attr("disabled","disabled");
        }
        $(".btn-previous").on("click", function(){
            offset -= limit;
            return displayAddressBook(addressBookId,limit, offset,result.addressBookName);
        });
        
        $('li').on('click', function() {
            displayEntry($(this), addressBookId, result.addressBookName);
        });
    });
    
}

function displayEntry($li, addressBookId, addressBookName) {
    return $.getJSON(API_URL + '/Entries/' + $li.data('id')).then(
        function(entry) {

            var birthday = new Date(entry.birthday);
            var month = birthday .getMonth()+1;
            if (month <= 9) {
                month = '0'+month.toString();
            }
            var birthdayFormat = birthday.getFullYear()+'-'+month+'-'+ birthday.getDate();
            
            return {entryId: $li.data('id'), firstName: entry.firstName, lastName: entry.lastName, birthday: birthdayFormat};
        
        }
    ).then( function(result) {
        $app.html(''); // Clear the #app div
        $app.append('<h2>Entry: '+result.firstName+' '+result.lastName+'</h2>');
        $app.append('<p class="return-listing">Return to address book listing</p>');
        $(".return-listing").on("click", function(){
            displayAddressBook(addressBookId, 5, 0, addressBookName);
        });
        $app.append('<ul></ul>');
        for (var key in result) {
            $app.children('ul').append('<li>'+key+': '+result[key]+'</li>');
        }
        
        return result.entryId;
        
    }).then( function(entryId) {
        
        $.getJSON(API_URL + "/Addresses?filter=" + JSON.stringify({where: {entryId: entryId}})).then(
            function(addresses) {
                for (var i=0; i<addresses.length; i++) {
                    $app.append('<h3>Address '+(i+1)+' ('+addresses[i].type+')</h3>');
                    $app.append('<ul id=address-'+(i+1)+'></ul>');
                    if (addresses[i].line2) {
                        $app.children('#address-'+(i+1)).append('<li>'+addresses[i].line1+' '+(addresses[i].line2+'</li>'));
                    }
                    else {
                        $app.children('#address-'+(i+1)).append('<li>'+addresses[i].line1+'</li>');
                    }
                    if (addresses[i].state) {
                        $app.children('#address-'+(i+1)).append('<li>'+addresses[i].city+', '+addresses[i].state+', '+addresses[i].country+'</li>');
                    }
                    else {
                        $app.children('#address-'+(i+1)).append('<li>'+addresses[i].city+', '+addresses[i].country+'</li>');
                    }
                    $app.children('#address-'+(i+1)).append('<li>'+addresses[i].zip+'</li>');
                }
            }
        );
        return entryId;
    }).then( function(entryId) {
        
        $.getJSON(API_URL + "/Phones?filter=" + JSON.stringify({where: {entryId: entryId}})).then(
            function(phones) {
                for (var i=0; i<phones.length; i++) {
                    $app.append('<h3>Phone '+(i+1)+' ('+phones[i].type+')</h3>');
                    $app.append('<ul id=phone-'+(i+1)+'><li>'+phones[i].phoneNumber+'</li></ul>');
                }
            }
        );
        return entryId;
    }).then( function(entryId) {
        
        $.getJSON(API_URL + "/EmailAddresses?filter=" + JSON.stringify({where: {entryId: entryId}})).then(
            function(emails) {
                for (var i=0; i<emails.length; i++) {
                    $app.append('<h3>Email '+(i+1)+' ('+emails[i].type+')</h3>');
                    $app.append('<ul id=phone-'+(i+1)+'><li>'+emails[i].email+'</li></ul>');
                }
            }
        );
        return entryId;
    });
    
}
// End functions that display views


// Start the app by displaying all the addressbooks
displayAddressBooksList(5, 0);