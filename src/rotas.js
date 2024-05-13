const express = require("express");
const contas = require("./controladores/contas");
const transacoes = require("./controladores/transacoes");
const { validarDadosObrigatorios, validarDadosUnicos, verificarContaExiste } = require("./intermediarios")

const rotas = express();


rotas.get("/contas", contas.listarContas);
rotas.post("/contas", validarDadosObrigatorios, validarDadosUnicos, contas.criarConta)
rotas.put("/contas/:numeroConta/usuario", validarDadosObrigatorios, verificarContaExiste, contas.atualizarUsuario)
rotas.delete("/contas/:numeroConta", verificarContaExiste, contas.deletarConta);

rotas.post("/transacoes/depositar", verificarContaExiste, transacoes.depositar)
rotas.post("/transacoes/sacar", verificarContaExiste, transacoes.sacar)
rotas.post("/transacoes/transferir", transacoes.transferir)

rotas.get("/contas/saldo", contas.verSaldo)
rotas.get("/contas/extrato", contas.verExtrato)

module.exports = rotas;