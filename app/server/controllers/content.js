const ContentModel = require('../models').ContentModel;

// get user

exports.getContentByUser = async function(req, res) {
  try {
    const itemArray = await ContentModel.find({
      user: req.query.userId,
    }).lean();

    res.status(200).send(itemArray);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.getContentItem = async function(req, res) {
  try {
    const item = await ContentModel.findOne({ _id: req.params.id }).lean();

    if (!item) {
      return res.status(404).send({ error: 'no item' });
    }

    res.status(200).send(item);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.addContentItem = async function(req, res) {
  try {
    const newItem = new ContentModel({ user: req.user._id, ...req.body });
    await newItem.save();

    res.status(200).send(newItem);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.upsertContentItem = async function(req, res) {
  try {
    const item = await ContentModel.updateOne(
      { _id: req.body._id, user: req.user.id },
      { user: req.user.id, ...req.body },
      { upsert: true }
    ).lean();

    if (!item) {
      return res.status(404).send({ error: 'no item' });
    }

    res.status(200).send(item);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.deleteContentItem = async function(req, res) {
  try {
    const item = await ContentModel.updateOne(
      { _id: req.params.id, user: req.user.id },
      { active: false }
    ).lean();

    // doub;e check this
    if (!item) {
      return res.status(404).send({ error: 'no item' });
    }

    res.status(200).send(item);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};
