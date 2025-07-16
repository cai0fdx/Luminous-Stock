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

if (!empty($item)) {
    $stmt = $conn->prepare("INSERT INTO pedidos (item) VALUES (?)");
    $stmt->bind_param("s", $item);
    if ($stmt->execute()) {
        echo "Pedido salvo com sucesso!";
    } else {
        echo "Erro ao salvar o pedido: " . $stmt->error;
    }
    $stmt->close();
} else {
    echo "Nenhum item recebido.";
}

$conn->close();
?>
