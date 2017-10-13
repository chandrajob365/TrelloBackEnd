const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  salt: String,
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'board'
    }
  ]
})

const boardSchema = new Schema({
  boardName: String,
  boardDesc: String,
  taskList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }
  ]
})

const taskSchema = new Schema({
  taskName: String,
  taskDesc: String,
  taskCreationDate: { type: Date, default: Date.now },
  cardList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'card'
    }
  ]
})

const cardSchema = new Schema({
  cardName: String,
  cardDesc: String,
  cardDueDate: {type: Date},
  cardCreationDate: { type: Date, default: Date.now }
})

exports.User = mongoose.model('user', userSchema)
exports.Board = mongoose.model('board', boardSchema)
exports.Task = mongoose.model('task', taskSchema)
exports.Card = mongoose.model('card', cardSchema)
