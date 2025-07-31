let contadorPedidos = 0;
let pedidos = [];
let tipoUsuario = ''; // variável global para armazenar o tipo do usuário

const form = document.getElementById("loginForm");
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const usuario = document.getElementById("nome_usuario").value;
        const senha = document.getElementById("senha").value;

        fetch('../php/validar_login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `nome_usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
        });
    });
}

function logout() {
    fetch('../php/logout.php') // chama o script PHP que destrói a sessão
        .then(() => {
            window.location.href = '../html/index.html'; // redireciona para login
        });
}

window.onload = function() {
    fetch('../php/usuario_tipo.php')
        .then(res => res.json())
        .then(data => {
            tipoUsuario = data.tipo;
            console.log('Tipo de usuário:', tipoUsuario);

            if (tipoUsuario === 'funcionario') {
                const btnFuncionario = document.querySelector("button[onclick=\"abrirAba('funcionario')\"]");
                const btnLocalizacao = document.querySelector("button[onclick=\"abrirAba('localização')\"]");

                if (btnFuncionario) btnFuncionario.style.display = 'none';
                if (btnLocalizacao) btnLocalizacao.style.display = 'none';
            }
        })
        .catch(err => console.error('Erro ao pegar tipo de usuário:', err));
};

// Mapeamento global item → localização (prateleira + lado)
const mapeamentoLocalizacao = {
    'Alicate Hidráulico': { prateleira: 'A1', lado: 'Frente' },
    'Concetor para Jampe': { prateleira: 'B1', lado: 'Atrás' },
    'Bastão Tira Pipa de Fenda': { prateleira: 'A2', lado: 'Frente' },
    'Gancho Universal': { prateleira: 'B2', lado: 'Atrás' },
    'Cobertura Circular': { prateleira: 'A1', lado: 'Atrás' },
    'Luva Isolante': { prateleira: 'B1', lado: 'Frente' },
    'Bastão podador': { prateleira: 'A2', lado: 'Atrás' },
    'Locador de Pino': { prateleira: 'B2', lado: 'Frente' }
};

const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.getElementById('mainContent');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    mainContent.classList.toggle('shifted'); // importante
});

function acenderBolinha(item) {
    // Primeiro desliga todas as bolinhas
    document.querySelectorAll('.bolinha').forEach(bola => {
        bola.classList.remove('ativa');
    });

    const mapeamentoItens = {
        'Alicate Hidráulico': 'bolinha1-superior',
        'Concetor para Jampe': 'bolinha2-inferior',
        'Bastão Tira Pipa de Fenda': 'bolinha3-superior',
        'Gancho Universal': 'bolinha4-inferior',
        'Cobertura Circular': 'bolinha1-inferior',
        'Luva Isolante': 'bolinha2-superior',
        'Bastão podador': 'bolinha3-inferior',
        'Locador de Pino': 'bolinha4-superior'
    };

    const bolinhaId = mapeamentoItens[item];
    if (bolinhaId) {
        const bolinha = document.getElementById(bolinhaId);
        if (bolinha) bolinha.classList.add('ativa');
    }
}

function abrirAba(abaId) {
    document.querySelectorAll('.aba').forEach(el => el.classList.remove('ativa'));
    document.getElementById(abaId).classList.add('ativa');

    if (abaId === 'usuario') {
        atualizarListaPedidos();
    }

    if (abaId === 'funcionario') {
        // Buscar pedidos pendentes do BD para exibir ao admin
        fetch('../php/listar_pedidos.php')
            .then(res => res.json())
            .then(data => {
                pedidos = data.map(p => ({
                    id: Number(p.id),
                    item: p.item,
                    quantidade: Number(p.quantidade),
                    status: p.status,
                    prateleira: p.prateleira,
                    lado: p.lado
                }));
                atualizarListaPedidos();
            })
            .catch(err => {
                console.error('Erro ao carregar pedidos pendentes:', err);
                pedidos = [];
                atualizarListaPedidos();
            });
    }
}


