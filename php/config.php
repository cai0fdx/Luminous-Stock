<?php
$host = "127.0.0.1";
$port = 8080; 
$db = "almoxerifado"; 
$user = "root"; 
$pass = "1234"; 

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

?>

