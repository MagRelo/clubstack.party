const stream = require('getstream');
const { StreamChat } = require('stream-chat');

const UserModel = require('../models').UserModel;

// Init getStream
const apiKey = process.env.STREAM_API_KEY;
const apiKeySecret = process.env.STREAM_API_SECRET;
const streamClient = stream.connect(apiKey, apiKeySecret);
const chatClient = new StreamChat(
  process.env.STREAM_CHAT_KEY,
  process.env.STREAM_CHAT_SECRET
);

exports.createStreamChatUser = async function(userId) {
  return chatClient.createToken(userId);
};

exports.createStreamChatChannel = async function({
  channelName = 'default',
  image = 'default',
  members = [],
  created_by_id = '123',
}) {
  const newChannel = chatClient.channel('messaging', channelName, {
    channelName,
    image,
    members,
    created_by_id,
  });
  return newChannel.create();
};

// => create User(?)
exports.addUser = async function(user) {
  const newUser = await streamClient.feed('User', user._id.toString());
  await newUser.addActivity({
    actor: user._id,
    verb: 'addUser',
    object: user._id,
    time: user.createdAt,
  });
};

// => activate subdomain
exports.addGroup = async function(sourceUser) {
  // Subscribe user to the group's feed
  const userFeed = await streamClient.feed('User', sourceUser._id);
  await userFeed.follow('Group', sourceUser._id, { limit: 0 });

  // Add event the group's feed
  const groupFeed = await streamClient.feed('Group', sourceUser._id);
  await groupFeed.addActivity({
    actor: sourceUser._id,
    verb: 'addGroup',
    object: sourceUser._id,
    time: sourceUser.createdAt,
  });
};

// => subscribe
exports.follow = async function(userId, feedType, targetId) {
  // console.log(userId, feedType, targetId);

  // get user feed & follow target
  const userFeed = await streamClient.feed('User', userId);
  // await userFeed.follow(feedType, targetId, { limit: 0 });
  await userFeed.follow(feedType, targetId);

  // Add activity with target
  const timeStamp = new Date();
  return userFeed.addActivity({
    actor: userId,
    verb: `addFollow:${feedType}`,
    object: targetId,
    time: timeStamp,
    target: `${feedType}:${targetId}`,
  });
};

// => unsubscribe
exports.unFollow = async function(userId, feedType, targetId) {
  // console.log(userId, feedType, targetId);
  const userFeed = await streamClient.feed('User', userId);
  return await userFeed.unfollow(feedType, targetId);
};

//
// Get Feed
//
exports.getFeed = async function(feedType, id, userId) {
  const streamUser = await streamClient.feed(feedType, id);
  const userFeed = await streamUser.get({ limit: 15 });
  return await hydrateStreamFeed(userFeed.results, userId);
};

async function hydrateStreamFeed(inputArray = [], userId) {
  // create array of queries
  const queries = inputArray.map((item) => {
    // switch on type
    switch (item.verb) {
      case 'addUser':
        return UserModel.findOne({ _id: item.object })
          .lean()
          .then((data) => {
            item.data = data;
            return item;
          });

      case 'addFollow:User':
        return UserModel.findOne({ _id: item.object })
          .lean()
          .then((data) => {
            item.data = data;
            return item;
          });

      case 'addFollow:Group':
        return UserModel.findOne({ _id: item.object })
          .lean()
          .then((data) => {
            item.data = data;
            return item;
          });

      default:
        break;
    }

    return {};
  });

  // get data
  const dataItems = await Promise.all(queries);
  // console.log(dataItems);

  //

  return dataItems;
}
