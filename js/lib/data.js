var API_URL = "https://loopback-rest-api-demo-ziad-saab.c9.io/api";

function getAddressBooks(limit,offset) {
    var filter = JSON.stringify({order: "name", limit: limit+1, offset: offset});
    return $.getJSON(API_URL + '/AddressBooks?filter='+ filter).then(
        function(addressBooks) {
            if (addressBooks.length > limit) { var hasNext = true; addressBooks.pop(); }
            else { hasNext = false; }
            return {addressBooks: addressBooks, hasNext: hasNext};
        }
    );
}

function getAddressBook(limit,offset,id) {
    var filter = JSON.stringify({include: {relation: 'entries', scope: {order: "lastName", limit: limit+1, offset: offset}}});
    return $.getJSON(API_URL + '/AddressBooks/'+ id +'?filter='+ filter).then(
        function(addressBook) {
            if (addressBook.entries.length > limit) { var hasNext = true; addressBook.entries.pop(); }
            else { hasNext = false; }
            return {addressBook: addressBook, hasNext: hasNext};
        }
    );
}

function getEntry(id) {
    var filter = JSON.stringify({include:["addresses","phones","emails"]});
    return $.getJSON(API_URL + '/Entries/' + id + '?filter=' + filter);//.then(
}

module.exports = {
    getAddressBooks: getAddressBooks,
    getAddressBook: getAddressBook,
    getEntry: getEntry
};