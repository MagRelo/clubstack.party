// *
// monitoring
// *
require('newrelic');

// *
// load env var's
// *
const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
  // load local config from .env file
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}
console.log('ENV: ' + process.env.NODE_ENV);

// *
// db
// *

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

try {
  mongoose.connect(process.env.MONGODB_URL_INT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
} catch (error) {
  console.error('MongoDB connection error: ' + error);
}

mongoose.connection.on('error', function (error) {
  console.error('MongoDB error: ' + error);
  process.exit(-1);
});
// require('./utils/seedDb');

// *
// Server
// *

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// configure express middleware
app.set('trust proxy', true);
app.use(
  express.json({
    limit: '1mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(
  morgan('dev', {
    skip: function (req, res) {
      // remove the frontend dev server's 'json' calls from the console output
      return req.originalUrl.indexOf('json') > 0;
    },
  })
);

//
// Sessions
//

const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
  uri: process.env.MONGODB_URL_INT,
  collection: 'sessions',
});
store.on('error', function (error) {
  console.log('MongoStore Error', error);
});

const cookieSettings = {
  maxAge: 60 * 60 * 1000, // 1 hour
};
if (process.env.NODE_ENV === 'production') {
  cookieSettings.secure = true;
  cookieSettings.sameSite = true;
  console.log('cookies: setting production settings', cookieSettings);
}
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sesh-secret',
    resave: false,
    saveUninitialized: true,
    cookie: cookieSettings,
    store: store,
  })
);

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//
// Routing
//
app.use(
  express.static('build', {
    index: false,
  })
);

// api routing
require('./controllers/magic-auth');
const authApi = require('./auth-api');
app.use('/auth', authApi);

const appApi = require('./api');
app.use('/api', appApi);

// page routing
const routesApi = require('./routes');
app.use('/', routesApi);

// start server
server.listen(8080, () => {
  console.log('server listening on 8080');
});
