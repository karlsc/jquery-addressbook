var dataFunctions = require('./data');
var $app = $('#app');
var _ = require('underscore');
var limit = 5;

function displayAddressBooksList(page) {
    if(!page || page === undefined || page === 0) { page = 1; }
    var offset = limit * (page - 1);
    dataFunctions.getAddressBooks(limit,offset).then( function(result) {
        $app.html('').append('<h2>Address Books List</h2>').append("<ul>");
        $app.append( $("<div class='text-center'/>").append( 
            $("<a class='link-prev' href='/#addressbooks/page"+(Number(page)-1)+"'><button class='btn-previous'>&lt;</button></a>")).append( 
            $("<button class='add-ab'>+</button>")).append(
            $("<a class='link-next' href='/#addressbooks/page"+(Number(page)+1)+"'><button class='btn-next'>&gt;</button></a>")));
        
        result.addressBooks.forEach(function(ab) { $app.find("ul").append('<li data-id="'+ab.id+'"><a href="/#addressbooks/'+ab.id+'">'+(ab.name).charAt(0).toUpperCase()+(ab.name).slice(1)+'</a></li>'); });
        
        if(offset === 0)    { $(".btn-previous").attr("disabled","disabled"); $(".link-prev").removeAttr("href"); }
        if(!result.hasNext) { $(".btn-next"    ).attr("disabled","disabled"); $(".link-next").removeAttr("href"); }
        
        $(".text-center").on("click",".add-ab", function(){
            
            $(".link-prev").before("<div class='new-ab'><p>Select a new address book name: </p><input class='input-ab' required/></div>");
            $(".add-ab").text("-").on("click", function(){
                $(".new-ab").remove();
            });
            $('.input-ab').on('keypress', function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    
                    var newAB = $(this).val();
                    if(!newAB) {
                        alert("Please enter something.");
                    }
                    else {
                        $.ajax({ method: 'POST', url: "https://loopback-rest-api-demo-ziad-saab.c9.io/api/AddressBooks", data: {name: newAB} });
                    }
                }
            });
        });
    });
}

function displayAddressBook(id,page) {
    if(!page || page === undefined || page === 0)  { page = 1; }
    var offset = limit * (page - 1);
    dataFunctions.getAddressBook(limit,offset,id).then(function(result){
        $app.html('').append("<h2>"+(result.addressBook.name).charAt(0).toUpperCase()+(result.addressBook.name).slice(1)+"'s Friends</h2>").append('<ul/>');
        $app.append($("<div class='text-center'/>").append(
            $("<a class='link-prev' href='/#addressbooks/"+result.addressBook.id+"/page"+(Number(page)-1)+"'><button class='btn-previous'>&lt;</button></a>")).append( 
            $("<a class='link-next' href='/#addressbooks/"+result.addressBook.id+"/page"+(Number(page)+1)+"'><button class='btn-next'>&gt;</button></a>")));
        
        result.addressBook.entries.forEach(function(ab) { $app.find('ul').append('<li data-id="'+ab.id+'"><a href="/#entry/'+ab.id+'">'+(ab.lastName).charAt(0).toUpperCase()+(ab.lastName).slice(1)+', '+(ab.firstName).charAt(0).toUpperCase()+(ab.firstName).slice(1)+'</a></li>'); });

        if(offset === 0)    { $(".btn-previous").attr("disabled","disabled"); $(".link-prev").removeAttr("href"); }
        if(!result.hasNext) { $(".btn-next"    ).attr("disabled","disabled"); $(".link-next").removeAttr("href"); }
    });
}

function displayEntry(id) {
    dataFunctions.getEntry(id).then(function(result) {
        var entryTemplateText = require('raw!./templates/entry-template.ejs');
        var entryTemplate = _.template( entryTemplateText );
        var birthdayFormat = result.birthday.substring(0, 10);
        var output = entryTemplate({entry: result, birthday: birthdayFormat});
        
        $app.html('').append(output);
        
        $("ul").on("click","li", function(){
            var value = $(this).text();
            var field = $(this).data('field');
            var loopId = $(this).parent().data('id');

            $(this).replaceWith("<input class='edit-input' type='text' value='"+value+"'>");
            
            $('.edit-input').on('keypress', function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    var save = {};
                    save[field] = $(this).val();
                    var type = $(this).parent().data('type');
                    var url = "https://loopback-rest-api-demo-ziad-saab.c9.io/api/"+type+"/";
                    
                    switch(type){
                        case "Entries": url += id; break;
                        case "Addresses": url += result.addresses[loopId].id; break;
                        case "Phones": url += result.phones[loopId].id; break;
                        case "EmailAddresses": url += result.emails[loopId].id; break;
                    }
                    $.ajax({ method: 'PUT', url: url, data: save });
                    $(this).replaceWith("<li data-field='"+field+"'>"+save[field]+"</li>");
                    
                    
                    // Nouvelle adresse
                    // $.ajax({
                    //     method: 'POST',
                    //     url: 'https://loopback-rest-api-demo-ziad-saab.c9.io/api/Entry/' + id + '/addresses',
                    //     data: {
                    //         line1: 'xxx 1st street',
                    //         zip: '12345'
                    //     }
                    // })
                }
            });
        });
    });
}

module.exports = {
    displayAddressBooksList: displayAddressBooksList,
    displayAddressBook: displayAddressBook,
    displayEntry: displayEntry
};