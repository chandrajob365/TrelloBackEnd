
let task = { _id: 5,
  taskName: 'Complete Trello front end and backEnd Integration',
  taskDesc: '',
  __v: 0,
  cardList: [ 59, 58 ],
  taskCreationDate: 2017}
let cards =  [ { '59':
     { _id: 59,
       cardName: 'Build redux async',
       cardDesc: '',
       cardDueDate: 2017,
       __v: 0,
       cardCreationDate: 2017 } },
  { '58':
     { _id: 58,
       cardName: 'Work on createTask API',
       cardDesc: '',
       cardDueDate: 2017,
       __v: 0,
       cardCreationDate: 2017 } } ]
Object.assign(task, {cards: cards})
