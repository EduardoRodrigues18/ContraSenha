var haveClient = false;
function validaCPF(cpf) {
    var Soma = 0;
    var Resto;

    var strCPF = String(cpf).replace(/[^\d]/g, '');

    if (strCPF.length !== 11) return false;

    if (['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'].includes(strCPF))
        return false;

    for (var i = 1; i <= 9; i++) {
        Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }

    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;

    if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) {
        Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }

    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;

    if (Resto !== parseInt(strCPF.substring(10, 11))) return false;

    return true;
}

function validaCNPJ(cnpj) {
    var strCNPJ = String(cnpj).replace(/[^\d]/g, '');

    if (strCNPJ.length !== 14) return false;

    if (['00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444', '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999'].includes(strCNPJ))
        return false;

    var tamanho = strCNPJ.length - 2;
    var numeros = strCNPJ.substring(0, tamanho);
    var digitos = strCNPJ.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(0)) return false;

    tamanho++;
    numeros = strCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(1)) return false;

    return true;
}

function exibirAlerta(mensagem, tipo) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
function fetchClientes() {
    fetch('/clientes')  // Faz uma requisição GET ao backend
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Aqui você pode processar os dados recebidos
            exibirAlerta('Clientes encontrados!', 'success');
            haveClient = true;
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            exibirAlerta('Erro ao buscar clientes!', 'danger');
            haveClient = false;
        });
}

function CheckLengthToCPFOrCNPJ(value) {
    var cleanedValue = String(value).replace(/[^\d]/g, '');

    if (cleanedValue.length === 11) {
        return validaCPF(cleanedValue);
    } else if (cleanedValue.length === 14) {
        return validaCNPJ(cleanedValue);
    }

    return false;
}

document.getElementById('BtnSearchCPF').addEventListener('click', function () {
    var cpfCnpjValue = document.getElementById('cpfCnpjInput').value;
    var usernameValue = document.querySelector('input[placeholder="Usuario"]').value;
    var passwordValue = document.querySelector('input[placeholder="Senha"]').value;

    var isValidCPFOrCNPJ = CheckLengthToCPFOrCNPJ(cpfCnpjValue);
    fetchClientes();

    // Verifica se CPF ou CNPJ está vazio
    if (cpfCnpjValue === '') {
        exibirAlerta('Informe um CPF ou CNPJ', 'danger');
        return;
    }

    // Verifica se usuário está vazio
    if (usernameValue === '') {
        exibirAlerta('Informe o nome de usuário', 'danger');
        return;
    }

    // Verifica se senha está vazia
    if (passwordValue === '') {
        exibirAlerta('Informe a senha', 'danger');
        return;
    }

    // Valida CPF ou CNPJ
    if (!isValidCPFOrCNPJ) {
        exibirAlerta('CPF ou CNPJ inválido', 'danger');
        return;
    }

    // Se tudo for válido, redireciona para a página de menu
    if(haveClient == true){
        exibirAlerta('Login bem-sucedido! Redirecionando...', 'success');
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 2000);
    }

});

