const UserModel = require('../models').UserModel;
const getStream = require('../integrations/getstream');
const { getSubscriberRedirectURL } = require('../integrations/payments');

// get user
exports.populateUser = async function(req, res) {
  try {
    const user = await UserModel.findOne({ _id: req.user.id })
      .select(
        `firstname lastname avatar displayName description location email linkedInProfile 
        jobBoardUrl jobBoardId stripeAccountLabel stripeCustomerLabel stripeCustomerBrand`
      )
      .lean();

    if (!user) {
      return res.status(401).send({ error: 'no user' });
    }

    // get queries and links
    const userObject = {
      user: {
        hasAccount: !!user.stripeAccountLabel,
        hasPaymentSource: !!user.stripeCustomerLabel,
        ...user,
      },
    };

    res.status(200).send(userObject);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
};

exports.getUserNetwork = async function(req, res) {
  try {
    const feed = await getStream.getFeed('User', req.user._id, req.user._id);

    // the user & all their follows
    const networkUsers = await UserModel.find({
      _id: { $in: [req.user._id, ...req.user.follows] },
    })
      .sort({ units: -1 })
      .lean();

    const suggestedFollows = await UserModel.find({
      _id: { $not: { $in: [req.user._id, ...req.user.follows] } },
    })
      .limit(3)
      .sort({ units: -1 })
      .lean();

    // const stats = await getStats(req.user);

    res.status(200).send({
      feed: feed,
      following: networkUsers,
      stats: null,
      suggestedFollows: suggestedFollows,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.getUserBySubdomain = async function(req, res) {
  try {
    const user = await UserModel.findOne({
      subdomain: req.params.subdomain,
    });
    if (user) {
      res.status(200).send({
        subdomain: user.subdomain,
        subdomainData: user.subdomainData,
        productCode: user.productCode,
      });
    } else {
      console.log('subdomain 204');
      res.status(204).send();
    }
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.updateSubdomain = async function(req, res) {
  try {
    // get latest
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      req.body,
      { new: true }
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.getUser = async function(req, res) {
  try {
    const user = await UserModel.findOne({ _id: req.params.userId }).lean();

    // const stats = await getStats(user);
    res.status(200).send({
      user,
      stats: null,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.manageSubscriptionLink = async function(req, res) {
  try {
    //
    const redirectUrl = await getSubscriberRedirectURL(
      req.user.stripeCustomerId
    );

    res.status(200).send({ url: redirectUrl });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.updateProfile = async function(req, res) {
  try {
    // get latest
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      {
        displayName: req.body.displayName,
        avatar: req.body.avatar,
        caption: req.body.caption,
      },
      { new: true }
    );

    // console.log(updatedUser);

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

exports.joinWaitlist = async function(req, res) {
  // params
  const subdomain = req.body.subdomain;
  const waitlistEmail = req.body.email;

  try {
    // update or create source user/waitlist
    let waitlistUser = await UserModel.findOne({ email: waitlistEmail });
    if (!waitlistUser) {
      waitlistUser = new UserModel({ email: waitlistEmail });
      await waitlistUser.save();
      // console.log('user created:', waitlistUser);
    }

    // update or create target user/waitlist
    let user = await UserModel.findOne({ subdomain: subdomain });
    if (user) {
      // update
      console.log(user);
      user.waitlist.addToSet(waitlistUser._id);
    } else {
      user = new UserModel({
        subdomain: subdomain,
        waitlist: [waitlistUser._id],
      });
    }
    await user.save();

    // console.log(updatedUser);

    res.status(200).send({ ok: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.userFollow = async function(req, res) {
  try {
    const intentToFollow = req.query.intent === 'true';
    const feedType = req.query.type;
    const targetId = req.query.target;

    let updatedUser = null;

    if (intentToFollow) {
      console.log('add follow', targetId);
      // follow
      await getStream.follow(req.user._id, feedType, targetId);

      // add to user follow array
      updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { follows: targetId } },
        { new: true }
      );
    } else {
      console.log('unfollow', targetId);

      // unfollow
      await getStream.unFollow(req.user._id, feedType, targetId);

      // remove from user follow array
      updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { follows: targetId } },
        { new: true }
      );
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
};

// createUser (from /email)
//

exports.createUser = async function(email) {
  let newUser = new UserModel({
    email: email,
  });
  await newUser.save();
  return {
    email: newUser.email,
    userId: newUser.userId,
    status: newUser.status,
  };
};

exports.activateUser = async function(user, userMetadata) {
  return UserModel.findOneAndUpdate(
    { email: userMetadata.email },
    {
      $set: {
        issuer: user.issuer,
        email: userMetadata.email,
        lastLoginAt: user.claim.iat,
        publicAddress: user.publicAddress,
        status: 'Active',
      },
    },
    { new: true }
  );
};
//

exports.updateLatestLogin = async function(user) {
  return UserModel.findOneAndUpdate(
    { issuer: user.issuer },
    { $set: { lastLoginAt: user.claim.iat } },
    { new: true }
  );
};
