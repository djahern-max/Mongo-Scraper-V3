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