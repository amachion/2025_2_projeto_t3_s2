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

async function cadastrarFilme() {
    //montar a URL
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    //pegar os inputs que o usuário digitou
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    if (titulo && sinopse) {
        //limpar as caixinhas
        tituloInput.value = ""
        sinopseInput.value = ""
        //enviar as informações para o back
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data
        //limpar a tabela e reconstruir
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        corpoTabela.innerHTML = ""
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let celulaTitulo = linha.insertCell(0)
            let celulaSinopse = linha.insertCell(1)
            celulaTitulo.innerHTML = filme.titulo
            celulaSinopse.innerHTML = filme.sinopse
        }
    }
    else { //exibir o alerta por até 2 segundos
        let alert = document.querySelector('.alert')
        alert.classList.add('show')
        alert.classList.remove('d-none')
        setTimeout (() => {
            alert.classList.remove('show')
            alert.classList.add('d-none')
        }, 2000)
    }
}