function adicionarPedido(item, botao) {
    const quantidade = prompt(`Informe a quantidade desejada para "${item}":`, "1");

    if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
        alert("Quantidade inválida.");
        return;
    }

    const rect = botao.getBoundingClientRect();
    confetti({
        particleCount: 100,
        spread: 70,
        origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
        }
    });

    contadorPedidos++;
    const pedido = { id: contadorPedidos, item: item, quantidade: Number(quantidade) };
    pedidos.push(pedido);
    atualizarListaPedidos();

    // Salva pedido no banco para qualquer usuário (funcionario ou cliente)
    const localizacaoInfo = mapeamentoLocalizacao[item] || { prateleira: '', lado: '' };

    fetch('../php/salvar_pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'item=' + encodeURIComponent(item) +
                '&quantidade=' + encodeURIComponent(quantidade) +
                '&prateleira=' + encodeURIComponent(localizacaoInfo.prateleira) +
                '&lado=' + encodeURIComponent(localizacaoInfo.lado) +
                '&status=' + encodeURIComponent('pendente')
        })
        .then(res => res.text())
        .then(res => console.log('Pedido salvo:', res))
        .catch(err => console.error('Erro ao salvar pedido:', err));
}

function atualizarListaPedidos() {
    const listaDiv = document.getElementById('listaPedidos');
    listaDiv.innerHTML = '';

    pedidos.forEach(pedido => {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'pedido';
        pedidoDiv.dataset.id = pedido.id;
        pedidoDiv.innerHTML = `
      <strong>Pedido #${pedido.id}</strong><br>
      Item: ${pedido.item}<br>
      Quantidade: ${pedido.quantidade}<br>
      <button class="acao" onclick="aceitarPedido(${pedido.id})">Aceitar Pedido</button>
      <button class="recusar" onclick="recusarPedido(${pedido.id})">Recusar Pedido</button>
    `;
        listaDiv.appendChild(pedidoDiv);
    });
}

function aceitarPedido(idPedido) {
    const pedidoIndex = pedidos.findIndex(p => p.id === idPedido);
    if (pedidoIndex === -1) return;

    const pedido = pedidos[pedidoIndex];
    acenderBolinha(pedido.item);



    // PARTE DA ESP32 
    const esp32 = "http://192.168.4.1"; // IP fixo da ESP32 em modo Access Point
    fetch(`${esp32}/led?item=${encodeURIComponent(pedido.item)}`)
        .then(res => res.text())
        .then(data => console.log("Resposta do ESP32:", data))
        .catch(err => console.error("Erro ao enviar comando para o ESP32:", err));


    const botaoLocal = document.querySelector('button[onclick="abrirAba(\'localização\')"]');
    if (botaoLocal) {
        botaoLocal.classList.add('destacar');
        setTimeout(() => {
            botaoLocal.classList.remove('destacar');
        }, 10000);
    }

    const localizacaoInfo = mapeamentoLocalizacao[pedido.item] || { prateleira: '', lado: '' };

    fetch('../php/atualizar_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + encodeURIComponent(pedido.id) +
                '&status=' + encodeURIComponent('aceito')
        })
        .then(res => res.text())
        .then(res => console.log('Pedido aceito salvo:', res))
        .catch(err => console.error('Erro ao salvar pedido aceito:', err));

    const listaDiv = document.getElementById('listaPedidos');
    const pedidoElement = [...listaDiv.children].find(el => Number(el.dataset.id) === idPedido);

    if (pedidoElement) {
        pedidoElement.classList.add('desaparecer');
        setTimeout(() => {
            pedidos.splice(pedidoIndex, 1);
            atualizarListaPedidos();
        }, 400);
    }
}


function recusarPedido(idPedido) {
    const pedidoIndex = pedidos.findIndex(p => p.id === idPedido);
    if (pedidoIndex === -1) return;
    fetch('../php/atualizar_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(idPedido) +
            '&status=' + encodeURIComponent('recusado')
    })

    const listaDiv = document.getElementById('listaPedidos');
    const pedidoElement = [...listaDiv.children].find(el => Number(el.dataset.id) === idPedido);

    if (pedidoElement) {
        pedidoElement.classList.add('desaparecer');
        setTimeout(() => {
            pedidos.splice(pedidoIndex, 1);
            atualizarListaPedidos();
        }, 400);
    }
}

function filtrarProdutos() {
    const filtro = document.getElementById('searchInput').value.toLowerCase();
    const produtos = document.querySelectorAll('#produtosContainer .produto');

    produtos.forEach(produto => {
        const nome = produto.getAttribute('data-nome').toLowerCase();
        produto.style.display = nome.includes(filtro) ? '' : 'none';
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    sidebar.classList.toggle("show");
    mainContent.classList.toggle("shifted");
}