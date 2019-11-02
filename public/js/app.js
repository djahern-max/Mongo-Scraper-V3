//Save Button
$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId
    }).then(function (data) {
        window.location = "/"
    })
});

// Scrape Button
$("#scrape").on("click", function () {
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