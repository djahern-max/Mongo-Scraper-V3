//Save Button
$(".save").on("click", function () {
    console.log("test");
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId
    }).then(function (data) {
        window.location = "/"
    })
});

// Scrape Button
$("#scrape").on("click", function () {
    console.log("test");
    $.ajax({
        method: "GET",
        url: "/scraped",
    }).then(function (data) {
        console.log(data)
        window.location = "/"
    });
});

//Delete from Saved
$('.delete').on('click', function () {
    console.log('test');
    let thisId = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: '/delete/' + thisId
    }).then(function (data) {
        window.location = '/'
    });
});

//To Save a note

$(".save-note").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#noteText" + thisId).val()
            //   body: $("#noteText").val()
        }
    }).then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#noteText" + thisId).val("");
        $(".modalNote").modal("hide");
        window.location = "/saved"
    });

});

//To Delete a note

$(".deleteNote").on("click", function () {
    var thisId = $(this).attr("data-note-id");
    $.ajax({
        method: "POST",
        url: "/deleteNote/" + thisId,
    }).then(function (data) {
        console.log(data);
        window.location = "/saved"
    })
})