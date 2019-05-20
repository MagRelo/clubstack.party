const dotenv = require('dotenv');

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);

const bodyParser = require('body-parser');
const morgan = require('morgan');

const UserModel = require('./models').UserModel;
const ProfileModel = require('./models').ProfileModel;
const LinkModel = require('./models').LinkModel;

// const {
//   getAllGroups,
//   getGroup,
//   createGroup,
//   createProposal,
//   updateProposalVote,
//   createMessage,
//   countProposalVote,
//   closeProposalVote
// } = require('./pg-controller');

// const { startIo, broadcastGroupUpdate } = require('./sockets');

// *
// load env var's
// *

if (process.env.ENV === 'production') {
  console.log('ENV: ' + process.env.ENV);
} else {
  // load local config from .env file
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}

// stripe
require('./stripe');

// *
// db
// *

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URL_INT || 'mongodb://127.0.0.1:27017/recruiting',
  { useNewUrlParser: true }
);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// *
// Server
// *

// sockets
// startIo(server);

// configure express middleware
app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(
  morgan('dev', {
    skip: function(req, res) {
      // remove the frontend dev server's 'json' calls from the console output
      return req.originalUrl.indexOf('json') > 0;
    }
  })
);

// http routing

// get all groups
app.post('/register/profile', async function(req, res) {
  // required

  const userProfile = req.body;

  try {
    // create the user
    const user = new UserModel(userProfile);
    await user.save();

    // add user id
    userProfile.user = user._id;

    // create the profile
    const profile = new ProfileModel(userProfile);
    await profile.save();

    // add profile id
    userProfile.profile = profile._id;

    // create a link
    const link = new LinkModel(userProfile);
    await link.save();

    res.status(200).send(link);
  } catch (error) {
    console.log('API Error:', error);
    res.status(500).send(error);
  }
});

app.get('/api/profile/:linkId', async function(req, res) {
  // validate input
  const linkId = parseInt(req.params.linkId, 10);
  if (typeof linkId != 'number') {
    return res.status(401).send('bad input: ' + typeof linkId);
  }

  try {
    const link = await LinkModel.findOne({ linkId: linkId });
    const profile = await ProfileModel.findOne({ _id: link.profile });

    res.status(200).send(profile);
  } catch (error) {
    console.log('apierror');
    res.status(500).send(error);
  }
});

// serve the frontend for all non-api requests
app.get('/*', function(req, res) {
  res.sendFile('index.html', { root: './build' });
});

// start server
server.listen(8080, () => {
  console.log('server listening on 8080');
});
