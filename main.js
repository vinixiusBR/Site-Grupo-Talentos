// Menu e ícone
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

// Slider
let index = 0;
const imagens = document.querySelectorAll('.clientes img');
const totalImagens = imagens.length;
const imagemLargura = 125;  // Aumentei a largura das imagens para deslocar mais rápido
let isDragging = false;
let startX;
let scrollLeft;

function slide() {
    index++;

    if (index >= totalImagens) {
        index = 0;
        // Desativa a transição temporariamente
        document.querySelector('.clientes').style.transition = 'none';  
        document.querySelector('.clientes').style.transform = `translateX(0)`;  // Restaura a posição

        // Aplica a transição rapidamente (reduzido para 50ms para não desacelerar)
        setTimeout(() => {
            document.querySelector('.clientes').style.transition = 'transform 0.5s ease-in-out';  // A transição é mais rápida
        }, 50);  // Reduzi para 50ms para maior eficiência
    } else {
        // Aplique a transição normalmente quando o carrossel está deslizando
        document.querySelector('.clientes').style.transform = `translateX(-${index * imagemLargura}px)`;
    }
}

setInterval(slide, 3100);


const slider = document.querySelector('.clientes');

slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
});

slider.addEventListener('mouseleave', () => {
    isDragging = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mouseup', () => {
    isDragging = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 4;  // Aumentei o fator de deslocamento para acelerar o movimento
    slider.scrollLeft = scrollLeft - walk;
});


// Funções de chat

const messages = document.getElementById("messages");
let previousChoice = null; 
let userData = { name: "", email: "" }; 
let chatActive = true;
let collectingData = false; 

function addMessage(content, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.innerHTML = content;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function showWelcomeMessage() {
    const welcomeMessage = "Olá! Eu sou o Miguel, seu assistente virtual do Grupo Talentos.";
    addMessage(welcomeMessage, "bot"); 
}

function showMenu() {
    const menu = "Escolha um dos números abaixo para que eu possa te ajudar. <br>";
    addMessage(menu, "bot");
    addMessage("1 - Conhecer nossos serviços de cobrança<br>2 - Dicas úteis para gerenciar dívidas<br>3 - Falar com um atendente<br>4 - Informações sobre pagamentos", "bot");
    addMessage("Se precisar encerrar a conversa a qualquer momento, é só digitar 'sair'.", "bot");
}

function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    if (message === "") {
        addMessage("Miguel: Por favor, digite algo para que eu possa ajudar.", "bot");
        return; 
    }

    if (message.toLowerCase() === "sair") {
        closeChat(); 
        return;
    }

    addMessage(message, "user");
    respondToMessage(message);
    userInput.value = ""; 
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function respondToMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";

    if (collectingData) {
        collectUserData(message);
        return;
    }

    if (lowerMessage === "sair") {
        response = "Miguel: Até logo! Estou à disposição para ajudar sempre que você precisar.";
    } else if (lowerMessage === "1") {
        response = "Miguel: No Grupo Talentos, oferecemos soluções de cobrança personalizadas";
        previousChoice = "1"; 
    } else if (lowerMessage === "2") {
        response = "Miguel: Aqui vão algumas dicas:<br>- Mantenha um controle financeiro rigoroso.<br>- Sempre busque negociar suas dívidas.<br>- Conheça seus direitos para se proteger.";
        previousChoice = null; 
    } else if (lowerMessage === "3") {
        response = "Miguel: Para falar com um atendente, por favor, forneça seu nome.";
        addMessage(response, "bot");
        collectingData = "name"; 
        previousChoice = "3"; 
        return;
    } else if (lowerMessage === "4") {
        response = "Miguel: Aceitamos diversas formas de pagamento. Entre em contato para saber mais sobre como quitar suas dívidas!";
        previousChoice = null; 
    } else {
        response = "Miguel: Desculpe, não consegui entender sua mensagem. Por favor, escolha uma opção do menu.";
        previousChoice = null; 
    }
    addMessage(response, "bot");
}

function sendEmail(name, email) {
    emailjs.send("service_id", "template_id", {
        from_name: name,
        from_email: email
    }).then(function(response) {
        addMessage("Miguel: As informações foram enviadas com sucesso! Um atendente entrará em contato em breve.", "bot");
        showConfirmationMessage(); 
    }, function(error) {
        addMessage("Miguel: Desculpe, ocorreu um erro ao enviar as informações. Tente novamente mais tarde.", "bot");
    });
}

function collectUserData(message) {
    if (collectingData === "name" && userData.name === "") {
        userData.name = message;
        addMessage("Miguel: Agora, por favor, forneça seu e-mail.", "bot");
        collectingData = "email"; 
    } else if (collectingData === "email" && userData.email === "") {
        userData.email = message;
        sendEmail(userData.name, userData.email); 
        userData = {}; 
        collectingData = false; 
        previousChoice = null; 
    }
}

function showConfirmationMessage() {
    setTimeout(() => {
        addMessage("Miguel: Obrigado! Sua solicitação foi enviada com sucesso. Um atendente entrará em contato com você em breve.", "bot");
        closeChat();  
    }, 1500); 
}

