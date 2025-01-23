
const Registry = require('winreg');

// Caminho do executável a ser registrado
const executablePath = "C:\\Users\\Usuário\\Documents\\GitHub\\Front-ContraSenha\\Project\\boostrap_project.exe"; // Substitua pelo caminho real
const programName = "Contra_Senha"; // Nome da chave no registro

// Configurar a chave no Registro do Windows (HKCU\Software\Microsoft\Windows\CurrentVersion\Run)
const regKey = new Registry({
    hive: Registry.HKCU, // HKEY_CURRENT_USER
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
});

// Adicionar o programa ao Registro
regKey.set(programName, Registry.REG_SZ, executablePath, (err) => {
    if (err) {
        console.error("Erro ao adicionar ao Registro:", err.message);
    } else {
        console.log(`${programName} configurado para iniciar com o Windows!`);
    }
});

