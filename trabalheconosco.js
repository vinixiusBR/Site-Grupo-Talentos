const botaomenu = document.getElementById("botaomenu");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");



botaomenu.addEventListener("click", function() {
    menu.classList.toggle("show");
    
    overlay.classList.toggle("show");
   
    botaomenu.classList.toggle("active");

   
    const icon = botaomenu.querySelector(".iconify");

    
    if (icon.getAttribute("data-icon") === "codicon:three-bars") {
        icon.setAttribute("data-icon", "material-symbols:close");
    } else {
        icon.setAttribute("data-icon", "codicon:three-bars");
    }
});


const acordos = document.querySelectorAll('.acordo');

acordos.forEach(button =>{

    button.addEventListener('click', function (){
        
        const panel = this.nextElementSibling;

        panel.classList.toggle('active');

        
    })
})