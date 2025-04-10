
const express = require('express');
const connectToDatabase = require('./bd');
const app = express();
const port = 3000;


function GerarContraSenhaID(req, res){
    connectToDatabase((err, db)=>{
        if(err){
            console.error('Erro ao conectar ao banco de dados:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = `SELECT GEN_ID( id_contrasenha ,1) as ID from RDB$GENERATORS where upper(RDB$GENERATOR_NAME)=upper('id_contrasenha')`

        db.query(query, (err, result) => {
            db.detach();
            if (err) {
                console.error('Erro ao salvar Contra Senha:', err);
                return res.status(500).send('Erro ao salvar Contra Senha');
            }
            if (result && result.length > 0) {
                const id = result[0].ID;
                console.log('ID gerado:', id);
                return res.status(200).json({ id });
            } else {
                return res.status(500).send('Nenhum resultado retornado da geração de ID');
            }
            
        });
        
    })
}
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
            (CSH_CODIGO, USR_CRIOU, CSH_LIBERACAO, CSH_CONTRASENHA, CSH_DTHR_VALIDADE, USR_UTILIZOU, CSH_DTHR_CRIADO)
            VALUES (?, ?, ?, ?, DATEADD(? MINUTE TO CURRENT_TIMESTAMP), ?, CURRENT_TIMESTAMP)
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



module.exports = {GerarContraSenha, GerarContraSenhaID}