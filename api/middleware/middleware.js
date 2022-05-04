const User = require('../users/users-model');

const validateBody = async (req, res, next) => {
    const user = await User.findBy({ username: req.body.username })
    if(!req.body.username || !req.body.password) {
        res.status(404).json({ message: "username and password required" })
        next()
    } else if(user.length > 0) {
      res.status(404).json({ message: "username taken" })
      next()
    }
  
    next()
  };
  
  const validateUsername = async (req, res, next) => {
    const user = await User.findBy({ username: req.body.username })
    if(!req.body.username || !req.body.password) {
      res.status(401).json({ message: "username and password required" })
      next()
    } else if(user.length === 0) {
      res.status(401).json({ message: "invalid credentials" })
      next()
    }
  
    req.user = user;
    next()
  };

  module.exports = {
    validateBody,
    validateUsername,
  }