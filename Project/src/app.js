const express = require('express');
const { GetClienteByCPF, GetClientes } = require('./cliente'); // Importa ambas as funções

const app = express();
const port = 3000;

app.use(express.json()); // Necessário para processar JSON no body

// Rota para buscar todos os clientes
app.get('/clientes', GetClientes);

// Rota para buscar cliente por CPF
app.post('/clientes/cpf', (req, res) => {
    const { cpf } = req.body; 
    if (!cpf) {
        return res.status(400).json({ error: 'CPF é obrigatório' });
    }
    GetClienteByCPF(req, res);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
