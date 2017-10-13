const Trello = require('../models/Schema')

exports.getBoards = (emailId, cb) => {
  let boards = []
  Trello.User.findOne({emailId: emailId}, (err, user) => {
    if (err) throw new Error('<getBoards>Error in finding user By ID')
    user.boards.forEach(boardId => {
      Trello.Board.findOne({_id: boardId}, (err, board) => {
        if (err) throw new Error('<getBoards>Error in finding board by ID')
        boards.push(board)
      })
    })
    cb(boards)
  })
}

exports.getTasks = (boardId, cb) => {
  let tasks = []
  Trello.Board.findOne({_id: boardId}, (err, board) => {
    if (err) throw new Error('<getTasks>Error in finding board By ID')
    board.taskList.forEach(taskId => {
      Trello.Task.findOne({_id: taskId}, (err, task) => {
        if (err) throw new Error('<getTasks>Error in finding task by ID')
        tasks.push(task)
      })
    })
    cb(tasks)
  })
}

exports.getCards = (taskId, cb) => {
  let cards = []
  Trello.Task.findOne({_id: taskId}, (err, task) => {
    if (err) throw new Error('<getTasks>Error in finding board By ID')
    task.cardList.forEach(cardId => {
      Trello.Task.findOne({_id: cardId}, (err, card) => {
        if (err) throw new Error('<getTasks>Error in finding task by ID')
        cards.push(card)
      })
    })
    cb(cards)
  })
}

exports.createBoard = (userId, boardName, cb) => {
  Trello.Board.create({
    boardName: boardName,
    boardDesc: '',
    taskList: []
  }, (err, board) => {
    if (err) throw new Error('<createBoard> Error in creating new Board')
    Trello.User.findByIdAndUpdate({_id: userId},
      {$push: {boards: board._id}},
      {safe: true, upsert: true},
      (err, user) => {
        if (err) throw new Error('<createBoard> Error in inserting new BoardID in User')
        cb(user, board)
      })
  })
}

exports.createTask = (boardId, taskName, cb) => {
  Trello.Task.create({
    taskName: taskName,
    taskDesc: '',
    taskCreationDate: Date.now,
    cardList: []
  }, (err, task) => {
    if (err) throw new Error('<createTask> Error in creating new Task')
    Trello.Board.findByIdAndUpdate({_id: boardId},
      {$push: {taskList: task._id}},
      {safe: true, upsert: true},
      (err, board) => {
        if (err) throw new Error('<createTask> Error in updating Board with new taskId')
        cb(board, task)
      })
  })
}

exports.createCard = (taskId, cradName, cb) => {
  Trello.Card.create({
    cardName: String,
    cardDesc: String,
    cardDueDate: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    cardCreationDate: Date.now
  }, (err, card) => {
    if (err) throw new Error('<createCard> Error in creating new Card')
    Trello.Task.findByIdAndUpdate({_id: taskId},
      {$push: {cardList: card._id}},
      {safe: true, upsert: true},
    (err, task) => {
      if (err) throw new Error('<createCard> Error in updating Task with new CardId')
      cb(task, card)
    })
  })
}

exports.updateBoard = (boardId, boardName, cb) => {
  Trello.Board.findByIdAndUpdate({_id: boardId},
    {$set: {boardName: boardName}},
    {safe: true, upsert: true},
    (err, board) => {
      if (err) throw new Error('<updateBoard> Error in updating board')
      cb(board)
    })
}

exports.updateTask = (taskId, taskName, cb) => {
  Trello.Task.findByIdAndUpdate({_id: taskId},
    {$set: {boardName: taskName}},
    {safe: true, upsert: true},
    (err, task) => {
      if (err) throw new Error('<updateBoard> Error in updating task')
      cb(task)
    })
}

exports.updateCard = (cardId, cardDesc, cardDueDate, cb) => {
  Trello.Card.findByIdAndUpdate({_id: cardId},
    {$set: {cardDesc: cardDesc, cardDueDate: cardDueDate}},
    {safe: true, upsert: true},
    (err, card) => {
      if (err) throw new Error('<updateBoard> Error in updating Card')
      cb(card)
    })
}

exports.deleteBoard = (userId, boardId, cb) => {
  Trello.Board.findByIdAndRemove({_id: boardId}, (err, obj) => {
    if (err) throw new Error('<deleteBoard> Error in deleting board')
    Trello.User.findOneAndUpdate({_id: userId},
      {$pull: {boards: boardId}},
    (err, obj) => {
      if (err) throw new Error('<deleteBoard> Error in updating User boardList')
      cb(obj)
    })
  })
}

exports.deleteTask = (boardId, taskId, cb) => {
  Trello.Task.findByIdAndRemove({_id: taskId}, (err, obj) => {
    if (err) throw new Error('<deleteTask> Error in deleting task')
    Trello.Board.findOneAndUpdate({_id: boardId},
      {$pull: {taskList: taskId}},
    (err, obj) => {
      if (err) throw new Error('<deleteTask> Error in updating Board taskList')
      cb(obj)
    })
  })
}

exports.deleteCard = (taskId, cardId, cb) => {
  Trello.Card.findByIdAndRemove({_id: cardId}, (err, obj) => {
    if (err) throw new Error('<deleteCard> Error in deleting card')
    Trello.Task.findOneAndUpdate({_id: taskId},
      {$pull: {cardList: cardId}},
    (err, obj) => {
      if (err) throw new Error('<deleteCard> Error in updating Task cardList')
      cb(obj)
    })
  })
}
