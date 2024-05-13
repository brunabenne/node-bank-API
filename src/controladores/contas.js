let { contas, idConta, depositos, transferencias, saques } = require("../bancodedados");
/*
Listar contas bancárias
GET /contas?senha_banco=Cubos123Bank
*/
const listarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "A senha do banco precisa ser informada!" });
    }

    if (senha_banco !== "Cubos123Bank") {
        return res.status(400).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    return res.status(200).json(contas);
}

/*
Criar conta bancária
POST /contas
*/
const criarConta = (req, res) => {

    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    const conta = {
        numero: idConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(conta);

    return res.status(201).send();
};

/*
Atualizar usuário da conta bancária
PUT /contas/:numeroConta/usuario
*/
const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    const { usuario } = conta;

    if (email !== usuario.email || cpf !== usuario.cpf) {
        const contaComCpfDuplicado = contas.find((conta) => conta.usuario.cpf === cpf);
        const contaComEmailDuplicado = contas.find((conta) => conta.usuario.email === email);

        if (contaComCpfDuplicado && contaComEmailDuplicado) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o CPF e o e-mail informados!" });
        } else if (contaComCpfDuplicado) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado!" });
        } else if (contaComEmailDuplicado) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
        }
    }

    usuario.cpf = cpf;
    usuario.email = email;
    usuario.nome = nome;
    usuario.data_nascimento = data_nascimento;
    usuario.telefone = telefone;
    usuario.senha = senha;

    return res.status(204).send();

}



/*
Excluir Conta
DELETE /contas/:numeroConta
*/
const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    if (conta.saldo === 0) {
        contas = contas.filter((conta) => {
            return conta.numero !== Number(numeroConta);
        })
    }
    else {
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    }


    return res.status(204).send();
}

/*
Saldo
GET /contas/saldo?numero_conta=123&senha=123
*/
const verSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta e senha são obrigatórios!"
        });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }
    else {
        return res.status(200).json({ "saldo": `${conta.saldo}` })
    }
}

/*
Extrato
GET /contas/extrato?numero_conta=123&senha=123
*/
const verExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta e senha são obrigatórios!"
        });
    }
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }
    else {
        const depositosDaConta = depositos.filter((deposito) => {
            return deposito.numero_conta === numero_conta;
        })
        const saquesDaConta = saques.filter((saque) => {
            return saque.numero_conta === numero_conta;
        })
        const transferenciasEnviadas = transferencias.filter((transferenciaEnviada) => {
            return transferenciaEnviada.numero_conta_origem === numero_conta;
        })
        const transferenciasRecebidas = transferencias.filter((transferenciaRecebida) => {
            return transferenciaRecebida.numero_conta_destino === numero_conta;
        })

        return res.status(200).json({
            depositos: depositosDaConta,
            saques: saquesDaConta,
            transferenciasEnviadas: transferenciasEnviadas,
            transferenciasRecebidas: transferenciasRecebidas
        })
    }
}


module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarConta,
    verSaldo,
    verExtrato
};