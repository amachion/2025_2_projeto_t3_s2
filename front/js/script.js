const protocolo = 'http://'
const baseURL = 'localhost:3000'
const filmesEndpoint = '/filmes'

async function obterFilmes () {
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    const filmes = (await axios.get(URLcompleta)).data
    //console.log(filmes)
    let tabela = document.querySelector('.filmes') //busca pelo elemento que tem a classe filmes
    let corpoTabela = tabela.getElementsByTagName('tbody')[0] //se posiciona no filho tbody
    //para cada filme no vetor de filmes, criar linha, criar colunas e adicionar o conteúdo
    for (let filme of filmes)  {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}