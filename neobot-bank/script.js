// Estado do Sistema
let currentBalance = 2450.80;
let balanceHidden = false;

// Elementos DOM
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const balanceDisplay = document.getElementById('balance-display');
const toggleBalanceBtn = document.getElementById('toggle-balance');
const logoutBtn = document.getElementById('logout-btn');

// Chatbot Elements
const chatWidget = document.getElementById('chat-widget');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const openChatAction = document.getElementById('open-chat-action');

// Autenticação Simples
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
});

logoutBtn.addEventListener('click', () => {
    dashboardScreen.classList.remove('active');
    loginScreen.classList.add('active');
});

// Ocultar/Exibir Saldo
toggleBalanceBtn.addEventListener('click', () => {
    balanceHidden = !balanceHidden;
    if (balanceHidden) {
        balanceDisplay.textContent = 'R$ ••••••';
        toggleBalanceBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        updateBalanceDisplay();
        toggleBalanceBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
});

function updateBalanceDisplay() {
    balanceDisplay.textContent = `R$ ${currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Controle do Chatbot
chatToggleBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);
openChatAction.addEventListener('click', () => {
    chatWidget.classList.remove('hidden');
});

function toggleChat() {
    chatWidget.classList.toggle('hidden');
}

// Processar Mensagens do Chatbot
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
        respondBot(text);
    }, 600);
});

function sendQuickReply(text) {
    addMessage(text, 'user');
    setTimeout(() => {
        respondBot(text);
    }, 600);
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Lógica de Resposta com Regras de IA do Chatbot
function respondBot(query) {
    const q = query.toLowerCase();
    let response = "";

    if (q.includes('saldo')) {
        response = `Seu saldo atual em conta é R$ ${currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    } else if (q.includes('pix') || q.includes('chave')) {
        response = "Você pode cadastrar e gerenciar suas chaves Pix na opção 'Pix' no menu de Ações Rápidas. Aceitamos CPF, E-mail e Celular.";
    } else if (q.includes('tarifa') || q.includes('taxa')) {
        response = "O NeoBot Bank é 100% gratuito! Não cobramos taxas para manutenção de conta, Pix ou transferências.";
    } else if (q.includes('transferir') || q.includes('transferencia')) {
        response = "Para realizar transferências, clique na opção 'Transferir' no menu principal ou informe o valor e conta por aqui.";
    } else if (q.includes('obrigado') || q.includes('valeu')) {
        response = "De nada! Estou sempre aqui para te ajudar. 😉";
    } else {
        response = "Desculpe, ainda estou aprendendo! Você pode tentar perguntar sobre 'saldo', 'chaves Pix', 'tarifas' ou 'transferências'.";
    }

    addMessage(response, 'bot');
}

// Modais e Operações Financeiras
function openModal(type) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    modal.classList.remove('hidden');

    if (type === 'pix') {
        title.textContent = 'Área Pix';
        body.innerHTML = `
            <p style="margin-bottom:0.8rem; color: #94a3b8; font-size: 0.85rem;">Sua chave: <strong>cpf@neobot.com</strong> | Conta: <strong>123456-7</strong></p>
            
            <label style="display:block; margin-bottom:0.3rem; color:#94a3b8; font-size:0.85rem;">Tipo de Operação:</label>
            <select id="pix-type" style="width:100%; padding:0.8rem; margin-bottom:0.8rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
                <option value="out">Enviar Pix (Pagar)</option>
                <option value="in">Receber Pix (Depositar na minha conta)</option>
            </select>

            <input type="number" id="pix-amount" placeholder="Valor (R$)" style="width:100%; padding:0.8rem; margin-bottom:0.8rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <input type="text" id="pix-key" placeholder="Chave Pix ou Conta de Destino/Origem" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <button class="btn-primary" onclick="executeTransaction('Pix')">Confirmar Operação Pix</button>
        `;
    } else if (type === 'transfer') {
        title.textContent = 'Transferência Bancária';
        body.innerHTML = `
            <input type="number" id="trans-amount" placeholder="Valor (R$)" style="width:100%; padding:0.8rem; margin-bottom:0.8rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <input type="text" id="trans-dest" placeholder="Conta de Destino (Ex: 123456-7)" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <button class="btn-primary" onclick="executeTransaction('Transferência')">Confirmar Transferência</button>
        `;
    } else if (type === 'pay') {
        title.textContent = 'Pagamento de Boletos';
        body.innerHTML = `
            <input type="number" id="pay-amount" placeholder="Valor do Boleto (R$)" style="width:100%; padding:0.8rem; margin-bottom:0.8rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <input type="text" placeholder="Digite a linha digitável do boleto" style="width:100%; padding:0.8rem; margin-bottom:1rem; background:#0a0e17; border:1px solid #1e293b; color:#fff; border-radius:8px;">
            <button class="btn-primary" onclick="executeTransaction('Pagamento')">Pagar Boleto</button>
        `;
    }
}

// Função para processar transações de entrada e saída
function executeTransaction(typeLabel) {
    let amountInput, pixTypeSelect, destinationInput;
    
    if (typeLabel === 'Pix') {
        amountInput = document.getElementById('pix-amount');
        pixTypeSelect = document.getElementById('pix-type');
        destinationInput = document.getElementById('pix-key');
    } else if (typeLabel === 'Transferência') {
        amountInput = document.getElementById('trans-amount');
        destinationInput = document.getElementById('trans-dest');
    } else if (typeLabel === 'Pagamento') {
        amountInput = document.getElementById('pay-amount');
    }

    const amount = parseFloat(amountInput ? amountInput.value : 0);
    const destination = destinationInput ? destinationInput.value.trim() : '';

    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, digite um valor válido.');
        return;
    }

    // Verificar se é Pix de Entrada (Depósito / Recebimento)
    let isIncoming = false;
    if (typeLabel === 'Pix' && pixTypeSelect && pixTypeSelect.value === 'in') {
        isIncoming = true;
    }

    // Se for Pix enviado para a própria conta (123456-7 ou cpf@neobot.com)
    if (destination === '123456-7' || destination.toLowerCase() === 'cpf@neobot.com') {
        isIncoming = true;
    }

    if (isIncoming) {
        // ENTRADA DE DINHEIRO
        currentBalance += amount;
        updateBalanceDisplay();
        addStatementItem(`Pix Recebido (${destination || 'Sua Conta'})`, amount, true);
        alert(`Pix de R$ ${amount.toFixed(2)} recebido com sucesso na sua conta!`);
    } else {
        // SAÍDA DE DINHEIRO
        if (amount > currentBalance) {
            alert('Saldo insuficiente para realizar esta operação.');
            return;
        }

        currentBalance -= amount;
        updateBalanceDisplay();
        addStatementItem(`${typeLabel} Realizado(a)`, amount, false);
        alert(`${typeLabel} de R$ ${amount.toFixed(2)} enviado(a) com sucesso!`);
    }

    closeModal();
}

// Adiciona movimentação visual na lista do Extrato
function addStatementItem(description, amount, isIncoming) {
    const statementList = document.getElementById('statement-list');
    const newItem = document.createElement('li');
    
    newItem.className = `statement-item ${isIncoming ? 'in' : 'out'}`;
    newItem.innerHTML = `
        <div class="info">
            <strong>${description}</strong>
            <small>Hoje, agora</small>
        </div>
        <span class="value">${isIncoming ? '+' : '-'} R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
    `;
    statementList.insertBefore(newItem, statementList.firstChild);
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}