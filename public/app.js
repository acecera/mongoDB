$(document).ready(function() {
    $(".delete-button").on("click", function(event) {
        event.preventDefault();
        var qURL = location.href + '/' + $(this).data('comment');
        $ajax({
            method: "DELETE", 
            url: qURL
        })
        location.reload();
    });
});