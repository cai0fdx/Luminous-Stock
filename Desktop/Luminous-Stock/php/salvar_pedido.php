<?php
include 'config.php'; // conexão com banco

$item = $_POST['item'] ?? '';
$quantidade = $_POST['quantidade'] ?? '';
$prateleira = $_POST['prateleira'] ?? '';
$lado = $_POST['lado'] ?? '';
$status = $_POST['status'] ?? 'pendente';

$sql = "INSERT INTO info (item, quantidade, prateleira, lado, status) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisss", $item, $quantidade, $prateleira, $lado, $status);

if ($stmt->execute()) {
    echo "Pedido salvo com sucesso!";
} else {
    echo "Erro ao salvar pedido: " . $stmt->error;
}
?>
