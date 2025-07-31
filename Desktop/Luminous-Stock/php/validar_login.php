<?php
session_start();
require_once 'config.php'; // Sua conexão com o banco

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Atenção: idealmente, senha deveria ser armazenada hashed no banco e verificada com password_verify()
// Para simplicidade, usarei comparação direta (não recomendado em produção)

$sql = "SELECT * FROM usuarios WHERE nome_usuario = ? AND senha = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Erro ao preparar: " . $conn->error);
}

$stmt->bind_param("ss", $username, $password);
$stmt->execute();

$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if ($usuario) {
    // Define as variáveis de sessão com os dados do usuário
    $_SESSION['usuario'] = $usuario['nome_usuario'];
    $_SESSION['tipo_usuario'] = $usuario['tipo']; // ex: 'admin', 'funcionario', 'cliente'

    // Redireciona para a página principal do sistema
    header("Location: ../html/sistema.html");
    exit();
} else {
    // Login inválido: redireciona para a página de login com erro
    header("Location: ../html/index.html?erro=1");
    exit();
}
?>
