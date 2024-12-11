const path = require('path');
const Service = require('node-windows').Service;

// Caminho para o seu arquivo principal (altere se necessário)
const appPath = path.join(__dirname, 'app.js'); // Este é o arquivo principal do seu app

// Cria o serviço
const svc = new Service({
  name: 'MyNodeApp', // Nome do serviço
  description: 'Este é um serviço Node.js rodando em segundo plano.',
  script: appPath, // Caminho para o arquivo principal do aplicativo
  wait: 2, // Tempo de espera entre tentativas de reinício em caso de falha
  grow: 0.5, // Incremento no tempo de espera em caso de falha
});

// Ao instalar o serviço, inicie-o automaticamente
svc.on('install', () => {
  console.log('Serviço instalado com sucesso!');
  svc.start();
});

// Se o serviço já estiver instalado, apenas inicie-o
if (!svc.exists) {
  svc.install();
} else {
  svc.start();
}
