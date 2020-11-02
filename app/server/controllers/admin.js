const UserModel = require('../models').UserModel;
const GroupModel = require('../models').GroupModel;
// const { addUser, addGroup } = require('../integrations/rocketchat');
const {
  createStreamChatUser,
  createStreamChatChannel,
} = require('../integrations/getstream');

exports.activateSubdomain = async function(req, res) {
  try {
    // Create or Update User
    let owner = await UserModel.findOne({ email: req.body.email });
    if (!owner) {
      // create
      owner = new UserModel({
        email: req.body.email,
        status: 'Active',
      });
      owner.getStreamToken = await createStreamChatUser(owner.userId);
      console.log('create user', owner.userId, owner.getStreamToken);
      await owner.save();
    }

    // create the Group
    const newGroup = new GroupModel({
      owner: owner,
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
      members: [owner.userId],
      created_by_id: owner.userId,
    });

    res.status(200).send(newGroup);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.listSubdomains = async function(req, res) {
  try {
    // look for Email; dont overwrite?
    let subdomains = await GroupModel.find({}).select('subdomain');

    res.status(200).send(subdomains);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};
