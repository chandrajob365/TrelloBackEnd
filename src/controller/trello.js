var mongoose = require('mongoose')
const Trello = require('../models/Schema')

exports.getBoards = (emailId, cb) => {
  Trello.User.findOne({emailId: emailId}, (error, user) => {
    if (error) return cb(null, {msg: '<Fn: getBoards> Internal DB Error ' + error})
    if (!user) return cb(null, {msg: 'User Not found'})
    // Empty Promise List
    let PromiseList = []
    user.boards.forEach(boardId => {
      // create a promise and add that promise to earlier created promise list
      let p = new Promise((resolve, reject) => {
        Trello.Board.findById(new mongoose.Types.ObjectId(boardId), (err, board) => {
          // resolve or reject the promise
          if (err) reject(Error('<Fn: getBoards> Error in finding board by ID'))
          resolve(board)
        })
      })
      PromiseList.push(p)
    })
    // Promise.all (of above created promise list)
    Promise.all(PromiseList).then((boards) => {
      return cb(boards, null)
    })
    .catch((error) => {
      return cb(null, {msg: 'Some Promise error  ', error})
    })
  })
}

exports.getTasks = (boardId, cb) => {
  Trello.Board.findById(new mongoose.Types.ObjectId(boardId), (error, board) => {
    if (error) return cb(null, {msg: '<Fn: getTasks> Internal DB error', error})
    if (!board) return cb(null, {msg: 'Board Not found'})
    let tasksPromiseList = []
    board.taskList.forEach(taskId => {
      let pTask = new Promise((resolve, reject) => {
        getTask(taskId, (task) => {
          if (error) reject(Error('<Fn: getTask> Internal DB error'))// return cb(null, {msg: '<Fn: getTask> Internal DB error', error})
          if (!task) reject(Error('<Fn: getTask> Task Not found'))// return cb(null, {msg: 'Task Not found'})
          let cardsPromiseList = []
          task.cardList.forEach(cardId => {
            let pCard = new Promise((resolve, reject) => {
              getCard(cardId, (card, error) => {
                if (error) reject(Error('<Fn: getCard> Internal DB error'))// return cb(null, {msg: '<Fn: getCard> Internal DB error', error})
                if (!task) reject(Error('Card Not found')) // return cb(null, {msg: 'Card Not found'})
                resolve({[cardId]: card})
              })
            })
            cardsPromiseList.push(pCard)
          })
          Promise.all(cardsPromiseList).then((cards) => {
            console.log('Cards = ', cards)
            console.log('## task = ', Object.assign(task, {notCards: cards}))
            resolve(task) // -- not working but correct
            // resolve(task['cards'] = cards)  // -- working but not correct
          })
        })
      })
      tasksPromiseList.push(pTask)
    })
    Promise.all(tasksPromiseList).then((tasks) => {
      console.log('Tasks = ', tasks)
      return cb(tasks, null)
    })
    .catch(error => {
      return cb(null, {msg: 'Promise Error : ' + error})
    })
  })
}

const getTask = (taskId, cb) => {
  Trello.Task.findOne({_id: taskId}, (error, task) => {
    cb(task, error)
  })
}

const getCard = (cardId, cb) => {
  Trello.Card.findOne({_id: cardId}, (error, card) => {
    cb(card, error)
  })
}

exports.getCards = (taskId, cb) => {
  console.log('<getCards> taskId = ', taskId)
  getTask(taskId, (task, error) => {
    if (error) return cb(null, {msg: '<Fn: getTask> Internal DB error', error})
    if (!task) return cb(null, {msg: 'Task Not found'})
    let promiseList = []
    task.cardList.forEach(cardId => {
      let cardPromise = new Promise((resolve, reject) => {
        getCard(cardId, (card, error) => {
          if (error) reject(Error({msg: '<Fn: getCard> Internal DB error', error}))
          if (!card) reject(Error({msg: 'Card Not found'}))
          resolve(card)
        })
      })
      promiseList.push(cardPromise)
    })
    Promise.all(promiseList)
      .then(cards => {
        return cb(cards, null)
      })
      .catch(error => {
        return cb(null, {msg: 'Promise Error : ' + error})
      })
  })
}

exports.createBoard = (emailId, boardName, cb) => {
  console.log('<trello.js, createBoard> emailId = ', emailId, '  boardName = ', boardName)
  Trello.Board.create({
    boardName: boardName,
    boardDesc: '',
    taskList: []
  }, (err, board) => {
    if (err) return cb(null, {msg: '<createBoard> Error in creating new Board', err})
    Trello.User.update({emailId: emailId},
      {$push: {boards: board._id}},
      {upsert: true, new: true},
      (err, user) => {
        if (err) return cb(null, {msg: '<createBoard> Error in inserting new BoardID in User', err})
        cb(board, null)
      })
  })
}

exports.createTask = (boardId, taskName, cb) => {
  console.log('<trello.js, createBoard> boardId = ', boardId, '  taskName = ', taskName)
  Trello.Task.create({
    taskName: taskName,
    taskDesc: '',
    taskCreationDate: new Date().toLocaleDateString(),
    cardList: []
  }, (err, task) => {
    if (err) return cb(null, {msg: '<createTask> Error in creating new Task', err})
    Trello.Board.update({_id: boardId},
      {$push: {taskList: task._id}},
      {upsert: true, new: true},
      (err, board) => {
        if (err) return cb(null, {msg: '<createTask> Error in updating Board with new taskId', err})
        cb(task, err)
      })
  })
}

exports.createCard = (taskId, cardName, cb) => {
  console.log('<trello.js, createBoard> taskId = ', taskId, '  cardName = ', cardName)
  Trello.Card.create({
    cardName: cardName,
    cardDesc: '',
    cardDueDate: new Date(new Date() + (7 * 24 * 60 * 60 * 1000)),
    cardCreationDate: new Date()
  }, (err, card) => {
    if (err) return cb(null, {msg: '<createCard> Error in creating new Card', err})
    Trello.Task.update({_id: taskId},
      {$push: {cardList: card._id}},
      {upsert: true, new: true},
    (err, task) => {
      if (err) return cb(null, {msg: '<createCard> Error in updating Task with new CardId', err})
      cb(card, err)
    })
  })
}

exports.updateBoard = (boardId, boardName, cb) => {
  Trello.Board.findByIdAndUpdate({_id: boardId},
    {$set: {boardName: boardName}},
    {safe: true, upsert: true},
    (err, board) => {
      if (err) return cb(null, {msg: '<updateBoard> Error in updating board', err})
      cb(board, null)
    })
}

exports.updateTask = (taskId, taskName, cb) => {
  Trello.Task.findByIdAndUpdate({_id: taskId},
    {$set: {taskName: taskName}},
    {safe: true, upsert: true},
    (err, task) => {
      if (err) return cb(null, {msg: '<updateTask> Error in updating task', err})
      cb(task, err)
    })
}

exports.updateCard = (cardId, cardDesc, cardDueDate, cb) => {
  Trello.Card.findByIdAndUpdate({_id: cardId},
    {$set: {cardDesc: cardDesc, cardDueDate: cardDueDate}},
    {safe: true, upsert: true},
    (err, card) => {
      if (err) return cb(null, {msg: '<updateCard> Error in updating Card', err})
      cb(card, err)
    })
}

exports.deleteBoard = (emailId, boardId, cb) => {
  Trello.Board.findByIdAndRemove({_id: boardId}, (err, obj) => {
    if (err) return cb(null, {msg: '<deleteBoard> Error in deleting board', err})
    Trello.User.findOneAndUpdate({emailId: emailId},
      {$pull: {boards: boardId}},
    (err, obj) => {
      if (err) return cb(null, {msg: '<deleteBoard> Error in updating User boardList', err})
      cb(obj, null)
    })
  })
}

exports.deleteTask = (boardId, taskId, cb) => {
  Trello.Task.findByIdAndRemove({_id: taskId}, (err, obj) => {
    if (err) return cb(null, {msg: '<deleteTask> Error in deleting task', err})
    Trello.Board.findOneAndUpdate({_id: boardId},
      {$pull: {taskList: taskId}},
    (err, obj) => {
      if (err) return cb(null, {msg: '<deleteTask> Error in updating Board taskList', err})
      cb(obj, null)
    })
  })
}

exports.deleteCard = (taskId, cardId, cb) => {
  Trello.Card.findByIdAndRemove({_id: cardId}, (err, obj) => {
    if (err) return cb(null, {msg: '<deleteCard> Error in deleting card', err})
    Trello.Task.findOneAndUpdate({_id: taskId},
      {$pull: {cardList: cardId}},
    (err, obj) => {
      if (err) return cb(null, {msg: '<deleteCard> Error in updating Task cardList', err})
      cb(obj, null)
    })
  })
}

exports.getCard = getCard
