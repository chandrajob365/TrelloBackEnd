const bcrypt = require('bcrypt')
const Users = require('../src/controller/users')

exports.login = (req, res, next) => {
  if (req.body.emailId && req.body.password) {
    Users.findUser(req.body.emailId, (user) => {
      user ? validateUser(req, res, user) : res.send({msg: req.body.emailId + ' doesn\'t exist'})
    })
  }
}

const validateUser = (req, res, user) => {
  bcrypt.compare(req.body.password, user.password, (err, same) => {
    if (err) throw new Error('Error in unHashing')
    if (same) {
      console.log('user._id = ', user._id.getTimestamp())
      res.send({msg: 'User validated', user: user})
    } else res.send({msg: 'Please provide a valid pwd !!!'})
  })
}

exports.register = (req, res) => {
  Users.findUser(req.body.emailId, (user) => {
    if (user) res.send({msg: 'User with ' + req.body.emailId + ' allready exist, You can login'})
    else {
      hashPwd(req, res)
    }
  })
}

const hashPwd = (req, res) => {
  const pass = req.body.password
  bcrypt.genSalt(12, (err, salt) => {
    if (err) throw new Error('Error in salt generation')
    bcrypt.hash(pass, salt, (err, hash) => {
      if (err) throw new Error('Error in hash generation')
      const password = hash
      Users.createUser(req.body, password, salt, (result) => {
        res.send({msg: 'User is now registered'})
      })
    })
  })
}
