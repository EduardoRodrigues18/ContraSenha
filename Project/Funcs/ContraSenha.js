function validarContraSenha(contraSenha) {
    if (contraSenha == "") {
        return false
    } else {
        return true
    }
}

document.getElementById('BtnGerarContraSenha').addEventListener('click', function () {
    console.log("sdfds");
    var inputValue = document.getElementById('InputContraSenha').value;
    console.log(inputValue);
    var isValid = validarContraSenha(inputValue);
    console.log(isValid);

    if (isValid == true) {
        alert('Contra-Senha Gerada: ' + inputValue);
    }
    else if(isValid == false) {
        alert('Digite uma Contra-Senha');
    }
});