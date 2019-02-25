const { Pool } = require('pg');
// const { Pool, Client } = require('pg');

let pool;

exports.initPG = async function() {
  const connectionString = process.env.PG_CONNECTION_STRING;
  console.log('PG Connection:', process.env.PG_CONNECTION_STRING);

  pool = new Pool({
    connectionString: connectionString
  });
};

exports.getAllGroups = async function() {
  const query = `
  SELECT * FROM "groupsSchema"."group"
  `;

  const queryObj = {
    text: query
  };

  try {
    const res = await pool.query(queryObj);
    return res.rows;
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.getGroup = async function(contractAddress) {
  console.log('getGroup:', contractAddress);

  const query = `
    SELECT *
    FROM "groupsSchema"."group"
    WHERE "group"."groupKey" =$1;
  `;

  const queryObj = {
    text: query,
    values: [contractAddress]
  };

  try {
    const res = await pool.query(queryObj);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.createGroup = async function(groupKey, groupName, minDeposit, members) {
  console.log('createGroup:', groupKey, groupName, minDeposit, members);

  const date = new Date();
  const created = date; // created,
  const updated = date; // updated,

  const query = `
    INSERT INTO "groupsSchema"."group"(
    "groupKey", "groupName", "minDeposit", created, updated)
    VALUES ($1, $2, $3, $4, $5);
  `;
  const queryParams = [groupKey, groupName, minDeposit, created, updated];

  try {
    // create group
    const res = await pool.query({
      text: query,
      values: queryParams
    });

    // create users
    const usersInserts = members.map(member => {
      return pool.query({
        text: query,
        values: queryParams
      });
    });

    // create links
    const linkInserts = members.map(member => {
      return pool.query({
        text: query,
        values: queryParams
      });
    });

    return res;
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.updateGroupChat = async function(chatData) {
  console.log('pg', chatData);

  try {
    const res = await pool.query('SELECT NOW()');
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }
};

exports.updateUser = async function(userAddress, name) {
  // create(update$) user
};

exports.createProposal = async function(
  fromAsset,
  toAsset,
  quantity,
  created,
  updated,
  userKey,
  groupKey
) {
  // setup query
  const query = `
  INSERT INTO "groupsSchema"."groupProposal"(
    "fromAsset", "toAsset", quantity, created, updated, "userKey", "groupKey")
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
  const queryParams = [
    fromAsset,
    toAsset,
    quantity,
    created,
    updated,
    userKey,
    groupKey
  ];

  console.log([
    fromAsset,
    toAsset,
    quantity,
    created,
    updated,
    userKey,
    groupKey
  ]);

  try {
    return await pool.query({
      text: query,
      values: queryParams
    });
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

exports.updateProposalVote = async function(
  userKey,
  groupKey,
  proposalId,
  inFavor
) {
  console.log('pg vote', proposalId, inFavor);

  const date = new Date();
  const created = date; // created,
  const updated = date; // updated,

  // setup query
  const query = `
  INSERT INTO "groupsSchema"."proposalVote"(
    "proposalId", "inFavor", created, updated, "userKey", "groupKey")
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const queryParams = [
    proposalId,
    inFavor,
    created,
    updated,
    userKey,
    groupKey
  ];

  try {
    return await pool.query({
      text: query,
      values: queryParams
    });
  } catch (err) {
    console.log(err.stack);
  }
};

// Log Trades
exports.updateProposalTrade = async function(userData) {
  // trade
};

exports.getLobbyData = async function(groupKey) {
  const group = {
    text: `
      SELECT *
      FROM "groupsSchema"."group"
      WHERE "group"."groupKey" = $1
    `,
    values: [groupKey]
  };

  const proposals = {
    text: `
      SELECT *
      FROM "groupsSchema"."groupProposal"
      WHERE "groupProposal"."groupKey" = $1
    `,
    values: [groupKey]
  };

  const chat = {
    text: `
      SELECT *
      FROM "groupsSchema"."groupChat"
      WHERE "groupChat"."groupKey" = $1
    `,
    values: [groupKey]
  };

  // const portfolio = {
  //   text: `
  //     SELECT *
  //     FROM "groupsSchema"."groupPortfolio"
  //     WHERE "groupChat"."groupKey" = $1
  //   `,
  //   values: [groupKey]
  // };

  // const members = {
  //   text: `
  //     SELECT *
  //     FROM "groupsSchema"."groupPortfolio"
  //     WHERE "groupChat"."groupKey" = $1
  //   `,
  //   values: [groupKey]
  // };

  try {
    const data = await Promise.all([
      await pool.query(group),
      await pool.query(proposals),
      await pool.query(chat)
    ]);

    return {
      group: data[0].rows[0],
      proposals: data[1].rows,
      chat: data[2].rows
    };
  } catch (err) {
    console.log(err.stack);
  }
};

exports.createMessage = async function(userKey, groupKey, message) {
  const date = new Date();
  const created = date; // created,
  const updated = date; // updated,

  const query = `
  INSERT INTO "groupsSchema"."groupChat"(
    message, "userKey", "groupKey", created, updated)
    VALUES ($1, $2, $3, $4, $5);
  `;
  const queryParams = [message, userKey, groupKey, created, updated];

  try {
    return await pool.query({
      text: query,
      values: queryParams
    });
  } catch (err) {
    console.log(err.stack);
  }
};
