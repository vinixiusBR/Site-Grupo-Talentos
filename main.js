const botaomenu = document.getElementById("botaomenu")
const menu = document.getElementById("menu")
const overlay = document.getElementById("overlay")


botaomenu.addEventListener("click", function(){

    menu.classList.toggle("show");

    overlay.classList.toggle("show");
    botaomenu.classList.toggle ("active");

    if (icon.getAttribute("data-icon") === "bi:three-bars") {
        icon.setAttribute("data-icon", "bi:x");
    } else {
        icon.setAttribute("data-icon", "bi:three-bars");
    }





})