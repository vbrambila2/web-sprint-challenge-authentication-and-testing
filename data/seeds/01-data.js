exports.seed = async function(knex) {
  await knex('users').insert([
    { username: 'userone', password: '1234' },
    { username: 'usertwo', password: '4567' },
    { username: 'userthree', password: '8765' }
  ])
};
