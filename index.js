const express = require('express')
const cors = require('cors')
const BodyBuilder = require('./src/bodybuilder/bodybuilder.entity')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())

// banco de dados de clientes
var clientes = []

// banco de dados de academias
var academias = [
  { id: 1, nome: "Academia 1", telefone: "123456789" },
  { id: 2, nome: "Academia 2", telefone: "987654321" }
]

// banco de dados de estilos de treino
var estilosTreino = []

// Rotas para BodyBuilder
app.post('/body-builder', (req, res) => {
  const data = req.body // receber o bodyBuilder, que é um objeto JSON que vem do front-end

  const idAcademia = data.idAcademia
  const gym = academias.find((academia) => academia.id == idAcademia)

  let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym)

  clientes.push(bodyBuilder) // adicionar o bodyBuilder no banco de dados
  res.send("Cadastrou")
})

app.put('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      const data = req.body

      const idAcademia = data.idAcademia
      const gym = academias.find((academia) => academia.id == idAcademia)

      let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.sapato, gym)
      clientes[i] = bodyBuilder
      res.send("Atualizou")
    }
  }
  throw new Error("Body builder nao encontrado")
})

app.delete('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      clientes.splice(i, 1)
      res.send("Deletou")
    }
  }
  throw new Error("Cliente nao encontrado")
})

app.get('/body-builder', (req, res) => {
  let busca = req.query.busca
  let clientesFiltrados
  if (busca) { // se a busca for diferente de vazio
    clientesFiltrados = clientes.filter((cliente) => {
      return cliente.nome.toLowerCase().includes(busca.toLowerCase())
        || cliente.cpf.toLowerCase().includes(busca.toLowerCase())
    })
  } else {
    clientesFiltrados = clientes
  }
  res.json(clientesFiltrados)
})

// Rotas para academias
app.get("/gym", (req, res) => {
  res.json(academias)
})

// Rotas para estilos de treino
app.post('/training-style', (req, res) => {
  const data = req.body

  const estiloTreino = {
    id: estilosTreino.length + 1,
    nome: data.nome,
    descricao: data.descricao
  }

  estilosTreino.push(estiloTreino)
  res.send("Estilo de treino cadastrado")
})

app.put('/training-style/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const data = req.body

  const estiloIndex = estilosTreino.findIndex(estilo => estilo.id === id)
  if (estiloIndex !== -1) {
    estilosTreino[estiloIndex] = { id, nome: data.nome, descricao: data.descricao }
    res.send("Estilo de treino atualizado")
  } else {
    res.status(404).send("Estilo de treino nao encontrado")
  }
})

app.delete('/training-style/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const estiloIndex = estilosTreino.findIndex(estilo => estilo.id === id)
  if (estiloIndex !== -1) {
    estilosTreino.splice(estiloIndex, 1)
    res.send("Estilo de treino deletado")
  } else {
    res.status(404).send("Estilo de treino nao encontrado")
  }
})

app.get('/training-style', (req, res) => {
  res.json(estilosTreino)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
