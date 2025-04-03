
const ini = require('ini');
// Caminho para o arquivo de configuração
const configPath = path.join(__dirname, '../CONFIG.ini');

// Carrega e processa o arquivo ini
const configContent = fs.readFileSync(configPath, 'utf-8');
const config = ini.parse(configContent);

function criptografar(palavra) {
    let palavraInvertida = palavra.split('').reverse().join('');
    
    let criptografado = '';
    for (let i = 0; i < palavraInvertida.length; i++) {
        let ascii = palavraInvertida.charCodeAt(i).toString().padStart(3, '0');
        criptografado += ascii;
    }
    
    return criptografado;
}

function descriptografar(criptografado) {
    let caracteres = criptografado.match(/.{1,3}/g);
    
    let palavraInvertida = '';
    for (let i = 0; i < caracteres.length; i++) {
        let char = String.fromCharCode(parseInt(caracteres[i], 10));
        palavraInvertida += char;
    }
    
    let palavra = palavraInvertida.split('').reverse().join('');
    
    return palavra;
}

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
    var usernameValue = document.querySelector('input[placeholder="Usuario"]').value.toUpperCase();
    var passwordValue = document.querySelector('input[placeholder="Senha"]').value;
    if(passwordValue.length<10){
        passwordValue = criptografar(passwordValue);
    }



    if (usernameValue === '') {
        return exibirAlerta('Informe o nome de usuário');
    }

    if (passwordValue === '') {
        return exibirAlerta('Informe a senha');
    }

    console.log(passwordValue)
    try {
        const response = await fetch(config.API.url + '/usuarios/nome', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ USR_LOGIN: usernameValue, USR_SENHA: passwordValue })
        });

        const data = await response.json();
        console.log(data)

        if (response.ok ) {

            //exibirAlerta('Login bem-sucedido! Redirecionando...', 'success');
            const token = btoa(JSON.stringify({ user: usernameValue, time: Date.now() }));


            // Armazenar o token no navegador
            localStorage.setItem("authToken", token);
        
            // Redirecionar para o menu
            setTimeout(() => window.location.href = "menu.html");
            
        } else {
            exibirAlerta(data.message || 'Cliente não encontrado', 'danger');
        }
    } catch (error) {
        exibirAlerta('Erro ao buscar clientes!', 'danger');
    }
});
