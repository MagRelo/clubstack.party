const GroupModel = require('../models').GroupModel;
const { addGroup } = require('../integrations/rocketchat');

exports.getGroup = async function(req, res) {
  try {
    const group = await GroupModel.findOne({
      subdomain: req.params.subdomain,
    });

    if (group) {
      res.status(200).send(group);
    } else {
      // console.log('subdomain 204');
      res.status(204).send();
    }
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.createGroup = async function(req, res) {
  try {
    const group = new GroupModel({
      owner: req.body._id,
      status: 'Active',
      subdomain: req.body.subdomain,
    });

    // Create RocketChat Group
    const groupResponse = await addGroup(req.body.subdomain, [
      req.user.rocketUserId,
    ]);
    group.rocketGroupId = groupResponse.group._id;
    group.rocketGroup = groupResponse.group;
    await group.save();

    res.status(201).send(group);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.updateGroup = async function(req, res, next) {
  try {
    // get latest
    await GroupModel.findByIdAndUpdate({ owner: req.user._id }, req.body, {
      new: true,
    });
    next();
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.getUserBySubdomain_Admin = async function(req, res) {
  try {
    const user = await GroupModel.findOne({
      subdomain: req.params.subdomain,
    }).lean();
    if (user) {
      res.status(200).send(user);
    } else {
      console.log('subdomain 204');
      res.status(204).send();
    }
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};
