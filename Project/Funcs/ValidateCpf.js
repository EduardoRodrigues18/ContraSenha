var haveClient = false;
const { GetClientesByCPF } = require('./cliente'); 
const app = express();
function validaCPF(cpf) {
    // Função já bem implementada
    // Código da validação de CPF...
}

function validaCNPJ(cnpj) {
    // Função já bem implementada
    // Código da validação de CNPJ...
}

// Função única de validação que reduz redundância
function validarDocumento(value) {
    var cleanedValue = String(value).replace(/[^\d]/g, '');
    if (cleanedValue.length === 11) return validaCPF(cleanedValue);
    if (cleanedValue.length === 14) return validaCNPJ(cleanedValue);
    return false;
}

// Função simplificada para exibir alertas
function exibirAlerta(mensagem, tipo = 'danger') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Função que busca os clientes
function fetchClientes() {
    return fetch('/clientes')  // Faz uma requisição GET ao backend
        .then(response => response.json())
        .then(data => {
            console.log(data);  
            haveClient = true;  // Marca que encontrou clientes
            return data;
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            haveClient = false;
            throw error;
        });
}

document.getElementById('BtnSearchCPF').addEventListener('click', async function () {
    var cpfCnpjValue = document.getElementById('cpfCnpjInput').value;
    var usernameValue = document.querySelector('input[placeholder="Usuario"]').value;
    var passwordValue = document.querySelector('input[placeholder="Senha"]').value;

    if (cpfCnpjValue === '') {
        return exibirAlerta('Informe um CPF ou CNPJ');
    }

    if (usernameValue === '') {
        return exibirAlerta('Informe o nome de usuário');
    }

    if (passwordValue === '') {
        return exibirAlerta('Informe a senha');
    }

    // Verifica se CPF ou CNPJ são válidos
    if (!validarDocumento(cpfCnpjValue)) {
        return exibirAlerta('CPF ou CNPJ inválido');
    }

    try {
        // Faz uma requisição POST para o backend
        const response = await fetch('/clientes/cpf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpfCnpjValue })  // Passa o CPF no body da requisição
        });

        const data = await response.json();  // Obtém a resposta como JSON

        if (response.ok && data.cliente) {
            exibirAlerta('Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => window.location.href = "menu.html", 2000);
        } else {
            exibirAlerta(data.message || 'Cliente não encontrado', 'danger');
        }
    } catch (error) {
        exibirAlerta('Erro ao buscar clientes!', 'danger');
    }
});
