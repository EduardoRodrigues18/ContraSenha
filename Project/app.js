const express = require('express');
const cors = require('cors');
const { GetUsuarios, GetUsuario, GetUsuarioAtual} = require('./src/usuario');
const {GerarContraSenha, GerarContraSenhaID} = require('./src/gerarContraSenha'); // Importa ambas as funções
const path = require('path');

const app = express();
const port = 3090;
app.use(cors()); 

app.use(express.json()); // Necessário para processar JSON no body
app.use(express.static(__dirname));
app.use(express.static('index.html'))

// Rota para buscar todos os clientes
app.get('/usuarios', GetUsuarios);

app.post('/usuarios/nome', GetUsuario)
app.get('/gen-contra-senhaid', GerarContraSenhaID)
app.post('/gerar-contrasenha', GerarContraSenha)
app.get('/usuario-atual', GetUsuarioAtual)

app.listen(port, '192.168.0.200', () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});