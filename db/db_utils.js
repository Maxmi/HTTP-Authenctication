const pg_options = {};
const pgp = require('pg-promise')(pg_options);
const monitor = require('pg-monitor');

//add db query logging to the console
monitor.attach(pg_options);


const connection_options = {
  host: 'localhost',
  port: 5432,
  database: process.env.NODE_ENV === 'test' ? 'Users_Test' : 'Users' 
}


const db = pgp(connection_options);

const initializeTestDB = () => {
  return db.none(`
    INSERT INTO Users_Test (email, password)
    VALUES ('me@example.com', '123')
    `)
};


const addUser = (email, password, confirmPswd) => {
  db.one(
    `INSERT INTO Users (email, password, confirmPswd) VALUES ($1, $2, $3) RETURNING *;`,
    [email, password, confirmPswd]
  ).then(data => {
    return data;
  }).catch(err => {
    console.log(err, `error occured when saving data to db`);
  });
};

const getUser = (email) => {
  return db.query(
    `SELECT * FROM Users WHERE email=$1`, email
  ).then(data => {
    return data;
  }).catch(err => {
    console.log(err, `user not found`);
  })
};

module.exports = { addUser, getUser };
