var express = require('express');
var router = express.Router();

const passport = require('passport');

const UserModel = require('./models').UserModel;
const QueryModel = require('./models').QueryModel;
const LinkModel = require('./models').LinkModel;

//
// PUBLIC
//

// add
router.post('/user/add', async function(req, res) {
  // required

  const userProfile = req.body;

  try {
    // create the user
    const user = new UserModel(userProfile);
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.log('API Error:', error);
    res.status(500).send(error);
  }
});

// login
router.post('/user/login', passport.authenticate('local'), function(req, res) {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
});

//
// AUTH
//

// add query
router.post('/query/add', async function(req, res) {
  // check auth
  if (!req.user) {
    return res.status(401);
  }
  const query = req.body;

  try {
    // create query
    const newQuery = new QueryModel({
      type: query.type,
      data: query.data,
      user: req.user._id
    });
    await newQuery.save();

    // create link
    const newLink = new LinkModel({
      user: req.user._id,
      query: newQuery._id,
      parentLink: null
    });
    await newLink.save();

    // push link back into query
    await QueryModel.updateOne(
      { _id: newQuery._id },
      { $push: { links: newLink._id } }
    );

    const updatedQuery = await QueryModel.findOne({ _id: newQuery._id })
      .lean()
      .populate('links');

    res.status(200).send(updatedQuery);
  } catch (error) {
    console.log('API Error:', error);
    res.status(500).send(error);
  }
});

// list query
router.get('/query/list', async function(req, res) {
  // check auth
  if (!req.user) {
    return res.status(401);
  }

  try {
    const queryList = await QueryModel.find()
      .lean()
      .populate({ path: 'links', populate: { path: 'parentLink' } });

    // build graph data
    const hydratedQueryData = queryList.map(query => {
      return buildGraphData(query);
    });

    res.status(200).send(hydratedQueryData);
  } catch (error) {
    console.log('API Error:', error);
    res.status(500).send(error);
  }
});

// get query by linkId
router.get('/query/:linkId', async function(req, res) {
  try {
    const link = await LinkModel.findOne({ linkId: req.params.linkId });
    if (!link) {
      return res.status(404).send('link not found');
    }

    const query = await QueryModel.findOne({ _id: link.query })
      .lean()
      .populate({ path: 'links', populate: { path: 'parentLink' } });
    if (!query) {
      return res.status(404).send('profile not found');
    }

    res.status(200).send(buildGraphData(query));
  } catch (error) {
    console.log('apierror');
    res.status(500).send(error);
  }
});

function buildGraphData(query) {
  query.graphData = {
    nodes: [{ id: 'root' }],
    links: []
  };

  // loop through links
  query.links.forEach(link => {
    // add link as node
    query.graphData.nodes.push({ id: link.linkId });

    // add link as link
    if (link.parentLink) {
      query.graphData.links.push({
        source: link.linkId,
        target: link.parentLink.linkId
      });
    } else {
      query.graphData.links.push({ source: link.linkId, target: 'root' });
    }
  });

  return query;
}

// create link to query
router.post('/link/add', async function(req, res) {
  // auth-only
  if (!req.user) {
    return res.status(401);
  }

  // validate
  if (!req.body.queryId) {
    return res.status(400);
  }

  let parentLink = {};
  if (req.body.parentLink) {
    parentLink = await LinkModel.findOne({ linkId: req.body.parentLink });
    if (!parentLink) {
      return res.status(404).send('parent link not found');
    }
  }

  try {
    // add new link(?)
    const newLink = new LinkModel({
      user: req.user._id,
      query: req.body.queryId,
      parentLink: parentLink._id
    });
    await newLink.save();

    await QueryModel.updateOne(
      { _id: req.body.queryId },
      { $push: { links: newLink._id } }
    );

    res.status(200).send(newLink);
  } catch (error) {
    console.log('API Error:', error);
    res.status(500).send(error);
  }
});

module.exports = router;
