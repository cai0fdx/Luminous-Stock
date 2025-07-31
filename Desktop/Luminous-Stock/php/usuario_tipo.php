<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['tipo_usuario'])) {
    echo json_encode(['tipo' => $_SESSION['tipo_usuario']]);
} else {
    echo json_encode(['tipo' => null]);
}
