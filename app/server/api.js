var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

const fetch = require('node-fetch');

const getStream = require('./integrations/getstream');

// Controllers
const { authenticate } = require('./controllers/magic-auth');
const { getSubscriberRedirectURL } = require('./integrations/payments');
const { convertToJSON } = require('./integrations/xml');

const UserModel = require('./models').UserModel;

const Content = require('./controllers/content');

//
// CONTENT
//

router.get('/content', Content.getContentByUser);
router.get('/content/:id', Content.getContentItem);
router.post('/content', authenticate, Content.addContentItem);
router.put('/content', authenticate, Content.upsertContentItem);
router.delete('/content/:id', authenticate, Content.deleteContentItem);

router.post('/preview', async function(req, res) {
  // get RSS
  const url = req.body.url;
  const fullUrl = 'https://' + url + '.substack.com/feed';

  try {
    const response = await fetch(fullUrl)
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        } else {
          throw new Error('failed to fetch from substack');
        }
      })
      .then((xml) => {
        // console.log(xml);
        return convertToJSON(xml);
      });

    if (response) {
      const site = response.rss.channel[0];

      // reformat
      const previewContent = {
        title: site.title,
        description: site.description,
        copyright: site.copyright,
        headerImage: site.image,
        items: site.item.map((item) => {
          return {
            title: item.title,
            description: item.description,
            link: item.link[0],
            length: extractLength(item) + ' min',
            category: extractCategory(item),
            image: extractImage(item),
          };
        }),
      };

      res.status(200).send(previewContent);
    }

    res.status(404).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

function extractCategory(item) {
  const type = item.enclosure[0].$.type;

  switch (type) {
    case 'image/jpeg':
      return 'Blog Post';
    case 'audio/mpeg':
      return 'Podcast';
    case 'video/mpeg':
      return 'video';
    default:
      break;
  }
}

function extractLength(item) {
  const type = item.enclosure[0].$.type;

  const magicLengthNumber = 2100;

  switch (type) {
    case 'image/jpeg':
      return Math.floor(item['content:encoded'][0].length / magicLengthNumber);
    case 'audio/mpeg':
      return 'Podcast';
    case 'video/mpeg':
      return 'video';
    default:
      break;
  }
}

function extractImage(item) {
  const type = item.enclosure[0].$.type;

  switch (type) {
    case 'image/jpeg':
      return item.enclosure[0].$.url;
    case 'audio/mpeg':
      return 'https://via.placeholder.com/500x200?text=►';
    case 'video/mpeg':
      return 'https://via.placeholder.com/500x200?text=Video';
    default:
      break;
  }
}

//
// USER
//

// Get User's Network Data
router.get('/user/network', authenticate, async function(req, res) {
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

    const stats = await getStats(req.user);

    res.status(200).send({
      feed: feed,
      following: networkUsers,
      stats: stats,
      suggestedFollows: suggestedFollows,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
});

// Get User
router.get('/user/:userId', async function(req, res) {
  try {
    const user = await UserModel.findOne({ _id: req.params.userId }).lean();

    const stats = await getStats(user);
    res.status(200).send({
      user,
      stats: stats,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }
});

// REDIRECT TO SUBSCRIPTION
router.post('/user/subscription', authenticate, async function(req, res) {
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
});

// UPDATE PROFILE
router.put('/user', authenticate, async function(req, res) {
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
});

// FOLLOW USER & UNFOLLOW USER
router.put('/user/follow', authenticate, async function(req, res) {
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
});

module.exports = router;

//
async function getStats(user) {
  const globalStats = await UserModel.aggregate([
    {
      $group: {
        _id: 'globalStats',
        units_StdDev: { $stdDevPop: '$units' },
        units_Avg: { $avg: '$units' },
        globalCount: { $sum: 1 },
      },
    },
  ]);

  // convert "follows" strings into ObjectId's
  const objs = user.follows.map((userId) => ObjectId(userId));
  const networkStats = await UserModel.aggregate([
    {
      $match: {
        _id: { $in: [user._id, ...objs] },
      },
    },
    {
      $group: {
        _id: 'networkStats',
        units_StdDev: { $stdDevPop: '$units' },
        units_Avg: { $avg: '$units' },
        networkCount: { $sum: 1 },
      },
    },
  ]);

  return {
    global_StdDev: globalStats[0].units_StdDev,
    global_avg: globalStats[0].units_Avg,
    globalCount: globalStats[0].globalCount,
    network_StdDev: networkStats[0].units_StdDev,
    network_avg: networkStats[0].units_Avg,
    networkCount: networkStats[0].networkCount,
  };
}
