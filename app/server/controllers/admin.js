const UserModel = require('../models').UserModel;
const {
  createUser,
  createChannel,
  addChannelOwner,
} = require('../integrations/rocketchat');

// get user

exports.addSubdomain = async function(req, res) {
  try {
    // form
    const email = req.body.email;
    const subdomain = req.body.subdomain;
    const productCode = req.body.productCode; // TODO: get a new product code from Stripe

    // get/create target user
    let targetUser = UserModel.findOne({ email: email });
    if (!targetUser) {
      targetUser = new UserModel({
        email: email,
        subdomain: subdomain,
        productCode: productCode,
      });
      await targetUser.save();
    } else {
      targetUser = await UserModel.updateOne(
        { email: email },
        {
          $set: {
            email: email,
            subdomain: subdomain,
            productCode: productCode,
          },
        },
        { new: true }
      );
    }

    const newUser = await createUser(targetUser);
    const newChannel = await createChannel(targetUser);
    await addChannelOwner(targetUser);
    // console.log('add user');

    // Update user
    const result = await UserModel.updateOne(
      { email: email },
      {
        $set: {
          rocketUser: newUser,
          rocketChannel: newChannel,
        },
      },
      { new: true }
    );

    res.status(200).send(result);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.activateSubdomain = async function(req, res) {
  try {
    // look for Email; dont overwrite?
    let owner = await UserModel.findOne({ email: req.body.email });
    if (owner) {
      // update
      owner.subdomain = req.body.subdomain;
      owner.subdomainData = req.body;
    } else {
      // create
      owner = new UserModel({
        email: req.body.email,
        status: 'Active',
        subdomain: req.body.subdomain,
        subdomainData: req.body,
      });
    }

    await owner.save();
    res.status(200).send(owner);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.listSubdomains = async function(req, res) {
  try {
    // look for Email; dont overwrite?
    let subdomains = await UserModel.find({
      status: 'Active',
      subdomain: { $exists: true },
    }).select('subdomain email');

    res.status(200).send(subdomains);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};
