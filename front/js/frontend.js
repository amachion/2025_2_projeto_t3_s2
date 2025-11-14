const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function obterFilmes () {
    const filmesEndpoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    const filmes = (await axios.get(URLcompleta)).data
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
    const filmesEndpoint = '/filmes'
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
        exibirAlerta('.alert-filme', "Filme cadastrado com sucesso!!!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
    }
    else { //exibir o alerta por até 2 segundos
        exibirAlerta('.alert-filme', "Preencha todos os Campos!!!", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}
async function cadastrarUsuario() {
    //posicionar nas caixinhas de input
    let usuarioCadastroInput = document.querySelector("#usuarioCadastroInput")
    let passwordCadastroInput = document.querySelector("#passwordCadastroInput")
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = "/signup"
            const URLcompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            await axios.post(URLcompleta, 
                             {login: usuarioCadastro, password: passwordCadastro}
            )
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""

            exibirAlerta (".alert-modal-cadastro", "Usuário cadastrado com sucesso!!!", 
            ["show", "alert-success"], ["d-none", "alert-danger"], 2000)
            esconderModal('#modalCadastro', 2000)
        }
        catch (erro) {
            exibirAlerta (".alert-modal-cadastro", "Usuário não pode ser cadastrado!!!",
            ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
            esconderModal ('#modalCadastro', 2000)
        }
    }    
    else {
        exibirAlerta (".alert-modal-cadastro", "Preencha todos os campos!!!",
        ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}

function exibirAlerta (seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.add('d-none')
        alert.classList.remove('show')
    }, timeout)
}

function esconderModal (seletor, timeout) {
    setTimeout (() => {
        let modalCadastro = 
            bootstrap.Modal.getInstance(document.querySelector(seletor))
            modalCadastro.hide()
    }, timeout)
}

const fazerLogin = async () => {
    //se posicionar nos inputs
    let usuarioLoginInput = document.querySelector("#usuarioLoginInput")
    let passwordLoginInput = document.querySelector("#passwordLoginInput")
    //capturar o que o usuário digitou
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            //montar a URL completa
            const loginEndpoint = '/login'
            const URLcompleta = `${protocolo}${baseURL}${loginEndpoint}`
            //envia a requisição
            const response = await axios.post (URLcompleta, {login: usuarioLogin, password: passwordLogin})
            //console.log (response.data)
            //limpa as caixinhas
            //armazenar o token devolvido pelo back no localStorage do navegador
            const token = response.data.token
            localStorage.setItem('tokenFilmes', token)
            //opcionalmente armazenar  usuário
            localStorage.setItem('usuarioFilmes', usuarioLogin)
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibirAlerta ('.alert-modal-login', 'Login realizado com sucesso!!!', ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            esconderModal ('#modalLogin', 2000)
            //altera o status do botão de cadastrar filme
            const cadastrarFilmeButton = document.querySelector("#cadastrarFilmeButton")
            cadastrarFilmeButton.disabled = false
            //altera o texto do link de login
            const loginLink = document.querySelector("#loginLink")
            loginLink.innerHTML = 'Logout'
        }
        catch (error) {
            exibirAlerta ('.alert-modal-login', 'Falha no login!!!', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
        }
    }
    else {
        exibirAlerta ('.alert-modal-login', 'Preencha todos os campos!!!', ['show', 'alert-danger'],
            ['d-none', 'alert-success'], 2000)
    }
}
function atualizaEstadoLogin() {
    const loginLink = document.querySelector("#loginLink")
    const cadastrarFilmeButton = document.querySelector("#cadastrarFilmeButton")
    const token = localStorage.getItem('tokenFilmes')
    if (token) {
        cadastrarFilmeButton.disabled = false
        loginLink.innerHTML = 'Logout'
    }
    else {
        cadastrarFilmeButton.disabled = true
        loginLink.innerHTML = 'Login'
    }
}
function fazerLogout () {
    //limpar o localStorage
    localStorage.removeItem('tokenFilmes')
    localStorage.removeItem('usuarioFilmes')
    //desabilitar o botão de cadastro de filmes
    let cadastrarFilmeButton = document.querySelector("#cadastrarFilmeButton")
    cadastrarFilmeButton.disabled = true
    //mudar o texto do navlink 
    let loginLink = document.querySelector("#loginLink")
    loginLink.innerHTML = "Login"
    exibirAlerta ('.alert-logout', 'Obrigado, volte sempre!!!', ['show', 'alert-success'], ['d-none'], 2000)
}

function loginOuLogout () {
    const loginLink = document.querySelector("#loginLink")
    if (loginLink.innerHTML === 'Login') {
        const modal = new bootstrap.Modal("#modalLogin")
        modal.show()
    }
    else {
        fazerLogout()
    }
}