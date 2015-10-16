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
            if($(".add-ab").text() === "+"){
                $(".link-prev").before("<div class='new-ab'><input class='input-ab' placeholder='Enter new address book name'/><button class='btn-add-entry'>Add</button></div>");
                $(".add-ab").text("-");
            } else { $(".new-ab").remove(); $(".add-ab").text("+"); }
            
            $('.input-ab').on('keypress', function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    var newAB = $(this).val();
                    var newABCap = (newAB).charAt(0).toUpperCase()+(newAB).slice(1);
                    if(!newAB || newAB.length < 1 || newAB === "" || newAB === undefined) {
                        alert("Please enter a valid address book name.");
                    }
                    else {
                        $.ajax({ method: 'POST', url: "https://loopback-rest-api-demo-ziad-saab.c9.io/api/AddressBooks", data: {name: newABCap} });
                        
                        $.getJSON("https://loopback-rest-api-demo-ziad-saab.c9.io/api/AddressBooks",function(result){
                            var newABId = result[result.length-1].id;
                            window.location.href = "https://jquery-addressbook-karlysun.c9.io/#addressbooks/"+newABId;
                        });
                        
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
        $app.html('').append("<div class='test'><h2><span>"+(result.addressBook.name).charAt(0).toUpperCase()+(result.addressBook.name).slice(1)+"</span>'s Friends</h2></div>").append('<ul/>');
        $app.append($("<div class='text-center'/>").append(
            $("<a class='link-prev' href='/#addressbooks/"+result.addressBook.id+"/page"+(Number(page)-1)+"'><button class='btn-previous'>&lt;</button></a>")).append(
            $("<button class='add-ab'>+</button>")).append(
            $("<a class='link-next' href='/#addressbooks/"+result.addressBook.id+"/page"+(Number(page)+1)+"'><button class='btn-next'>&gt;</button></a>")));
        
        result.addressBook.entries.forEach(function(ab) { $app.find('ul').append('<li data-id="'+ab.id+'"><a href="/#entry/'+ab.id+'">'+(ab.lastName).charAt(0).toUpperCase()+(ab.lastName).slice(1)+', '+(ab.firstName).charAt(0).toUpperCase()+(ab.firstName).slice(1)+'</a></li>'); });

        if(offset === 0)    { $(".btn-previous").attr("disabled","disabled"); $(".link-prev").removeAttr("href"); }
        if(!result.hasNext) { $(".btn-next"    ).attr("disabled","disabled"); $(".link-next").removeAttr("href"); }
        
        $("h2").on("click","span", function(){
            var value = $(this).text();
            $(this).replaceWith("<input class='edit-input' type='text' value='"+value+"'>");
            $('.edit-input').on('keypress', function(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    var save = $(this).val();
                    var saveCap = (save).charAt(0).toUpperCase()+(save).slice(1);
                    if(!save || save.length < 1 || save === "" || save === undefined) {
                        alert("Please enter a valid address book name.");
                    } else {
                        $.ajax({ method: 'PUT', url: "https://loopback-rest-api-demo-ziad-saab.c9.io/api/AddressBooks/"+id, data: {name: saveCap} });
                        $(this).replaceWith("<span>"+save+"</span>");
                    }
                }
            });
        });
        
        
        $(".text-center").on("click",".add-ab", function(){
            if($(".add-ab").text() === "+"){
                $(".link-prev").before("<div class='new-ab'><input class='input-fn' placeholder='First name'/><input class='input-ln' placeholder='Last name'/><input class='input-bd' placeholder='Birthday'/><button class='btn-add-entry'>Add</button></div>");
                $(".add-ab").text("-");
            } else { $(".new-ab").remove(); $(".add-ab").text("+"); }
            
            $('.btn-add-entry').on('click', function() {
                if (!$(".input-fn").val() || $(".input-fn").val().length < 1 || !$(".input-ln").val() || $(".input-ln").val().length < 1 || !$(".input-bd").val() || $(".input-bd").val().length < 1) {
                    alert("Please fill all forms properly.");
                }
                else {
                    var fn = $(".input-fn").val();
                    var firstName = (fn).charAt(0).toUpperCase()+(fn).slice(1);
                    var ln = $(".input-ln").val();
                    var lastName = (ln).charAt(0).toUpperCase()+(ln).slice(1);
                    var birthday = $(".input-bd").val();
                    
                    $.ajax({ method: 'POST', url: "https://loopback-rest-api-demo-ziad-saab.c9.io/api/Entries", data: {firstName: firstName, lastName: lastName, birthday: birthday, addressBookId: id} });
                    
                    $.getJSON("https://loopback-rest-api-demo-ziad-saab.c9.io/api/Entries",function(result){
                        var newEntryId = result[result.length-1].id;
                        window.location.href = "https://jquery-addressbook-karlysun.c9.io/#entry/"+newEntryId;
                    });
                }
            });
        });
        
        
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