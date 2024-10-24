const express = require('express');
const connectToDatabase = require('./bd');
const app = express();
const port = 3000;

let usuario = null;
app.use(express.json());

function setUsuario(valor) {
    usuario = valor;
}

function getUsuario() {
    return usuario;
}

// Função para buscar todos os clientes
function GetUsuarios(req, res) {
    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT * FROM TAB_USUARIO', (err, result) => {
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
function GetUsuarioByName(req, res) {
    const { USR_NOME } = req.body;

    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT * FROM TAB_USUARIO WHERE USR_LOGIN = ?', [USR_NOME], (err, result) => {
            if (err) {
                db.detach(); // Libera a conexão com o banco de dados
                return res.status(500).json({ error: 'Erro ao encontrar usuário', details: err.message });
            }

            if (result.length === 0) {
                db.detach(); // Libera a conexão com o banco de dados
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            setUsuario(result[0])
            console.log('Usuário encontrado:', usuario);

            res.json({
                message: 'Usuário encontrado!',
                cliente: usuario 
            });

            db.detach();
        });
    });
}



// Exporta ambas as funções
module.exports = {
    GetUsuarios,
    GetUsuarioByName,
    setUsuario,
    getUsuario
};

