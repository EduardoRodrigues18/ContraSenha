let durationTime;
let selectedUser;

const duracoes = ['1 minuto', '5 minutos', '10 minutos'];
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
            data.clientes.unshift({ USR_LOGIN: 'TODOS' });
            popularDropdown(data.clientes, 'dropdownUser', 'USR_LOGIN');
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
        linkItem.textContent = valueKey ? item[valueKey] : item; // Usar valueKey para objetos e item direto para strings

        linkItem.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById(dropdownId).innerHTML = `<b>${linkItem.textContent}</b>`;
            if (dropdownId === 'dropdownUser') {
                selectedUser = linkItem.textContent;
            } else if (dropdownId === 'dropdownDuration') {
                durationTime = linkItem.textContent;
            }
        });

        li.appendChild(linkItem);
        dropdownMenu.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buscarUsuarios();
    popularDropdown(duracoes, 'dropdownDuration');        // Sem `valueKey` para arrays de strings
    popularDropdown(opcoesLiberacao, 'dropdownLiberacao'); // Sem `valueKey` para arrays de strings
});

document.getElementById('BtnGerarContraSenha').addEventListener('click', function () {
    const inputValue = document.getElementById('InputContraSenha').value;
    const isValidContraSenha = validarContraSenha(inputValue);

    if (!durationTime) {
        exibirAlerta('Defina um tempo de duração!', 'danger');
    } else if (isValidContraSenha) {
        exibirAlerta(`Contra-Senha Gerada: ${inputValue}<br>Tempo de duração: ${durationTime}`, 'success');
    } else {
        exibirAlerta(`Contra-Senha Gerada: ${randomContraSenha()}<br>Tempo de duração: ${durationTime}`, 'success');
    }
});
