$("#new-blog-form").on("submit", function(event){
    event.preventDefault();
    var ifrm = document.querySelector("iframe")
    var image = ifrm.contentWindow.document.querySelector("img")
    var imageInput = document.querySelector("#new-blog-image-url")


    if(image){
        imageInput.value = image.src;
    } else {
        imageInput.value = null;
    }
  
    $(this).trigger(event.type);
})