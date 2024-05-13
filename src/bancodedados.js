const bancodedados = {

    idConta: 2,

    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },

    contas: [
        {
            "numero": 1,
            "saldo": 1000,
            "usuario": {
                "nome": "Foo Bar 1",
                "cpf": "111",
                "data_nascimento": "2021-03-15",
                "telefone": "71999998888",
                "email": "foo@bar1.com",
                "senha": "12345"
            }
        },
        {
            numero: 2,
            saldo: 0,
            usuario: {
              nome: 'Foo Bar 2',
              cpf: '222',
              data_nascimento: '2021-03-15',
              telefone: '71999998888',
              email: 'foo@bar2.com',
              senha: '12345'
            }
        },
        {
            numero: 3,
            saldo: 1000,
            usuario: {
              nome: 'Foo Bar 3',
              cpf: '333',
              data_nascimento: '2021-03-15',
              telefone: '71999998888',
              email: 'foo@bar3.com',
              senha: '12345'
            }
        },

    ],

    saques: [],

    depositos: [],

    transferencias: []
}

module.exports = bancodedados;