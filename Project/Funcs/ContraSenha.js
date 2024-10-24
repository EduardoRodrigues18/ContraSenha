var inputValue;
var durationTime;
var selectedUser;

const usuarios = ['Todos', 'Usuário 1', 'Usuário 2', 'Usuário 3'];
const duracoes = ['1 minuto', '5 minutos', '10 minutos'];
const opcoes = [
    "TODOS",
    "ABERTURA DO PERIODO",
    "ABRECAIXA",
    "ALCADASLIBERACAO",
    "CANCELAITEM",
    "CANCELATELE",
    "CANCELAVR",
    "CHECKOUT",
    "CONFCEGAENTRADA",
    "CONFCEGASAIDA",
    "CONTASEMATRASO",
    "DESCONTO",
    "ENCERRARCONTRATO",
    "ESTOQUEINSUFICIENTE",
    "FECHACAIXA",
    "FECHAMENTO DO PERIODO",
    "IMPRIMIRPELOCUSTO",
    "LIMITEDECREDITO",
    "SANGRIACAIXA",
    "SEMCOMPRANOPERIODO",
    "SEPARAPORLOCALESTOQUE",
    "TRANSFERENCIACAIXA",
    "TROCO",
    "VALIDARCP"
  ];
  

function validarContraSenha(contraSenha) {
    return contraSenha !== ""; // Verifica se a contra-senha não está vazia
}

function randomContraSenha()
{
    return Math.floor(Math.random() * (1000, 9999))
}


function gerarDropdown(opcoes, dropdownId) {
    const dropdownMenu = document.querySelector(`#${dropdownId} + .dropdown-menu`);
    dropdownMenu.innerHTML = ''; // Limpa o conteúdo atual (caso haja algum)

    opcoes.forEach(opcao => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = '#';
        a.textContent = opcao;
        a.setAttribute('data-value', opcao);

        a.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById(dropdownId).innerHTML = `<b>${opcao}</b>`;
            if (dropdownId === 'dropdownDuration') {
                durationTime = opcao;
            } else if (dropdownId === 'dropdownUser') {
                selectedUser = opcao;
            }
        });

        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });
}
function isDefined(){
    if(durationTime == null){
        return false;
    }else{
        return true;
    }
}
function exibirAlerta(mensagem, tipo = 'danger') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

document.getElementById('BtnGerarContraSenha').addEventListener('click', function () {
    var inputValue = document.getElementById('InputContraSenha').value;
    var isValidContraSenha = validarContraSenha(inputValue);
    
    console.log(isDefined())
    if (isValidContraSenha && isDefined()) 
        {
        exibirAlerta('Contra-Senha Gerada: ' + inputValue + '<br>Tempo de duração: ' + durationTime, 'success');
    } else if(!isDefined()) {
        exibirAlerta('Defina um tempo de duração!', 'danger');
    }else{
        exibirAlerta('Contra-Senha Gerada: ' + randomContraSenha() + '<br>Tempo de duração: ' + durationTime, 'success');
    }
});

// Gerar opções de dropdown para usuários e duração
gerarDropdown(usuarios, 'dropdownUser');
gerarDropdown(duracoes, 'dropdownDuration');
gerarDropdown(opcoes, 'dropdownLiberacao')
