const pgp = require('pg-promise')();
const monitor = require('pg-monitor');

//adds db query logging to the console
monitor.attach({});

const connectionOptions = {
  host: 'localhost',
  port: 5432,
  database: process.env.NODE_ENV === 'test' ? 'http_auth_test' : 'http_auth'
};

const db = pgp(connectionOptions);

const addUser = (email, password) => db.one(
  `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;`, 
  [email, password]
);

const getUser = (email, password) => db.one(
  `SELECT * FROM users WHERE email=$1;`, [email]
);

const closeConnection = () => {
  pgp.end();
};

module.exports = {
  addUser,
  getUser
};