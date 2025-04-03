
const express = require('express');
const connectToDatabase = require('./bd');

function GerarContraSenha(req, res) {
    const { CSH_CODIGO, USR_CRIOU, CSH_LIBERACAO, CSH_CONTRASENHA, CSH_DTHR_VALIDADE, USR_UTILIZOU } = req.body;

    if (!CSH_CODIGO) {
        return res.status(400).send('Erro: CSH_CODIGO é obrigatório e não pode ser nulo');
    }

    connectToDatabase((err, db) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = `
            UPDATE OR INSERT INTO TAB_CONTRASENHA
            (CSH_CODIGO, USR_CRIOU, CSH_LIBERACAO, CSH_CONTRASENHA, CSH_DTHR_VALIDADE, USR_UTILIZOU)
            VALUES (?, ?, ?, ?, DATEADD(? MINUTE TO CURRENT_TIMESTAMP), ?)
            MATCHING (CSH_CODIGO)
        `;

        const params = [CSH_CODIGO, USR_CRIOU, CSH_LIBERACAO, CSH_CONTRASENHA, CSH_DTHR_VALIDADE, USR_UTILIZOU];

        db.query(query, params, (err, result) => {
            db.detach();

            if (err) {
                console.error('Erro ao salvar Contra Senha:', err);
                return res.status(500).send('Erro ao salvar Contra Senha');
            }

        });
    });
}



module.exports = {GerarContraSenha}