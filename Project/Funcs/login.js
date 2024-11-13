
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
        const response = await fetch('http://192.168.0.71:3000/usuarios/nome', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ USR_LOGIN: usernameValue, USR_SENHA: passwordValue })
        });

        const data = await response.json();
        console.log(data)

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
