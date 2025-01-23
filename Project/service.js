const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'Front-ContraSenha Service',
  description: 'Serviço que inicia e mantém o app.js rodando',
  script: path.join(__dirname, 'app.js')
});

svc.on('install', () => {
  svc.start();
});

svc.install();
