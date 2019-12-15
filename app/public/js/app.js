

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
        window.location = "/"
    });

});



