const User = require('../users/users-model');

const validateUser = async (req, res, next) => {
  const user = await User.findBy({ username: req.body.username })
  if(!req.body.username || !req.body.password) {
    res.status(404).json({ message: "username and password required" })
    next()
  } else if(user) {
    res.status(404).json({ message: "username taken" })
    next()
  }

  next()
};

module.exports = {
  validateUser
}

/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */