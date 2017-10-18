const pg_options = {};
const pgp = require('pg-promise')(pg_options);
const monitor = require('pg-monitor');

//add db query logging to the console
monitor.attach(pg_options);

const connection_options = {
  host: 'localhost',
  port: 5432,
  database: process.env.NODE_ENV === 'test' ? 'http_auth_test' : 'http_auth' 
};

const db = pgp(connection_options);

//why do we have it here?
const initializeTestDB = () => {
  return db.none(`
    INSERT INTO users (email, password)
    VALUES ('me@example.com', '123')
    `)
};


const addUser = ( { email, password } ) => {
  return db.one(
    `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;`,
    [email, password]
  ).then(data => {
    return data;
  }).catch(err => {
    console.log(err, `error occured when saving data to db`);
  });
};

const getUser = (email, password) => {
  return db.one(
    `SELECT * FROM users WHERE email=$1;`, email
  ).then(data => {
    if(password === data.password) {
      return data;
    } else {
      return '';
    }
  })
  .catch(err => {
    console.log(err, `user not found`);
    return err;
  })
};

const closeConnection = () => {
  pgp.end();
};

module.exports = { addUser, getUser };
