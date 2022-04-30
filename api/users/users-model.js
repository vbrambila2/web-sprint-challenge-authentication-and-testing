const db = require('../../data/dbConfig');

function find() {
    return db('users');
}

function findBy(filter) {
    if(filter.username === undefined) {
        return;
    } else {
        return db('users')
        .select('username', 'password')
        .where(filter)
    }
}

function findById(id) {
    return db('users')
        .where('users.id', id)
        .first()
}

async function add(user) {
    let reg_id
    const [id] = await db('users').insert(user)
    reg_id = id
    return findById(reg_id)
}

module.exports = {
    find,
    findBy,
    findById,
    add
}