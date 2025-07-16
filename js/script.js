let contadorPedidos = 0;
let pedidos = [];

function abrirAba(abaId) {
    document.querySelectorAll('.aba').forEach(el => el.classList.remove('ativa'));
    document.getElementById(abaId).classList.add('ativa');
    if (abaId === 'usuario') {
        atualizarListaPedidos();
    }
}

function adicionarPedido(item) {
    contadorPedidos++;
    const pedido = {
        id: contadorPedidos,
        item: item
    };
    pedidos.push(pedido);
    atualizarListaPedidos();
}

function atualizarListaPedidos() {
    const listaDiv = document.getElementById('listaPedidos');
    listaDiv.innerHTML = '';

    pedidos.forEach(pedido => {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'pedido';
        pedidoDiv.innerHTML = `
            <strong>Pedido #${pedido.id}</strong><br>
            Item: ${pedido.item}<br>
            <button class="acao" onclick="aceitarPedido(${pedido.id})">Aceitar Pedido</button>
            <button class="acao" onclick="recusarPedido(${pedido.id})">Recusar Pedido</button>
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
        body: 'item=' + encodeURIComponent(pedido.item)
    })
    .then(response => response.text())
    .then(data => {
        alert('Pedido aceito e salvo no banco: ' + data);
    })
    .catch(error => {
        alert('Erro ao salvar pedido: ' + error);
    });

    pedidos.splice(pedidoIndex, 1);
    atualizarListaPedidos();

    fetch(`http://192.168.4.1/led?id=${idPedido}`).catch(() => {
        console.log('Falha na conexão com ESP32 (simulado)');
    });
}

function recusarPedido(idPedido) {
    const pedidoIndex = pedidos.findIndex(p => p.id === idPedido);
    if (pedidoIndex === -1) return;

    pedidos.splice(pedidoIndex, 1);
    atualizarListaPedidos();
}

function filtrarProdutos() {
    const filtro = document.getElementById('searchInput').value.toLowerCase();
    const produtos = document.querySelectorAll('#produtosContainer .produto');

    produtos.forEach(produto => {
        const nome = produto.getAttribute('data-nome').toLowerCase();
        if (nome.includes(filtro)) {
            produto.style.display = '';
        } else {
            produto.style.display = 'none';
        }
    });
}
