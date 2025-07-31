<?php

require_once 'config.php';

$item = $_POST['item'] ?? '';
$quantidade = $_POST['quantidade'] ?? '';
$prateleira = $_POST['prateleira'] ?? '';
$lado = $_POST['lado'] ?? '';

if (!empty($item) && !empty($quantidade)) {
    $stmt = $conn->prepare("INSERT INTO info (item, quantidade, prateleira, lado) VALUES (?, ?, ?, ?)");

    if ($stmt === false) {
        die("Erro na query SQL: " . $conn->error);
    }

    $stmt->bind_param("siss", $item, $quantidade, $prateleira, $lado);

    if ($stmt->execute()) {
        echo "Pedido salvo com sucesso!";
    } else {
        echo "Erro ao salvar o pedido: " . $stmt->error;
    }
    $stmt->close();
} else {
    echo "Nenhum item ou quantidade recebida.";
}

$conn->close();
?>
