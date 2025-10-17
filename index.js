const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

//endpoint para atender a uma requisição GET oi: http://localhost:3000/oi
app.get('/oi', (req, res) => {
    res.send('oi')
})

//endpoint para atender a uma requisição GET filmes: http://localhost:3000/filmes
app.get('/filmes', (req, res) => {
    res.send(filmes)
})

//inserir um filme novo na lista de filmes NA MEMÓÓÓRIA
//endpoint para inserir um filme na lista (post): http://localhost:3000/filmes
app.post('/filmes', (req, res) => {
    //montar um json com as informações
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    const filme = {titulo: titulo, sinopse: sinopse}
    //inserir o filme novo na lista
    filmes.push(filme)
    //só para ter certeza
    res.send(filmes)
})

let filmes = [
  {
    titulo: "Forrest Gump - O Contador de Histórias",
    sinopse:
      "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções.",
  },
  {
    titulo: "Um Sonho de Liberdade",
    sinopse:
      "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela",
  },
];

app.listen(3000, () => {
    console.log("server up & running");
})
