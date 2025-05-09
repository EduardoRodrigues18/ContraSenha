const Service = require('node-windows').Service;

// Criação de um novo serviço
const servico = new Service({
  name: 'MeuServicoNode', // Nome do serviço
  description: 'Serviço Node.js para rodar a aplicação.', // Descrição do serviço
  script: './app.js', // Caminho para o script principal
  nodeOptions: ['--harmony', '--max_old_space_size=4096'], // (Opcional) Opções para o Node.js
});

// Evento para registrar o serviço com sucesso
servico.on('install', () => {
  console.log('Serviço instalado com sucesso!');
  servico.start(); // Inicia o serviço automaticamente após a instalação
});

// Registra o serviço
servico.install();
