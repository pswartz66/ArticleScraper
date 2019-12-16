

$(".scrape-btn").on("click", function(){
    
    $.ajax({
        method: "GET",
        url: "/scrape"

    }).done(function(data){

        console.log(data);
        window.location = "/"

    });

});


$(".save-article").on("click", function(){

    event.preventDefault();

    let id = $(this).attr("data-id");

    console.log(id);

    $.ajax({
        method: "POST",
        url: "/saved/" + id
    }).done(function(data){
        console.log(data);
        window.location.reload();/*  = "/" */
    });

});


$(".clear-articles-non-saved").on("click", function(){

    event.preventDefault();

    let id = $(this).attr("data-id");

    console.log(id);

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

    console.log(id);

    $.ajax({
        method: "GET",
        url: "/cleared/saved"
    }).done(function(data){
        console.log(data);
        window.location.reload();/*  = "/" */
    });

});


// save article note from inside modal
$(".save-note").on("click", function(){

    
    let id = $(this).attr("data-id");
    let noteText = $(".new-note"+id).val();

    console.log(id);
    console.log(noteText);

    $.ajax({
        method: "POST",
        url: "/saved/notes/" + id,
        data: {
            // text inside the note modal
            note: noteText
        }
    }).done(function(data){

        console.log(data);
        window.location = "/saved"

    })

    /* $("#new-note").val("");
    $("#new-note").attr("placeholder", "New Note..."); */
    

});


