const { exec } = require("child_process");

// Comando que você deseja executar
const comando = "nodemon ./app.js";

// Executa o comando no PowerShell
exec(comando, { shell: "cmd.exe" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Output:\n${stdout}`);
  });
  