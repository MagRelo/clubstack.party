const UserModel = require('../models').UserModel;
const { addUser, addGroup } = require('../integrations/rocketchat');

exports.activateSubdomain = async function(req, res) {
  try {
    // Create of Update User
    let owner = await UserModel.findOne({ email: req.body.email });
    if (owner) {
      // update
      owner.subdomain = req.body.subdomain;
      owner.productCode = req.body.productCode;
      owner.subdomainData = req.body;
      owner.status = 'Active';
    } else {
      // create
      owner = new UserModel({
        email: req.body.email,
        productCode: req.body.productCode,
        subdomain: req.body.subdomain,
        status: 'Active',
        subdomainData: req.body,
      });
    }
    await owner.save();

    // Create RocketChat User
    const userResponse = await addUser(owner);
    owner.rocketUserId = userResponse.user._id;
    owner.rocketUser = userResponse.user;
    await owner.save();

    // Create RocketChat Group
    const groupResponse = await addGroup(owner, owner.subdomain, [
      owner.rocketUser.username,
    ]);
    owner.rocketGroupId = groupResponse.group._id;
    owner.rocketGroup = groupResponse.group;
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
