const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario");
const criar_token = require("../utils/criartoken");
const verificar_token = require("../middleware/verificartoken");
const cfg = require("../config/cfg");

const route = express.Router();

//ENDPOINTS
route.get("/", (req,res) => {
    Usuario.find((erro, dados) => {
        if (erro)
            return res
                .status(500)
                .send({ output: `Erro ao processar dados -> ${erro}`});
        res.status(200).send({ output: "ok", payload: dados});
    });
});

//Ação 1 - cadastrar usuário
route.post("/cadastro", (req, res) => {
    //Ação 2 - criptografar a senha
    bcrypt.hash(req.body.senha, cfg.salt, (erro, result) => {
        if (erro)
            return res
                .status(500)
                .send({ output: `Erro ao tentar gerar a senha -> ${erro}`});
        //senha criptografada
        req.body.senha = result;

        const dados = new Usuario(req.body);
        dados
            //é uma promisse
            .save()
            .then((result) => {
                res.status(201).send({ output: "Cadastro realizado", payload: result});
            })
            .catch((erro) =>
                res.status(500).send({ output: `Erro ao cadastrar -> ${erro}`})
            );
    });
});

//Ação 3 - autenticar usuário
route.post("/login", (req, res) => {
    Usuario.findOne({ nomeusuario: req.body.nomeusuario }, (erro, result) => {
        if (erro)
            return res
                .status(500)
                .send({ output: `Erro ao tentar localizar -> ${erro}`});
        if (!result)
            return res.status(400).send({ output: `Usuário ou Senha não inválidos.`});
        bcrypt.compare(req.body.senha, result.senha, (erro, same) => {
            if (erro)
                return res
                    .status(500)
                    .send({ output: `Erro ao validar a senha -> ${erro}`});
            if (!same) return res.status(400).send({ output: `Usuário ou Senha inválidos.`});
            const gerar_token = criar_token(result._id, result.usuario, result.email);
            res.status(200).send({
                output: "Autenticado",
                idusuario: result._id,
                token: gerar_token,
            });
        });
    });
});

route.put("/atualizar/:id", verificar_token, (req, res) => {
    bcrypt.hash(req.body.senha, cfg.salt, (erro, result) => {
        if (erro)
            return res
                .status(500)
                .send({ output: `Erro ao tentar gerar a senha -> ${erro}`});
        //senha criptografada
        req.body.senha = result;
        Usuario.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true },
            (erro, dados) => {
                if (erro)
                    return res
                        .status(500)
                        .send({ outuput: `Erro ao processar a atualização -> ${erro}`});
                if (!dados)
                    return res
                        .status(400)
                        .send({ output: `Não foi possível atualizar -> ${erro}`});
                return res.status(202).send({ output: "Atualizado", payload: dados});
            }
        );
    });
    
});

route.delete("/apagar/:id", verificar_token, (req, res) => {
    Usuario.findByIdAndDelete(req.params.id, (erro, dados) => {
        if (erro)
            return res
                .status(500)
                .send({ output: `Erro ao tentar apagar -> ${erro}`});
        res.status(204).send({});
    });
});

module.exports = route;