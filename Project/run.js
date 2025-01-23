const { spawn } = require("child_process");

const comando = "cmd.exe";
const args = ["/c", "start", "/min", "cmd.exe", "/c", "nodemon ./app.js"];

const processo = spawn(comando, args, {
  detached: true,
  stdio: "ignore", 
});

processo.unref();

console.log("Processo iniciado em segundo plano.");
