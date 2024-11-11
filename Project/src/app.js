const express = require('express');
const cors = require('cors');
const { GetUsuarios, GetUsuario: GetUsuarioByName, GetUsuario} = require('./usuario');
const {GerarContraSenha} = require('./gerarContraSenha'); // Importa ambas as funções


const app = express();
const port = 3000;

app.use(cors()); 

app.use(express.json()); // Necessário para processar JSON no body

// Rota para buscar todos os clientes
app.get('/usuarios', GetUsuarios);

app.post('/usuarios/nome', GetUsuario)

app.post('/gerar-contrasenha', GerarContraSenha)

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});