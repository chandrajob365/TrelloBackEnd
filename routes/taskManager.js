const Trello = require('../src/controller/trello')

exports.getBoards = (req, res) => {
  Trello.getBoards(req.params.emailId, (boards, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({boards: boards})
  })
}

exports.getTasks = (req, res) => {
  console.log('<getTasks> req.params.boardId = ', req.params.boardId)
  Trello.getTasks(req.params.boardId, (tasks, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({tasks: tasks})
  })
}

exports.getCards = (req, res) => {
  console.log('<getCards> req.params.taskId = ', req.params.taskId)
  Trello.getCards(req.params.taskId, (cards, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({cards: cards})
  })
}
exports.getCard = (req, res) => {
  Trello.getCard(req.params.cardId, (card, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({card: card})
  })
}

exports.createBoard = (req, res) => {
  console.log('req.params.emailId = ', req.params.emailId)
  Trello.createBoard(req.params.emailId, req.body.boardName, (board, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'new board created', board: board})
  })
}

exports.createTask = (req, res) => {
  console.log('<createTask > req.params.boardId = ', req.params.boardId, ' req.body.taskName= ', req.body.taskName)
  Trello.createTask(req.params.boardId, req.body.taskName, (task, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'new task created', task: task})
  })
}

exports.createCard = (req, res) => {
  console.log('<createCard > req.params.taskId = ', req.params.taskId, ' req.body.cardName= ', req.body.cardName)
  Trello.createCard(req.params.taskId, req.body.cardName, (card, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'new Card created', card: card})
  })
}

exports.updateBoard = (req, res) => {
  Trello.updateBoard(req.params.boardId, req.body.boardName, (board, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Board updated'})
  })
}

exports.updateTask = (req, res) => {
  Trello.updateTask(req.params.taskId, req.body.taskName, (task, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Task updated'})
  })
}

exports.updateCard = (req, res) => {
  Trello.updateCard(req.params.cardId, req.body.cardDesc, req.body.cardDueDate, (card, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Card updated'})
  })
}

exports.deleteBoard = (req, res) => {
  console.log('<deleteBoard> req.params.emailId = ', req.params.emailId, '  req.params.boardId = ', req.params.boardId)
  Trello.deleteBoard(req.params.emailId, req.params.boardId, (result, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Board deleted'})
  })
}

exports.deleteTask = (req, res) => {
  Trello.deleteTask(req.params.boardId, req.params.taskId, (result, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Task deleted'})
  })
}

exports.deleteCard = (req, res) => {
  Trello.deleteCard(req.params.taskId, req.params.cardId, (result, error) => {
    if (error) return res.send({msg: error.msg})
    res.send({msg: 'Card deleted'})
  })
}
