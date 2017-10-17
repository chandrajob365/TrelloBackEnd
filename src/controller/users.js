const User = require('../models/Schema').User
console.log('---- User ---- ', User)
exports.findUser = (emailId, cb) => {
  User.findOne({'emailId': emailId}, (err, user) => {
    if (err) return cb(null, {msg: err})
    cb(user, null)
  })
}

exports.createUser = (user, pwd, salt, cb) => {
  User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId,
    password: pwd,
    salt: salt
  }, (err, response) => {
    if (err) return cb(null, {msg: 'Error in user creation', err})
    cb(response, null)
  })
}
