const User = require('../users/users-model');

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

module.exports = {
  validateRegister,
  validateLogin
}

/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */