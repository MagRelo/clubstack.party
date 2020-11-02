const GroupModel = require('../models').GroupModel;
// const { addGroup } = require('../integrations/rocketchat');
const { createStreamChatChannel } = require('../integrations/getstream');

exports.getAllGroups = async function(req, res) {
  try {
    const groups = await GroupModel.find({ owner: { $ne: req.user._id } });

    res.status(200).send(groups);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

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
    // create the Group
    const newGroup = new GroupModel({
      owner: req.user._id,
      subdomain: req.body.subdomain,
      name: req.body.disaplyName,
      caption: req.body.caption,
      description: req.body.description,
      image: req.body.image,
      imageAlt: req.body.alt,
    });
    await newGroup.save();

    // create getstream channel
    await createStreamChatChannel({
      channelName: req.body.subdomain,
      image: req.body.image,
      members: [req.user._id],
      created_by_id: req.user._id,
    });

    // update user

    res.status(201).send(newGroup);
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
