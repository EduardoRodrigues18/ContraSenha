const express = require('express');
const connectToDatabase = require('./bd');
const app = express();
const port = 3000;

app.use(express.json());

// Função para buscar todos os clientes
function GetClienteByCPF(req, res) {
    const { cpf } = req.body;

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
}

function GetClientes(req, res) {
    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT ID, NOME, TRIM(CPF) AS CPF FROM CLIENTE', (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro ao buscar clientes', details: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Nenhum cliente encontrado!' });
            }

            res.json({
                message: 'Clientes encontrados!',
                clientes: result
            });
            db.detach();
        });
    });
}

// Exporta ambas as funções
module.exports = {
    GetClienteByCPF,
    GetClientes
};
