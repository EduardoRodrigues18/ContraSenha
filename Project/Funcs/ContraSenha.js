let durationTime;
let selectedUser;

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

function exibirAlerta(mensagem, tipo = 'danger') {
    document.getElementById('alertContainer').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

async function buscarUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
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
                selectedUser = item.value; // Aqui captura o ID do usuário
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



async function gerarContraSenha(usuario, duracao, contraSenha) {
    try {
        const response = await fetch('http://localhost:3000/gerar-contrasenha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CSH_CODIGO: 1,
                CSH_CONTRASENHA: contraSenha,
                CSH_DTHR_VALIDADE: duracao,
                USR_UTILIZOU: usuario 
            })
        });

        if (response.ok) {
            const data = await response.text(); 
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

document.getElementById('BtnGerarContraSenha').addEventListener('click',async function () {
    const inputValue = document.getElementById('InputContraSenha').value;
    const isValidContraSenha = validarContraSenha(inputValue);

    if (!durationTime) {
        exibirAlerta('Defina um tempo de duração!', 'danger');
    } else if (isValidContraSenha) {
        exibirAlerta(`Contra-Senha Gerada: ${inputValue}<br>Tempo de duração: ${durationTime}`, 'success');
        gerarContraSenha(selectedUser, durationTime, inputValue);
    } else {
        let contraSenha = randomContraSenha()
        exibirAlerta(`Contra-Senha Gerada: ${contraSenha}<br>Tempo de duração: ${durationTime} minuto(s)`, 'success');
        gerarContraSenha(selectedUser, durationTime, contraSenha);
    }
});
