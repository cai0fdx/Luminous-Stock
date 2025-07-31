<?php
session_start();
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados
require 'config.php'; // certifique-se que esse arquivo existe e funciona

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario'])) {
    echo json_encode([]); // retorna array vazio se não estiver logado
    exit;
}

// Consulta SQL para buscar pedidos pendentes
$sql = "SELECT id, item, quantidade, status, prateleira, lado FROM info WHERE status = 'pendente'";
$result = $conn->query($sql);

// Verifica se houve erro na query
if (!$result) {
    echo json_encode(['erro' => 'Erro na consulta: ' . $conn->error]);
    exit;
}

$pedidos = [];

while ($row = $result->fetch_assoc()) {
    $pedidos[] = $row;
}

// Retorna os pedidos em formato JSON
echo json_encode($pedidos);
$conn->close();
