<?php
$host = "127.0.0.1:8080";
$db = "almoxerifado"; 
$user = "root"; 
$pass = "1234"; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$item = $_POST['item'] ?? '';
$quantidade = $_POST['quantidade'] ?? '';

if (!empty($item) && !empty($quantidade)) {
    $stmt = $conn->prepare("INSERT INTO pedido (item, quantidade) VALUES (?, ?)");
    $stmt->bind_param("ss", $item, $quantidade);
    
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
