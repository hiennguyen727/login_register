const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { login } = require('./models')
var path = require('path')
const bcrypt = require('bcrypt');
// You guys are great! :D 

// Imports ejs, the server will send back HTML instead of JSON
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }))

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.all('*', (req, res, next) => {
  logger.log({
      level: 'info',
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      timestamp: new Date().toLocaleString()
  });
  next();
})



app.get('/', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
  const nameRegex = /^[A-Za-z]+$/; // Only letters
  const usernameRegex = /^[A-Za-z0-9]+$/; // Letters and numbers
  const minLength = 8;

  const { yourName, email, username, password, reenterpassword } = req.body;
  const saltrounds = 10;

  bcrypt.hash(password, saltrounds, async (err, hash) => {
    if (err) {
      console.log(err);
      return res.status(500).render('register', { errorMessage: 'Hashing password failed' });
    }

    console.log('hashpassword:', hash);
    try {
      await login.create({
        yourName,
        email,
        username,
        password: hash, 
        reenterpassword
      });

      res.render('register', { successMessage: 'Registration successful' });
    } catch (err) {
      console.error(err);
      res.status(500).render('register', { errorMessage: 'Registration failed' });
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await login.findOne({ where:{ email:email }});

    if (!user) {
      return res.status(400).render('login', { errorMessage: 'Wrong email or password' });
    }
console.log('ljljlkjljljljljlj',user)
    // Use bcrypt.compare to compare the entered password with the hashed password
    bcrypt.compare(password, user.password, async (err, result) => {
      console.log('hihihihihh',password)
      console.log('huhfghfhgf',user.password)
      if (err) {
        console.error(err);
        return res.status(500).render('login', { errorMessage: 'Login failed' });
      }

      if (result) {
        res.render('login', { successMessage: 'Login successful' });
      } else {
        res.status(400).render('login', { errorMessage: 'Wrong email or password' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { errorMessage: 'Login failed' });
  }
});





app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

