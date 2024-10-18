const connectToDatabase = require('./bd');
const ApiError = require('../exceptions/ApiError');


app.use(express.json());

exports.getAllClients = async () => {
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
            db.detach();  
        });
    });
}


exports.insertClient = async (nome, cpf) => {
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
}


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
