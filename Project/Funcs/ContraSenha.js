var inputValue
var durationTime

const usuarios = ['Todos', 'Usuário 1', 'Usuário 2', 'Usuário 3'];
const duracoes = ['1 minuto', '5 minutos', '10 minutos'];

function validarContraSenha(contraSenha) {
    if (contraSenha == "") {
        return false
    } else {
        return true
    }
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
        
        a.addEventListener('click', function(event) {
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



// Atualiza o dropdown de duração da contra-senha
document.querySelectorAll('#dropdownDuration + .dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        let selectedText = this.getAttribute('data-value');
        document.getElementById('dropdownDuration').innerHTML = `<b>${selectedText}</b>`;
        durationTime = selectedText; // Salva a duração selecionada
    });
});

document.getElementById('BtnGerarContraSenha').addEventListener('click', function () {
    var inputValue = document.getElementById('InputContraSenha').value;
    console.log(inputValue);
    var isValid = validarContraSenha(inputValue);
    console.log(isValid);

    if (isValid == true) {
        alert('Contra-Senha Gerada: ' + inputValue + '\nTempo de duração: ' + durationTime);
    }
    else if(isValid == false) {
        alert('Digite uma Contra-Senha');
    }
});
gerarDropdown(usuarios, 'dropdownUser');
gerarDropdown(duracoes, 'dropdownDuration');
