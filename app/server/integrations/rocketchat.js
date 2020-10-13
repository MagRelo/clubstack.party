const fetch = require('node-fetch');

// Init Rocketchat
let authCode = '';
let userId = '';
fetch(process.env.ROCKETCHAT_BASE_URL + '/api/v1/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user: process.env.ROCKETCHAT_APP_USER,
    password: process.env.ROCKETCHAT_APP_PASS,
  }),
})
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }

    throw new Error(response.status);
  })
  .then(({ status, data }) => {
    //get values for API calls
    authCode = data.authToken;
    userId = data.userId;
    console.log(
      'RocketChat API Ready (' + process.env.ROCKETCHAT_BASE_URL + ')'
    );
  })
  .catch((error) => {
    console.log(error);
  });

async function callApi(method, endpoint, body) {
  const headers = {
    'X-Auth-Token': authCode,
    'X-User-Id': userId,
    'Content-Type': 'application/json',
  };

  const response = await fetch(process.env.ROCKETCHAT_BASE_URL + endpoint, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.log(await response.json());
    throw new Error(endpoint + ': ' + response.statusText);
  }

  return response.json();
}

//
// Methods
//

exports.addUser = async function(user, roles = []) {
  // bail if user exists
  if (user.rocketUser) {
    console.log('user already exists:', user.email);
    return { user: user.rocketUser };
  }

  const method = 'POST';
  const endpoint = '/api/v1/users.create';
  const body = {
    email: user.email,
    username: user.subdomain,
    name: user.subdomain,
    password: user.userId,

    // roles: roles,
    joinDefaultChannels: false,
    // requirePasswordChange: true,
    // sendWelcomeEmail: false,
    // verified: false,
    // customFields: {},
  };

  return callApi(method, endpoint, body);
};

//
// Groups
//
exports.addGroup = async function(name, memberArray = []) {
  const method = 'POST';
  const endpoint = '/api/v1/groups.create';
  const body = {
    name: name,
    members: memberArray,
    readOnly: false,
  };

  return callApi(method, endpoint, body);
};

exports.addUserToGroup = async function(roomId, userId) {
  const method = 'POST';
  const endpoint = '/api/v1/groups.invite';
  const body = {
    roomId: roomId,
    userId: userId,
  };

  return callApi(method, endpoint, body);

  // return console.log('Add user to channel - not implemented!');
};

exports.removeUserFromGroup = async function(roomId, userId) {
  const method = 'POST';
  const endpoint = '/api/v1/groups.kick';
  const body = {
    roomId: roomId,
    userId: userId,
  };

  return callApi(method, endpoint, body);

  // return console.log('Add user to channel - not implemented!');
};

//
// Channels
//

exports.addChannel = async function(name, memberArray = []) {
  const method = 'POST';
  const endpoint = '/api/v1/channels.create';
  const body = {
    name: name,
    members: memberArray,
    readOnly: false,
  };

  return callApi(method, endpoint, body);
};

exports.addChannelOwner = async function(roomId, userId) {
  const method = 'POST';
  const endpoint = '/api/v1/channels.addOwner';
  const body = {
    roomId: roomId,
    userId: userId,
  };

  return callApi(method, endpoint, body);

  // return console.log('Add user to channel - not implemented!');
};

exports.inviteUserToChannel = async function(roomId, userId) {
  const method = 'POST';
  const endpoint = '/api/v1/channels.invite';
  const body = {
    roomId: roomId,
    userId: userId,
  };

  return callApi(method, endpoint, body);

  // return console.log('Add user to channel - not implemented!');
};

exports.removeUserFromChannel = async function({ name, memberArray }) {
  // const method = 'POST';
  // const endpoint = '/api/v1/channels.create';
  // const body = {
  //   name: name,
  //   members: memberArray,
  //   readOnly: false,
  // };

  // return callApi(method, endpoint, body);

  return console.log('Remove user from channel - not implemented!');
};
