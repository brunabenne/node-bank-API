const { contas } = require("./bancodedados");

const validarDadosObrigatorios = (req, res, next) => {
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    next();
}

const validarDadosUnicos = (req, res, next) => {
    const { cpf, email } = req.body;

    const cpfDuplicado = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    })

    const emailDuplicado = contas.find((conta) => {
        return conta.usuario.email === email;
    })

    if (cpfDuplicado && emailDuplicado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF e o e-mail informados!" });
    } else if (cpfDuplicado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado!" });
    } else if (emailDuplicado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    next();
}

const verificarContaExiste = (req, res, next) => {
    const { numeroConta } = req.params;
    const { numero_conta } = req.body;

    const conta = contas.find((conta) => {

        if (numeroConta) {
            return conta.numero === Number(numeroConta);
        }
        if (numero_conta) {
            return conta.numero === Number(numero_conta);
        }
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    next();
}

module.exports = {
    validarDadosObrigatorios,
    validarDadosUnicos,
    verificarContaExiste
}