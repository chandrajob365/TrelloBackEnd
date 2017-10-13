const User = require('../models/Schema').User
console.log('---- User ---- ', User)
exports.findUser = (emailId, cb) => {
  User.findOne({'emailId': emailId}, (err, user) => {
    if (err) throw new Error(err)
    cb(user)
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
    if (err) throw new Error('Error in user creation')
    cb(response)
  })
}
