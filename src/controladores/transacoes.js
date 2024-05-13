let { contas, saques, depositos, transferencias } = require("../bancodedados");
/*
Depositar
POST /transacoes/depositar
*/
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({
            "mensagem": "O número da conta e o valor são obrigatórios!"
        });
    }

    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor depositado deve ser positivo!"
        });
    }
    else {
        const conta = contas.find((conta) => {
            return conta.numero === Number(numero_conta);
        });

        conta.saldo += Number(valor);
        depositos.push({
            data: new Date(),
            numero_conta,
            valor
        });
    }


    return res.status(204).send();

}

/*
Sacar
POST /transacoes/sacar
*/
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta, valor e senha são obrigatórios!"
        });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida!" });
    }
    else {
        if (conta.saldo < valor) {
            return res.status(403).json({ "mensagem": "Saldo insuficiente!" });
        }
        else {
            conta.saldo -= Number(valor);
            saques.push({
                data: new Date(),
                numero_conta,
                valor
            });
        }
    }

    return res.status(204).send();
}

/*
Tranferir
POST /transacoes/transferir
*/
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "Todos os campos são obrigatórios!"
        });
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    })

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    })

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada." });
    }
    if (!contaDestino) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada." });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida!" });
    }
    else {
        if (contaOrigem.saldo < valor) {
            return res.status(403).json({ "mensagem": "Saldo insuficiente!" });
        }
        else {
            contaOrigem.saldo -= Number(valor);
            contaDestino.saldo += Number(valor);
            transferencias.push({
                data: new Date(),
                numero_conta_origem,
                numero_conta_destino,
                valor
            });
        }
    }
    return res.status(204).send();

}

module.exports = {
    depositar,
    sacar,
    transferir
};