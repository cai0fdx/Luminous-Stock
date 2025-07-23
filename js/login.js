document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // impede envio do formulário tradicional

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Aqui você pode definir usuário e senha fixos só pra teste
  if(username === 'admin' && password === '1234') {
    // login válido, redireciona
    window.location.href = 'sistema.html';
  } else {
    // login inválido, mostrar mensagem
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = 'Usuário ou senha incorretos';
    loginMessage.classList.add('text-red-500');
  }
});
