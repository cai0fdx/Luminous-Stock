<?php
include 'config.php';

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

if ($id && $status) {
    $sql = "UPDATE info SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        echo "Status atualizado com sucesso";
    } else {
        echo "Erro ao atualizar status: " . $stmt->error;
    }
} else {
    echo "Parâmetros inválidos";
}
?>
