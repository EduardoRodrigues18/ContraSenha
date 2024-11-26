const connectToDatabase = require('./bd');

let usuario = null;
let usuarios = null;



function setUsuario(valor) {
    usuario = valor;
}

function getUsuario() {
    return usuario;
}
function setUsuarios(valor) {
    usuarios = valor;
}

function getUsuarios() {
    return usuarios;
}

function GetUsuarios(req, res) {
    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT USR_CODIGO, USR_LOGIN FROM TAB_USUARIO', (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro ao buscar clientes', details: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Nenhum cliente encontrado!' });
            }
            setUsuarios(result)
            console.log(usuarios)
            res.json({
                message: 'Clientes encontrados!',
                clientes: result
            });
            db.detach();
        });
    });
}


function GetUsuario(req, res) {
    const { USR_LOGIN, USR_SENHA } = req.body;

    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
        }

        db.query('SELECT USR_CODIGO FROM TAB_USUARIO WHERE USR_LOGIN = ? AND USR_SENHA = ?', [USR_LOGIN, USR_SENHA], (err, result) => {
            if (err) {
                db.detach();
                return res.status(500).json({ error: 'Erro ao encontrar usuário', details: err.message });
            }

            if (result.length === 0) {
                db.detach(); 
                return res.status(404).json({ message: 'Usuário ou senha incorretos' });
            }

            const usuario = result[0];
            console.log('Usuário encontrado:', usuario);
            console.log(usuario.USR_CODIGO)
            setUsuario(usuario.USR_CODIGO)

            res.json({
                message: 'Usuário encontrado!',
                cliente: usuario 
            });

            db.detach(); 
        });
    });
}
function GetUsuarioAtual(req, res) {
    const usuarioAtual = getUsuario(); // Obtém o valor globalmente armazenado.

    if (!usuarioAtual) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado!' });
    }

    res.json({ usuario: usuarioAtual });
}





// Exporta ambas as funções
module.exports = {
    GetUsuarios,
    GetUsuario,
    GetUsuarioAtual,
    setUsuario,
    getUsuario
};

