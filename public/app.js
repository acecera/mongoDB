$(document).ready(function(e) {
    $(".delete-button").on("click", function(e) {
        e.preventDefault();
        var qURL = location.href + '/' + $(this).data('comment');
        $ajax({
            method: "DELETE", 
            url: qURL
        })
        location.reload();
    });
});