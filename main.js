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
const imagemLargura = 60; 
let isDragging = false;
let startX;
let scrollLeft;


function slide() {
    
    index++;

    // 
    if (index >= totalImagens) {
        index = 0;  
        document.querySelector('.clientes').style.transition = 'none'; 
        document.querySelector('.clientes').style.transform = `translateX(0)`; 

       
        setTimeout(() => {
            document.querySelector('.clientes').style.transition = 'transform 1s ease-in-out'; 
        }, 50); 
    } else {
        
        document.querySelector('.clientes').style.transform = `translateX(-${index * imagemLargura}px)`;
    }
}

setInterval(slide, 3000);

imagens.forEach((imagem) => {
    imagem.addEventListener("click", function() {
        // Destaca a imagem clicada
        imagens.forEach(img => img.classList.remove("selected"));
        imagem.classList.add("selected");
    });
});


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
    const walk = (x - startX) * 3; // Aumenta a sensibilidade do arrasto
    slider.scrollLeft = scrollLeft - walk;
});








const messages = document.getElementById("messages");
let previousChoice = null; // Variável para armazenar a última escolha
let chatActive = true; // Flag para controlar se o chat está ativo

function addMessage(content, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.innerHTML = content; // Usando innerHTML para suportar <br>
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight; // Rolagem para a última mensagem
}

function showWelcomeMessage() {
    const welcomeMessage = "Olá! Eu sou o Miguel, seu assistente virtual do Grupo Talentos.";
    addMessage(welcomeMessage, "bot"); 
}

function showMenu() {
    const menu = " Escolha um dos números abaixo para que eu possa te ajudar. <br>";
    addMessage(menu, "bot");
    addMessage(" 1 - Conhecer nossos serviços de cobrança<br>2 - Dicas úteis para gerenciar dívidas<br> 3 - Falar com um atendente<br> 4 -  Informações sobre pagamentos", "bot");
    addMessage("Se precisar encerrar a conversa a qualquer momento, é só digitar 'sair'. Estou sempre por aqui para ajudar!", "bot");
}

function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    // Validação: Verifica se a mensagem está vazia
    if (message === "") {
        addMessage("Miguel: Por favor, digite algo para que eu possa ajudar.", "bot");
        return; // Não envia se a mensagem for vazia
    }

    if (message.toLowerCase() === "sair") {
        closeChat(); // Chama a função de saída
        return;
    }

    addMessage(message, "user");
    respondToMessage(message);
    userInput.value = ""; // Limpa a caixa de entrada
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function respondToMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";

    if (lowerMessage === "sair") {
        response = "Miguel: Até logo! Estou à disposição para ajudar sempre que você precisar.";
    } else if (lowerMessage === "1") {
        if (previousChoice === "1") {
            response = "Miguel: No Grupo Talentos, oferecemos soluções de cobrança personalizadas";
        } else {
            response = "Miguel: No Grupo Talentos, oferecemos soluções de cobrança personalizadas";
            previousChoice = "1"; // Armazena que a opção 1 foi escolhida
        }
        addMessage(response, "bot");
        addMessage("Entre em contato conosco para que possamos encontrar a melhor solução para o seu caso.", "bot");
    } else if (lowerMessage === "2") {
        response = "Miguel: Aqui vão algumas dicas:<br>- Mantenha um controle financeiro rigoroso.<br>- Sempre busque negociar suas dívidas.<br>- Conheça seus direitos para se proteger.";
        addMessage(response, "bot");
        addMessage("Se precisar de ajuda específica, estou à disposição!", "bot");
        previousChoice = null; // Reseta a escolha anterior
    } else if (lowerMessage === "3") {
        response = "Miguel: Para falar com um atendente, por favor, forneça seu nome e e-mail.";
        addMessage(response, "bot");
        addMessage("Dessa forma, poderei conectar você com um atendente rapidamente!", "bot");
        previousChoice = null; // Reseta a escolha anterior
    } else if (lowerMessage === "4") {
        response = "Miguel: Aceitamos diversas formas de pagamento. Entre em contato para saber mais sobre como quitar suas dívidas!";
        addMessage(response, "bot");
        addMessage("Estou aqui para ajudar com mais informações sobre pagamentos!", "bot");
        previousChoice = null; // Reseta a escolha anterior
    } else {
        response = "Miguel: Desculpe, não consegui entender sua mensagem. Por favor, escolha uma opção do menu.";
        
        addMessage(response, "bot");
        addMessage(" 1 - Conhecer nossos serviços de cobrança<br>2 - Dicas úteis para gerenciar dívidas<br> 3 - Falar com um atendente<br> 4 -  Informações sobre pagamentos", "bot");
        previousChoice = null; // Reseta a escolha anterior
    }
}

// Função para encerrar o chat
function closeChat() {
    addMessage("Miguel: Até logo! Estou à disposição para ajudar sempre que você precisar.", "bot");
    const chatbox = document.getElementById("chatbox");
    chatbox.style.visibility = "hidden";  // Torna o chatbox invisível
    chatbox.style.opacity = "0";          // Torna o chatbox invisível
}

// Mostrar a mensagem de boas-vindas e o menu ao carregar a página
window.onload = function() {
    showWelcomeMessage();  
    showMenu();
};

// Seleciona o botão e o chatbox
const botao = document.querySelector('.botaoapp');
const chatbox = document.getElementById('chatbox');

// Adiciona um evento de clique ao botão
botao.addEventListener('click', function() {
    // Alterna entre mostrar e esconder o chatbox usando 'visibility' e 'opacity'
    if (chatbox.style.visibility === 'hidden') {
        chatbox.style.visibility = 'visible';  // Torna o chatbox visível
        chatbox.style.opacity = '1';           // Torna o chatbox totalmente visível
    } else {
        chatbox.style.visibility = 'hidden';  // Torna o chatbox invisível
        chatbox.style.opacity = '0';           // Torna o chatbox invisível
    }
});
