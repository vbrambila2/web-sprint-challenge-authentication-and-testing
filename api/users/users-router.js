const router = require("express").Router();
const User = require('./users-model');

router.get('/', (req, res, next) => {
    User.find()
        .then(user => {
            res.json(user);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

module.exports = router;