const Firebird = require('node-firebird');

// Configuração do banco de dados
const options = {
    host: 'localhost',
    port: 3050,        // Porta padrão do Firebird
    database: 'C:\\BD\\DADOS.FDB', // Caminho completo do banco de dados
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false, // Retorna as colunas em letras minúsculas
    role: null,            // Função padrão
    pageSize: 4096         // Tamanho da página do banco de dados
};

// Função para conectar ao banco de dados

function connectToDatabase(callback) {
    Firebird.attach(options, function (err, db) {
        if (err) 
            console.log(err);
            throw err;

        // db = DATABASE
      });
}

module.exports = connectToDatabase;
