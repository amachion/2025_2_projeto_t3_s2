const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

const stringConexao = process.env.CONEXAO_BD

async function conectarAoMongoDB () {
  await mongoose.connect(stringConexao)
}

//endpoint para atender a uma requisição GET oi: http://localhost:3000/oi
app.get('/oi', (req, res) => {
    res.send('oi')
})

//endpoint para atender a uma requisição GET filmes: http://localhost:3000/filmes
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

//endpoint para inserir um filme na lista (post): http://localhost:3000/filmes
app.post('/filmes', async (req, res) => {
    //montar um json com as informações
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //o objeto filme é da classe Filme (modelo mongoose)
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    //salvar o filme lá no banco
    await filme.save()
    //obter a lista de filmes atualizada do banco
    const filmes = await Filme.find()
    //devolve a lista de filmes atualizada para o front
    res.json(filmes)
})

//endpoint para o cadastro de usuários
app.post('/signup', async (req, res) => {
  try{
    //captura o que o usuário digitou
    const login = req.body.login
    const password = req.body.password
    //criptografar a senha
    const passwordCriptografada = await bcrypt.hash(password, 10)
    //constroi um objeto usuário de acordo com o modelo
    const usuario = new Usuario({
      login: login,
      password: passwordCriptografada
    })
    const respostaMongo = await usuario.save()
    console.log(respostaMongo);
    res.status(201).end()
  }
  catch (exception) {
    console.log(exception);
    res.status(409).end()
  }
})

app.listen(3000, () => {
  try {
    conectarAoMongoDB()
    console.log("server up & running & conexão ok")
  }
  catch (e) {
    console.log("Erro: " + e)
  }
})
