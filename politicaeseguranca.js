const botaomenu = document.getElementById("botaomenu");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");
const imagem = document.querySelector(".fotocadeado");



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


        if (panel.style.height === '0px' || panel.style.height === '') {
            panel.style.display = 'block';
            panel.style.height = '0';
            panel.style.opacity = '0';

            setTimeout(() => {

                panel.style.transition = 'height 1s ease-out, opacity 1s ease-out';
                panel.style.height = 'auto';
                panel.style.opacity = '1';
            }, 10); 
        } else {
            
            panel.style.height = '0';
            panel.style.opacity = '0';

            setTimeout(() => {
                

                panel.style.display = 'none';
                panel.style.transition = 'height 1s ease-out, opacity 1s ease-out'
                
            }, 10);

            

    }
    







        panel.classList.toggle('active');
        

        if (imagem.style.display === "none") {

            imagem.style.display = "block";
            imagem.style.transition = "all 0.5s ease";


        } else {
            imagem.style.display = "none";
        }

        

        
    })
})