function closeChat() {
    addMessage("Miguel: Até logo! Estou à disposição para ajudar sempre que você precisar.", "bot");
    const chatbox = document.getElementById("chatbox");
    chatbox.style.visibility = "hidden";  
    chatbox.style.opacity = "0";         
}

// Mostrar a mensagem de boas-vindas e o menu ao carregar a página
window.onload = function() {
    showWelcomeMessage();  
    showMenu();
    const chatbox = document.getElementById("chatbox");
    chatbox.style.visibility = "hidden";  // Torna o chatbox invisível inicialmente
    chatbox.style.opacity = "0";          // Torna o chatbox invisível inicialmente
};

// Seleciona o botão e o chatbox
// Seleciona o botão e o chatbox
// Seleciona o botão, o chatbox e o tooltip
const botao = document.querySelector('.botaoapp');
const chatbox = document.getElementById('chatbox');
const tooltip = document.querySelector('.tooltip');


document.addEventListener('DOMContentLoaded', function () {
    const botaoApp = document.querySelector('.botaoapp');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const darkOverlay = document.querySelector('.darkOverlay');
    const chatBox = document.getElementById('chatbox');

    // Quando clicar no botão de abrir chat
    botaoApp.addEventListener('click', function() {
        darkOverlay.classList.add('active'); // Ativa o fundo escurecido
        chatBox.style.display = 'flex'; // Exibe o chatbox
    });

    // Quando clicar no botão de fechar chat
    closeChatBtn.addEventListener('click', function() {
        darkOverlay.classList.remove('active'); // Remove o fundo escurecido
        chatBox.style.display = 'none'; // Oculta o chatbox
    });
});

// Adiciona um evento de clique ao botão
botao.addEventListener('click', function() {
    // Alterna entre mostrar e esconder o chatbox usando 'visibility' e 'opacity'
    if (chatbox.style.visibility === 'hidden') {
        chatbox.style.visibility = 'visible';  
        chatbox.style.opacity = '1';           
        botao.style.visibility = 'hidden';  // Esconde o botão quando o chatbox abrir
        tooltip.style.visibility = 'hidden';  // Esconde o tooltip quando o chatbox abrir
        tooltip.style.opacity = '0';  // Torna o tooltip invisível
    } else {
        chatbox.style.visibility = 'hidden';  
        chatbox.style.opacity = '0';           
        botao.style.visibility = 'visible';  // Mostra o botão novamente quando o chatbox for fechado
        tooltip.style.visibility = 'hidden';  // Esconde o tooltip inicialmente quando o chatbox for fechado
        tooltip.style.opacity = '0';  // Torna o tooltip invisível
    }
});

// Função para fechar o chatbox
function closeChat() {
    addMessage("Miguel: Até logo! Estou à disposição para ajudar sempre que você precisar.", "bot");
    chatbox.style.visibility = "hidden";  // Esconde o chatbox
    chatbox.style.opacity = "0";         // Opacidade do chatbox reduzida
    botao.style.visibility = "visible";  // Mostra o botão novamente
    tooltip.style.visibility = 'hidden';  // Esconde o tooltip quando o chatbox for fechado
    tooltip.style.opacity = '0';  // Torna o tooltip invisível quando o chatbox for fechado
}

// Manter o comportamento de mostrar o tooltip apenas no hover
botao.addEventListener('mouseover', function() {
    if (chatbox.style.visibility === 'hidden') {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';  // Torna o tooltip visível quando o mouse passa sobre o botão
    }
});

botao.addEventListener('mouseout', function() {
    tooltip.style.visibility = 'hidden';  // Esconde o tooltip quando o mouse sai do botão
    tooltip.style.opacity = '0';  // Torna o tooltip invisível
});






let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }

    // Move o slider para o slide correspondente com transição suave
    const slider = document.querySelector(".sliderradio");
    slider.style.transition = 'transform 0.8s ease-in-out'; // Garante que a transição de movimento seja suave
    slider.style.transform = `translateX(-${slideIndex * 100}%)`; // Corrigido aqui

    // Atualiza os indicadores (bolinhas)
    dots.forEach((dot, index) => {
        dot.classList.remove("active"); // Remove a classe ativa de todas as bolinhas
        if (index === slideIndex) {
            dot.classList.add("active"); // Adiciona a classe ativa na bolinha correspondente
        }
    });
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}

// Função para auto-rotação do slide (alterar para o intervalo desejado)
setInterval(() => {
    slideIndex++;
    showSlides();
}, 5000); // 6 segundos para trocar de imagem

// Função para mudar o favicon dependendo do tema
function updateFavicon() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const favicon = document.getElementById("favicon");
    
    if (prefersDarkScheme) {
        favicon.setAttribute("href", "./imagens/favcondark.png"); // Favicon para o tema escuro
    } else {
        favicon.setAttribute("href", "./imagens/favconclaro.png"); // Favicon para o tema claro
    }
}

// Atualiza o favicon ao carregar a página
updateFavicon();

// Escuta mudanças no esquema de cores (se o usuário alterar o tema)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicon);





