let contadorPedidos = 0;
let pedidos = [];

const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.getElementById('mainContent');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show');
  mainContent.classList.toggle('shifted'); // importante
});



function abrirAba(abaId) {
    document.querySelectorAll('.aba').forEach(el => el.classList.remove('ativa'));
    document.getElementById(abaId).classList.add('ativa');
    if (abaId === 'usuario') {
        atualizarListaPedidos();
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

    fetch('../php/salvar_pedido.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'item=' + encodeURIComponent(pedido.item) + '&quantidade=' + encodeURIComponent(pedido.quantidade)
    })
    .then(response => response.text())
    .then(data => {
        alert('Pedido aceito e salvo no banco: ' + data);
    })
    .catch(error => {
        alert('Erro ao salvar pedido: ' + error);
    });

    const listaDiv = document.getElementById('listaPedidos');
    const pedidoElement = [...listaDiv.children].find(el => Number(el.dataset.id) === idPedido);

    if (pedidoElement) {
        pedidoElement.classList.add('desaparecer');
        setTimeout(() => {
            pedidos.splice(pedidoIndex, 1);
            atualizarListaPedidos();
        }, 400);
    }

    fetch(`http://192.168.4.1/led?id=${idPedido}`).catch(() => {
        console.log('Falha na conexão com ESP32 (simulado)');
    });
}

function recusarPedido(idPedido) {
    const pedidoIndex = pedidos.findIndex(p => p.id === idPedido);
    if (pedidoIndex === -1) return;

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
