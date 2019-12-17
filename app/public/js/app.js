

$(".scrape-btn").on("click", function(){
    
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function(data){
        window.location = "/"
    });
});


$(".save-article").on("click", function(){

    event.preventDefault();
    let id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/saved/" + id
    }).done(function(data){
        window.location.reload();
    });

});


$(".clear-articles-non-saved").on("click", function(){
    event.preventDefault();
    let id = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/cleared/non-saved"
    }).done(function(data){
        console.log(data);
        window.location = "/"
    });

});

$(".clear-articles-saved").on("click", function(){
    event.preventDefault();
    let id = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/cleared/saved"
    }).done(function(data){
        console.log(data);
        window.location.reload();
    });
});


// save article note from inside modal
$(".save-note").on("click", function(){
    let id = $(this).attr("data-id");
    let noteText = $(".new-note"+id).val();

    $.ajax({
        method: "POST",
        url: "/saved/notes/" + id,
        data: {
            // text inside the note modal
            note: noteText
        }
    }).done(function(data){
        window.location = "/saved"
    })
});



// display saved notes inside modal
$(document).on("click", ".article-notes", function(){

    $(".note-container").empty();
    $(".note-container").val("");

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/saved/notes/"+thisId
    })
        .then(function(data){

            for (let i = 0; i < data.notes.length; i++) {
                let newLi = $("<li>");
                newLi.addClass("list-group-item note"+data.notes[i]._id);
                newLi.text(data.notes[i].note);
                newLi.append("<button type='button' data-id='" + data.notes[i]._id + "' class='delete-note'>X</button>");
                $(".note-container").append(newLi);
            }  
        })
})

// delete note from modal
$(document).on("click", ".delete-note", function(){
    let id = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/delete/notes/" + id
    }).done(function(data){
        window.location = "/saved"
    })
});

// delete from the saved template
$(document).on("click", ".delete-saved", function(){

    let id = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/delete/saved/" + id
    }).done(function(data){
        window.location = "/saved"
    })

});









