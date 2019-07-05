const stream = require('getstream');

const UserModel = require('../models').UserModel;
const QueryModel = require('../models').QueryModel;
const LinkModel = require('../models').LinkModel;
const ResponseModel = require('../models').ResponseModel;

const apiKey = 'hdm568bfbafw';
const apiKeySecret =
  'egqcazdzd8ws8zue6srrvdbeypzfghxgm6hv99pbfgyzp5nauesb86qru69gjuxk';

// Instantiate a new client (server side)
const streamClient = stream.connect(
  apiKey,
  apiKeySecret
);

exports.addUser = async function(user) {
  const newUser = await streamClient.feed('User', user._id.toString());
  await newUser.addActivity({
    actor: user._id,
    verb: 'addUser',
    object: user._id,
    time: user.createdAt
  });
};

exports.followUser = async function(user, userToFollowId) {
  // get stream 'User' feed for user
  const streamFeed = await streamClient.feed('User', user._id);

  // add follow
  return await streamFeed.follow('User', userToFollowId);
};

exports.addQuery = async function(user, query) {
  // get 'Query' feed for query and add "addQuery" activity
  const queryFeed = await streamClient.feed('Query', query._id);
  await queryFeed.addActivity({
    actor: user._id,
    verb: 'addQuery',
    object: query._id,
    time: query.createdAt
  });

  // get 'User' feed for user and add "addQuery" activity
  const userFeed = await streamClient.feed('User', user._id);
  await userFeed.addActivity({
    actor: user._id,
    verb: 'addQuery',
    object: query._id,
    time: query.createdAt
  });

  // subscribe user to Query feed
  return userFeed.follow('Query', query._id);
};

exports.addLink = async function(user, query, link) {
  // get 'Query' feed for query and add "addLink" activity
  const queryFeed = await streamClient.feed('Query', query._id);
  await queryFeed.addActivity({
    actor: user._id,
    verb: 'addLink',
    object: link._id,
    time: link.createdAt
  });

  // get 'User' feed for user and add "addLink" activity
  const userFeed = await streamClient.feed('User', user._id);
  return await userFeed.addActivity({
    actor: user._id,
    verb: 'addLink',
    object: link._id,
    time: link.createdAt
  });
};

exports.addResponse = async function(user, query, response) {
  // get 'Query' feed for query and add "addLink" activity
  const queryFeed = await streamClient.feed('Query', query._id);
  await queryFeed.addActivity({
    actor: user._id,
    verb: 'addResponse',
    object: response._id,
    time: response.createdAt
  });

  // get 'User' feed for user and add "addLink" activity
  const userFeed = await streamClient.feed('User', user._id);
  return await userFeed.addActivity({
    actor: user._id,
    verb: 'addResponse',
    object: response._id,
    time: response.createdAt
  });
};

exports.getUser = async function(user) {
  const streamUser = await streamClient.feed('User', user._id.toString());
  const userFeed = await streamUser.get({ limit: 15 });
  return await hydrateStreamFeed(userFeed.results);
};

async function hydrateStreamFeed(inputArray = []) {
  // create array of queries
  const queries = inputArray.map(item => {
    // switch on type
    switch (item.verb) {
      case 'addUser':
        return UserModel.findOne({ _id: item.object })
          .lean()
          .then(data => {
            item.data = data;
            return item;
          });
        break;

      case 'addQuery':
        return QueryModel.findOne({ _id: item.object })
          .lean()
          .then(data => {
            item.data = data;
            return item;
          });
        break;

      case 'addLink':
        return LinkModel.findOne({ _id: item.object })
          .populate('query')
          .lean()
          .then(data => {
            item.data = data;
            return item;
          });
        break;

      case 'addResponse':
        return ResponseModel.findOne({ _id: item.object })
          .populate('respondingUser')
          .lean()
          .then(data => {
            item.data = data;
            return item;
          });
        break;
      default:
        break;
    }
  });

  // get data
  const dataItems = await Promise.all(queries);
  // console.log(dataItems);

  //

  return dataItems;
}