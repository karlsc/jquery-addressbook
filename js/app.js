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
    // TODO..
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
    });
    
}

function displayEntry() {
    
}
// End functions that display views


// Start the app by displaying all the addressbooks
displayAddressBooksList(5, 0);