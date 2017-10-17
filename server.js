const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
const login = require('./routes/login')
const taskManager = require('./routes/taskManager')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trello', { useMongoClient: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'db connection error:'))

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port 3000')
})

app.post('/register', login.register) // working
app.post('/login', login.login) // working

app.get('/user/:emailId', taskManager.getBoards)  // working
app.get('/boards/:boardId', taskManager.getTasks)
app.get('/task/:taskId', taskManager.getCards)  // working
app.get('/cards/:cardId', taskManager.getCard)  // working
// post
app.post('/user/:emailId', taskManager.createBoard)  // working
app.post('/boards/:boardId', taskManager.createTask)  // working
app.post('/tasks/:taskId', taskManager.createCard)  // working
// Update
app.put('/boards/:boardId', taskManager.updateBoard)  // working
app.put('/tasks/:taskId', taskManager.updateTask)  // working
app.put('/cards/:cardId', taskManager.updateCard) // working
// delete
app.delete('/user/:emailId/boards/:boardId', taskManager.deleteBoard) // working
app.delete('/boards/:boardId/tasks/:taskId', taskManager.deleteTask) // working
app.delete('/tasks/:taskId/cards/:cardId', taskManager.deleteCard) // working
