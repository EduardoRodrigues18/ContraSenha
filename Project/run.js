const { spawn } = require("child_process");

// Comando que você deseja executar
const comando = "cmd.exe";
const args = ["/c", "start", "/min", "cmd.exe", "/c", "nodemon ./app.js"];

// Inicia o comando no cmd com a opção detached
const processo = spawn(comando, args, {
  detached: true,
  stdio: "ignore", // Ignora o stdout e stderr do processo filho
});

// Encerra o processo pai (Node.js) e mantém o cmd rodando
processo.unref();

console.log("Processo iniciado em segundo plano.");
