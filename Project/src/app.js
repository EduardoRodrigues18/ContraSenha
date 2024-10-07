const express = require('express');
const connectToDatabase = require('./bd');
const app = express();
const port = 3000;

// Middleware para parsing do body
app.use(express.json());

// Rota para buscar todos os clientes
app.get('/clientes', (req, res) => {
    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT * FROM CLIENTE', (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro na consulta' });
            }

            res.json(result);
            db.detach();  // Encerra a conexão após a consulta
        });
    });
});

// Rota para adicionar um novo cliente
app.post('/clientes', (req, res) => {
    const { nome, cpf } = req.body;

    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('INSERT INTO CLIENTE (NOME, CPF) VALUES (?, ?)', [nome, cpf], (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro ao inserir cliente' });
            }

            res.json({ message: 'Cliente adicionado com sucesso!' });
            db.detach();
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
