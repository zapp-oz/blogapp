$("#user-options").on("click", function(){
    $("#user-menu").css("display", "block");
    $("#dim-screen").css("backgroundColor", "rgba(0, 0, 0, 0.6)");
})

$("#dim-screen").on("click", function(){
    $("#user-menu").css("display", "none");
    $("#dim-screen").css("backgroundColor", "transparent");
})