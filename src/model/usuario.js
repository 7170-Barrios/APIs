const mongoose = require("mongoose");

const SchemaUsers = new mongoose.Schema({
    nomeusuario:{ type: String,required:true, unique:true},
    email:{ type: String, required:true, unique:true},
    senha:{ type: String, required:true},
    nomecompleto:String,
    telefone:String,
    datacadastro:{ type: Date, default: Date.now}
});
module.exports = mongoose.model("usuario", SchemaUsers);