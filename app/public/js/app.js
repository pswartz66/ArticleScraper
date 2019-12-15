

$(".scrape-btn").on("click", function(){
    
    $.ajax({
        method: "GET",
        url: "/scrape"

    }).done(function(data){

        console.log(data);
        window.location = "/"

    });

});


$("#save-article").on("click", function(){

    let id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/saved/" + id
    }).then(function(data){
        console.log(data);
        location.reload();
    });

});