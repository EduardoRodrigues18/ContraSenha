const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,        
    database: 'C:/Memoria/SisComInd/Dados/XISPONTOCOM.FDB', 
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false, 
    role: null,            
    pageSize: 4096        
};

function connectToDatabase(callback) {
    try {
        Firebird.attach(options, function (err, db) {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);  
                return callback(err);
            }
            callback(null, db);
        });
    } catch (error) {
        console.error('Erro inesperado:', error);  
        callback(error);  
    }
}

module.exports = connectToDatabase;
