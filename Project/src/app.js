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
            console.error('Erro na conexão com o banco de dados:', err);
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados', details: err.message });
        }

        db.query('SELECT ID, NOME, TRIM(CPF) AS CPF FROM CLIENTE;', (err, result) => {
            if (err) {
                console.error('Erro ao realizar consulta ao banco de dados:', err);
                db.detach();
                return res.status(500).json({ error: 'Erro na consulta', details: err.message });
            }

            res.json(result);
            db.detach();  // Encerra a conexão após a consulta
        });
    });
});


// ROTA PARA PROCURAR UM CLIENTE POR CPF
app.post('/clientes', (req, res) => {
    const { nome, cpf } = req.body;

    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT ID, NOME, TRIM(CPF) AS CPF FROM CLIENTE WHERE CPF = ?', [cpf], (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro ao encontrar cliente', details: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado!' });
            }

            res.json({
                message: 'Cliente encontrado!',
                cliente: result
            });
            db.detach();
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
