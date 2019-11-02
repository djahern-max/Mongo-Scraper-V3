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
    let thisId = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: '/delete/' + thisID
    }).then(function (data) {
        window.location = '/'
    });
});

$(".save-note").on("click", function () {

    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#noteText" + thisId).val()
        }
    }).then(function (data) {
        console.log(data);
        $("#noteText" + thisId).val("");
        $(".modalNote").modal("hide");
        window.location = "/saved"
    });

});
$('.deleteNote').on('click', function () {
    let thisId = $(this).attr('data-note-id');
    $.ajax({
        method: "POST",
        url: '/deleteNote' + thisId,
    }).then(function (data) {
        console.log(data);
        window.location = '/saved'
    });
});