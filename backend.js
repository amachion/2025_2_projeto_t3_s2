const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
  titulo: {type: String},
  sinopse: {type: String}
}))

const stringConexao = process.env.CONEXAO_DB

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

//inserir um filme novo na lista de filmes NA MEMÓÓÓRIA
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

// let filmes = [
//   {
//     titulo: "Forrest Gump - O Contador de Histórias",
//     sinopse:
//       "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções.",
//   },
//   {
//     titulo: "Um Sonho de Liberdade",
//     sinopse:
//       "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela",
//   },
// ];

app.listen(3000, () => {
  try {
    conectarAoMongoDB()
    console.log("server up & running & conexão ok")
  }
  catch (e) {
    console.log("Erro: " + e)
  }
})
