
let durationTime;
let selectedUser;
let selectedLiberacao;
let usuariocod = null;

const duracoes = [
    { label: "1 minuto", value: 1 },
    { label: "5 minutos", value: 5 },
    { label: "10 minutos", value: 10 }
];

const usuarios = null;

const opcoesLiberacao = [
    "TODOS", "ABERTURA DO PERIODO", "ABRECAIXA", "ALCADASLIBERACAO", "CANCELAITEM", 
    "CANCELATELE", "CANCELAVR", "CHECKOUT", "CONFCEGAENTRADA", "CONFCEGASAIDA",
    "CONTASEMATRASO", "DESCONTO", "ENCERRARCONTRATO", "ESTOQUEINSUFICIENTE",
    "FECHACAIXA", "FECHAMENTO DO PERIODO", "IMPRIMIRPELOCUSTO", "LIMITEDECREDITO", 
    "SANGRIACAIXA", "SEMCOMPRANOPERIODO", "SEPARAPORLOCALESTOQUE", 
    "TRANSFERENCIACAIXA", "TROCO", "VALIDARCP"
];

function validarContraSenha(contraSenha) {
    return contraSenha !== "";
}

function randomContraSenha() {
    return Math.floor(Math.random() * 9000 + 1000);
}

function exibirAlerta(mensagem, tipo = 'danger', copiar = false) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
            <span id="contraSenhaText">${mensagem}</span>
            ${copiar ? `<button id="btnCopy" class="btn btn-sm btn-success ms-2">Copiar</button>` : ''}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Configurar botão de cópia se necessário
    if (copiar) {
        const btnCopy = document.getElementById('btnCopy');
        btnCopy.addEventListener('click', () => {
            const textToCopy = mensagem.replace('Contra-Senha Gerada: ', '').trim(); // Ajusta para copiar apenas o valor
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        
                    })
                    .catch(err => {
                        console.error('Erro ao copiar com Clipboard API:', err);
                        fallbackCopyTextToClipboard(textToCopy);
                    });
            } else {
                fallbackCopyTextToClipboard(textToCopy);
            }
        });
    }
}

function fallbackCopyTextToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Selecionar o texto no elemento temporário
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Compatibilidade com dispositivos móveis

    try {
        const successful = document.execCommand('copy');
    } catch (err) {
        console.error('Erro ao copiar com fallback:', err);
        alert('Erro ao copiar contra-senha.');
    } finally {
        document.body.removeChild(tempInput);
    }
}

function copyContraSenha(mensagem, tipo = 'danger') {
    document.getElementById('alertContainer').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

async function buscarUsuarios() {
    try {
        const response = await fetch('http://192.168.0.71:3000/usuarios');
        const data = await response.json();

        if (data.clientes && data.clientes.length > 0) {
            
            const usuarios = data.clientes.map(cliente => ({
                label: cliente.USR_LOGIN,
                value: cliente.USR_CODIGO
            }));
            usuarios.unshift({ label: 'TODOS', value: null }); 

            popularDropdown(usuarios, 'dropdownUser');
        } else {
            console.log('Nenhum cliente encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
    }
}

function popularDropdown(items, dropdownId, valueKey = null) {
    const dropdownMenu = document.querySelector(`#${dropdownId} + .dropdown-menu`);
    dropdownMenu.innerHTML = '';
    

    items.forEach(item => {
        const li = document.createElement('li');
        const linkItem = document.createElement('a');
        linkItem.classList.add('dropdown-item');
        linkItem.href = "#";

        if (typeof item === 'object' && item !== null) {
            linkItem.textContent = item.label || item[valueKey]; 
        } else {
            linkItem.textContent = item; 
        }

        linkItem.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById(dropdownId).innerHTML = `<b>${linkItem.textContent}</b>`;

            if (dropdownId === 'dropdownUser') {
                console.log(obterUsuarioAtual());

                selectedUser = item.value; 
            } else if (dropdownId === 'dropdownDuration') {
                durationTime = item.value !== undefined ? item.value : item; 
            } else if (dropdownId === 'dropdownLiberacao') {
                selectedLiberacao = item;
            }
        });

        li.appendChild(linkItem);
        dropdownMenu.appendChild(li);
    });
}

async function obterUsuarioAtual() {
    try {
        const response = await fetch('http://192.168.0.71:3000/usuario-atual');
        if (response.ok) {
            const data = await response.json();
            return data.usuario; // Certifique-se de que "usuario" está correto
        } else {
            exibirAlerta('Erro ao obter o usuário atual', 'danger');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar o usuário atual:', error);
        exibirAlerta('Erro ao buscar o usuário atual!', 'danger');
        return null;
    }
}


async function gerarContraSenha(usuario, duracao, contraSenha) {
    try {
        // Obter o código do usuário atual
        usuariocod = await obterUsuarioAtual();
        if (!usuariocod) { // Verifica se o código é válido
            exibirAlerta('Erro: Usuário atual não encontrado!', 'danger');
            return;
        }

        const response = await fetch('http://192.168.0.71:3000/gerar-contrasenha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CSH_CODIGO: usuariocod,
                CSH_CONTRASENHA: contraSenha,
                CSH_DTHR_VALIDADE: duracao,
                USR_UTILIZOU: usuario 
            })
        });

        if (response.ok) {
            const data = await response.text();
            console.log('Resposta da API:', data);
        } else {
            const errorText = await response.text();
            exibirAlerta(errorText || 'Erro ao gerar contra-senha', 'danger');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        exibirAlerta('Erro ao tentar gerar contra-senha!', 'danger');
    }
}




document.addEventListener('DOMContentLoaded', () => {
    buscarUsuarios();
    popularDropdown(duracoes, 'dropdownDuration');        
    popularDropdown(opcoesLiberacao, 'dropdownLiberacao'); 
    
});

document.getElementById('BtnGerarContraSenha').addEventListener('click', async function () {
    const inputValue = document.getElementById('InputContraSenha').value;
    const isValidContraSenha = validarContraSenha(inputValue);

    if (!durationTime) {
        exibirAlerta('Defina um tempo de duração!', 'danger');
    }
    else if(inputValue.length>10){
        exibirAlerta('Contra-senha deve conter no máximo 10 caracteres!', 'danger');
    } 
    else if (isValidContraSenha) {
        exibirAlerta(`Contra-Senha Gerada: ${inputValue}`, 'success', true);
        await gerarContraSenha(selectedUser, durationTime, inputValue);
    }
    else {
        const contraSenha = randomContraSenha();
        exibirAlerta(`Contra-Senha Gerada: ${contraSenha}`, 'success', true);
        await gerarContraSenha(selectedUser, durationTime, contraSenha);
    }
});

window.addEventListener("load", () => {
    // Remover o token ao carregar a página


    const token = localStorage.getItem("authToken");
    localStorage.removeItem("authToken");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const decoded = JSON.parse(atob(token));
        const currentTime = Date.now();

        if (currentTime - decoded.time > 30 * 60 * 1000) { // 30 minutos
            localStorage.removeItem("authToken");
            window.location.href = "index.html";
        }
    } catch (e) {
        alert("Token inválido. Faça login novamente.");
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
    }
});

