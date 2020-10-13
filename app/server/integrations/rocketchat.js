const fetch = require('node-fetch');

// init client with
// process.env.ROCKETCHAT_APP_PASS
// process.env.ROCKETCHAT_APP_USER
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
    console.log('RocketChat API Ready');
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
    throw new Error(response.statusText);
  }

  return response.ok;
}

//
// Methods
//

exports.addUser = async function(user, roles = []) {
  const method = 'POST';
  const endpoint = '/api/v1/users.create';
  const body = {
    email: user.email,
    username: user.email,
    name: user.email,
    password: user.UserId,

    // roles: roles,
    // joinDefaultChannels: true,
    // requirePasswordChange: true,
    // sendWelcomeEmail: false,
    // verified: false,
    // customFields: {},
  };

  return callApi(method, endpoint, body);
};

exports.addChannel = async function({ name, memberArray }) {
  const method = 'POST';
  const endpoint = '/api/v1/channels.create';
  const body = {
    name: name,
    members: memberArray,
    readOnly: false,
  };

  return callApi(method, endpoint, body);
};

exports.addUserToChannel = async function({ name, memberArray }) {
  // const method = 'POST';
  // const endpoint = '/api/v1/channels.create';
  // const body = {
  //   name: name,
  //   members: memberArray,
  //   readOnly: false,
  // };

  // return callApi(method, endpoint, body);

  return console.log('Add user to channel - not implemented!');
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
