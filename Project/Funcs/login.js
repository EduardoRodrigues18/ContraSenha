

function exibirAlerta(mensagem, tipo = 'danger') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
document.getElementById('BtnSearchCPF').addEventListener('click', async function () {
    var usernameValue = document.querySelector('input[placeholder="Usuario"]').value;
    var passwordValue = document.querySelector('input[placeholder="Senha"]').value;


    if (usernameValue === '') {
        return exibirAlerta('Informe o nome de usuário');
    }

    if (passwordValue === '') {
        return exibirAlerta('Informe a senha');
    }


    try {
        const response = await fetch('http://localhost:3000/usuarios/name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ USR_NOME: usernameValue })  // Passa o nome no body da requisição
        });

        const data = await response.json();  // Obtém a resposta como JSON

        if (response.ok ) {
            exibirAlerta('Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => window.location.href = "menu.html", 2000);
        } else {
            exibirAlerta(data.message || 'Cliente não encontrado', 'danger');
        }
    } catch (error) {
        exibirAlerta('Erro ao buscar clientes!', 'danger');
    }
});
