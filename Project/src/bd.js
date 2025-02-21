const fs = require('fs');
const path = require('path');
const ini = require('ini');
const Firebird = require('node-firebird');

// Caminho para o arquivo de configuração
const configPath = path.join(__dirname, '../CONFIG.ini');

// Carrega e processa o arquivo ini
const configContent = fs.readFileSync(configPath, 'utf-8');
const config = ini.parse(configContent);

// Configurações do banco de dados
const options = {
    host: config.database.host,
    port: parseInt(config.database.port, 10),
    database: config.database.database.replace(/\\/g, '/'), // Normaliza o caminho do banco
    user: config.database.user,
    password: config.database.password,
    lowercase_keys: false,
    role: null,
    pageSize: parseInt(config.database.pageSize, 10),
    poolSize: 5 // Adiciona um pool de conexões para melhor performance
};

// Criando um pool de conexões
const pool = Firebird.pool(5, options);

function connectToDatabase(callback) {
    pool.get((err, db) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return callback(err);
        }

        callback(null, db);
    });
}

module.exports = connectToDatabase;
