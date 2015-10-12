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
    return $.getJSON(API_URL + 'Entries/' + entryId).then(
        function(entry) {
            return entry
        }
    )
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
            displayEntry($(this));
        });
    });
    
}

function displayEntry($li) {
    return $.getJSON(API_URL + '/Entries/' + $li.data('id')).then(
        function(entry) {

            var birthday = new Date(entry.birthday);
            var month = birthday .getMonth()+1;
            if (month <= 9) {
                month = '0'+month.toString();
            }
            var birthday = birthday.getFullYear()+'-'+month+'-'+ birthday.getDate();
            
            return {entryId: $li.data('id'), firstName: entry.firstName, lastName: entry.lastName, birthday: birthday}
        
        }
    ).then( function(result) {
        $app.html(''); // Clear the #app div
        $app.append('<h2>Entry: '+result.firstName+' '+result.lastName+'</h2>');
        $app.append('<ul></ul>');
        for (var key in result) {
            $app.children('ul').append('<li>'+key+': '+result[key]+'</li>');
        }
        
        return result.entryId
        
    }).then( function(entryId) {
        
        return $.getJSON(API_URL + "/Addresses?filter=" + JSON.stringify({where: {entryId: entryId}})).then(
            function(addresses) {
                console.log(addresses);
                var count = 1;
                addresses.forEach( function(address) {
                    $app.append('<h3>Address '+count+' ('+address.type+')</h3>');
                    $app.append('<ul id=address-'+count+'></ul>');
                    if (address.line2) {
                        $app.children('#address-'+count).append('<li>'+address.line1+' '+address.line2+'</li>');
                    }
                    else {
                        $app.children('#address-'+count).append('<li>'+address.line1+'</li>');
                    }
                    if (address.state) {
                        $app.children('#address-'+count).append('<li>'+address.city+', '+address.state+', '+address.country+'</li>');
                    }
                    else {
                        $app.children('#address-'+count).append('<li>'+address.city+', '+address.country+'</li>');
                    }
                    $app.children('#address-'+count).append('<li>'+address.zip+'</li>');
                    count++
                })
            }    
        )
    })
    
}
// End functions that display views


// Start the app by displaying all the addressbooks
displayAddressBooksList(5, 0);