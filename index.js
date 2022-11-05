const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

let users = [
  {
    id: 13429,
    nome: "Lucas",
    empresa: "Keller Williams",
    permissao: "ADMIN",
  },
  {
    id: 14564,
    nome: "Aline",
    empresa: "Keller Williams",
    permissao: "USER",
  },
  {
    id: 22314,
    nome: "Bruno",
    empresa: "Keller Williams",
    permissao: "USER",
  },
];
// DEFINA UM MIDDLEWARE QUE VERIFIQUE SE O USUÁRIO QUE ESTÁ ENVIANDO O REQUEST TEM A PERMISSÃO DE ADMINISTRADOR
async function isAdmin(req, res, next) {

  let { callerId } = req.params;

  try {

    let check = users.find(c => JSON.stringify(c.id) === callerId)

    if (check.permissao == "ADMIN") {
      next()
    } else {
      res.end("Unauthorized")
    }


  } catch {
    res.send("Something went wrong")
  }
}

// ROTAS EXECUTANDO FUNÇÕES CRUD NA ARRAY DE USUÁRIOS, ONDE SOMENTE O ADMINISTRADOR PODE CRIAR OU DELETAR UM USUÁRIO.

app.get('/users', (req, res) => {
  res.send(users)
})

app.post('/users', isAdmin, (req, res) => {

  let { id, nome, empresa, permissao } = req.body;

  const user = {
    id: id,
    nome: nome,
    empresa: empresa,
    permissao: permissao,
  }

  users.push(user)

  res.send(users)
})

app.patch('/users/:callerId', (req, res) => {

  let { callerId } = req.params
  let { id, nome, empresa, permissao } = req.body

  users.find((o, i) => {
    if (JSON.stringify(o.id) === callerId) {
        users[i] = {id: id, nome: nome, empresa: empresa, permissao: permissao };
        return true;
    } else {
      res.send("Esse id não existe")
    }
})

  res.send(users)
})

app.delete('/users/:callerId', isAdmin, (req, res) => {

  let { callerId } = req.params

  users.find((o, i) => {
    if (JSON.stringify(o.id) === callerId) {
       delete users[i]
        return true;
    } else {
      res.send("Não existe esse ID")
    }
})

  res.send(users)
})

app.listen(3000);
