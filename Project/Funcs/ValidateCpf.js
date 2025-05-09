var haveClient = false;
//const {getUsuario, setUsuario} = require('../src/usuario'); 
function validaCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
}

// Função única de validação que reduz redundância
function validarDocumento(value) {
    var cleanedValue = String(value).replace(/[^\d]/g, '');
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
    return fetch('/usuarios')  // Faz uma requisição GET ao backend
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
        return exibirAlerta('Informe seu CNPJ');
    }

    if (usernameValue === '') {
        return exibirAlerta('Informe o nome de usuário');
    }

    if (passwordValue === '') {
        return exibirAlerta('Informe a senha');
    }

    if (!validarDocumento(cpfCnpjValue)) {
        return exibirAlerta('CNPJ inválido');
    }

    try {
        const response = await fetch('/usuarios/name', {
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
