// Write your tests here
const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');
const User = require('../api/users/users-model');

beforeAll(async () => {
  await db.migrate.rollback();  // npx knex migrate:rollback
  await db.migrate.latest();    // npx knex migrate:latest
});

beforeEach(async () => {
  await db('users').truncate();
  await db('users')
      .insert([
          { username: 'userone', password: '1234'},
          { username: 'usertwo', password: '4567'},
          { username: 'userthree', password: '8765'},
      ])
});

afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).toBe(true)
})

test('make sure our environment is set correctly', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

describe('database tests', () => {
  test('find', async () => {
    const result = await User.find();
    expect(result.length).toBe(3);
    expect(result[0]).toMatchObject({ username: 'userone' })
  });
  test('findBy', async () => {
    let result = await User.findBy({ username: 'userone' });
    expect(result[0].username).toBe('userone');
    result = await User.findBy({ username: 'fakeuser' });
    expect(result.length).toBe(0);

  });
  test('findById', async () => {
    let result = await User.findById(0);
    expect(result).not.toBeDefined();
    result = await User.findById(1);
    expect(result).toBeDefined();
    expect(result.username).toBe('userone');
  });
  test('add', async () => {
    let result = await User.add({ username: 'userfour', password: '1234' });
    expect(result).toHaveProperty( 'username', 'userfour' );
    expect(result.id).toBe(4);
    result = await User.find();
    expect(result.length).toBe(4);
  });
});

describe('HTTP API tests', () => {
  test('GET /api/users', async () => {
    const res = await request(server).get('/api/users')
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
  test('GET /api/users/:id', async () => {
    let res = await request(server).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, username: 'userone', password: '1234' });

    res = await request(server).get('/api/users/500');
    expect(res.body).toBe("");
  });
  test('GET /api/jokes', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401);
    expect(res.req.data).toBe(undefined);
  });
  test('POST /api/auth/register', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'newestuser', password: '7777' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty( 'username', 'newestuser' );

    res = await request(server).post('/api/auth/register').send({ password: '7777' });
    expect(res.status).toBe(404);
    expect(res.req.data).toBe(undefined);
  })
  test('POST /api/auth/login', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'userone', password: '1234' });
    expect(res.status).toBe(401);
    expect(res.req.data).toBe(undefined);

    res = await request(server).post('/api/auth/login').send({ password: '7777' });
    expect(res.status).toBe(401);
    expect(res.req.data).toBe(undefined);
  })
});
