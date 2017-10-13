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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trello')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'db connection error:'))

db.once('open', (err) => {
  if (err) {
    throw new Error('Db not connected')
  }
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000')
  })
  console.log('DB connected successfully and APP listening at: ' + process.env.PORT || 3000 + ' on ' + Date())
})

app.post('/register', login.register)
app.post('/login', login.login)
app.get('/user/:emailId', taskManager.getBoards)
app.get('/user/:emailId/board/:boardId', taskManager.getTasks) // modify this to return task with thier card (card name)
app.get('/user/:emailId/board/:boardId/tasks', taskManager.getTasks)
// app.get('/user/:emailId', taskManager.getBoards)
// app.get('/user/:emailId', taskManager.getBoards)
