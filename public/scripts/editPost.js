$("#edit-blog-btn").on("submit", function(event){
    event.preventDefault();

    var iframe = $("iframe")
    var img = iframe.contentWindow.$("img")
    var imageInput = $("#edit-blog-image-url")

    if(img.src){
        imageInput.value = img.src;
    } else {
        imageInput.value = null;
    }

    $(this).trigger(event);
})