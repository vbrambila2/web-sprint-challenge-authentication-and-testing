const User = require('../users/users-model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets'); 

const validateRegister = async (req, res, next) => {
  const [user] = await User.findBy({ username: req.body.username })
  if(!req.body.username || !req.body.password) {
      res.status(404).json({ message: "username and password required" })
      next()
  } else if(user) {
    res.status(404).json({ message: "username taken" })
    next()
  }

  next()
};

const validateLogin = async (req, res, next) => {
  const user = await User.findBy({ username: req.body.username })
  console.log(user, "user")
  if(!req.body.username || !req.body.password) {
    console.log("missing")
    res.status(404).json({ message: "username and password required" })
    next()
  } else if(user.length === 0) {
    console.log("not")
    res.status(404).json({ message: "invalid credentials" })
    next()
  }
  console.log("end")
  req.user = user;
  next()
};

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token, "token")
  if(!token) {
    res.status(401).json({ message: "token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if(err) {
      console.log(decodedToken, "dec")
      res.status(401).json({ message: "token invalid"  })
    } else {
      console.log(decodedToken, "dec")
      req.decodedToken = decodedToken
      next()
    }
  })
}

module.exports = {
  validateRegister,
  validateLogin,
  restricted
}

/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */