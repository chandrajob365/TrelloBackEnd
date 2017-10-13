const Trello = require('../src/controller/trello')
exports.getBoards = (req, res) => {
  Trello.getBoards(req.param.emailId, (boards) => {
    if (boards) res.send({boards: boards})
  })
}
