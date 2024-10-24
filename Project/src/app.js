const express = require('express');
const { GetUsuarios, GetUsuarioByName} = require('./usuario'); // Importa ambas as funções

const app = express();
const port = 3000;

app.use(express.json()); // Necessário para processar JSON no body

// Rota para buscar todos os clientes
app.get('/usuarios', GetUsuarios);

app.post('/usuarios/name', GetUsuarioByName)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
