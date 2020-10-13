var express = require('express');
var router = express.Router();

// Middleware
const { authenticate, adminOnly } = require('./controllers/magic-auth');
const UserModel = require('./models').UserModel;

//
// CONTENT
//
const Content = require('./controllers/content');
router.get('/content', Content.getContentByUser);
router.get('/content/:id', Content.getContentItem);
router.post('/content', authenticate, Content.addContentItem);
router.put('/content', authenticate, Content.upsertContentItem);
router.delete('/content/:id', authenticate, Content.deleteContentItem);

//
// USER
//
const User = require('./controllers/user');
router.get('/user/:userId', User.getUser);
router.get('/user/subdomain/:subdomain', User.getUserBySubdomain);
router.post('/user/waitlist/', User.joinWaitlist);

// USER AUTH
router.put('/user', authenticate, User.updateProfile);
router.put('/user/subdomain/', authenticate, User.updateSubdomain);
router.put('/user/follow', authenticate, User.userFollow);
router.post('/user/subscription', authenticate, User.manageSubscriptionLink);
// router.get('/user/network', authenticate, User.getUserNetwork);

//
// ADMIN
//
const Admin = require('./controllers/admin');
router.put(
  '/admin/subdomain/',
  authenticate,
  adminOnly,
  Admin.activateSubdomain
);
router.get('/admin/subdomain/', authenticate, adminOnly, Admin.listSubdomains);
// router.post('/user/subscription', authenticate, User.manageSubscriptionLink);
// router.put('/user', authenticate, User.updateProfile);
// router.put('/user/follow', authenticate, User.userFollow);
// router.get('/user/network', authenticate, User.getUserNetwork);

//
// TEMP
//
const fetch = require('node-fetch');
const { convertToJSON } = require('./integrations/xml');
router.post('/preview', async function(req, res) {
  const subdomain = req.body.url;

  // reformat
  const previewContent = {
    title: 'Party',
    description: `Surfin' USA`,
    copyright: 'Matt Lovan',
    headerImage: '',
    items: [],
  };
  let clubStackContent;
  let subStackContent;

  try {
    // get Clubstack
    clubStackContent = await UserModel.findOne({ subdomain: subdomain }).lean();
    // clubStackContent = {};

    // get RSS
    const url = req.body.url;
    const fullUrl = 'https://' + url + '.substack.com/feed';
    const substack = await fetch(fullUrl)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('failed to fetch from substack');
        }
        return response.text();
      })
      .then((xml) => convertToJSON(xml));

    if (substack) {
      const site = substack.rss.channel[0];

      // reformat
      subStackContent = {
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
    }

    res.status(200).send({
      ...previewContent,
      ...subStackContent,
      ...clubStackContent.subdomainData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

function extractCategory(item) {
  if (item.enclosure && item.enclosure[0]) {
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

  return 'General';
}

function extractLength(item) {
  if (item.enclosure && item.enclosure[0]) {
    const type = item.enclosure[0].$.type;
    const magicLengthNumber = 2100;

    switch (type) {
      case 'image/jpeg':
        return Math.floor(
          item['content:encoded'][0].length / magicLengthNumber
        );
      case 'audio/mpeg':
        return 15;
      case 'video/mpeg':
        return 15;
      default:
        break;
    }
  }
  return 15;
}

function extractImage(item) {
  if (item.enclosure && item.enclosure[0]) {
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
}

module.exports = router;
