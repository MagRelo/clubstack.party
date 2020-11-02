var express = require('express');
var router = express.Router();

// Middleware
const { authenticate, adminOnly } = require('./controllers/magic-auth');
const UserModel = require('./models').UserModel;
const { getSubstackContent } = require('./integrations/substack');

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
router.get('/user/:userId', User.populateUser);
router.post('/user/waitlist/', User.joinWaitlist);

// USER + AUTH
router.put('/user', authenticate, User.updateProfile, User.populateUser);
router.post('/user/subscription', authenticate, User.manageSubscriptionLink);
router.put('/user/follow', authenticate, User.userFollow);
// router.get('/user/network', authenticate, User.getUserNetwork);

//
// GROUPS
//
const Group = require('./controllers/group');
router.get('/group', Group.getAllGroups);
router.get('/group/:subdomain', Group.getGroup);
router.post('/group/', authenticate, Group.createGroup, User.populateUser);
router.put('/group/', authenticate, Group.updateGroup, User.populateUser);

//
// ADMIN
//
const Admin = require('./controllers/admin');
router.get('/admin/subdomain/', authenticate, adminOnly, Admin.listSubdomains);
router.get(
  '/admin/subdomain/:subdomain',
  authenticate,
  adminOnly,
  User.getUserBySubdomain_Admin
);
router.put(
  '/admin/subdomain/',
  authenticate,
  adminOnly,
  Admin.activateSubdomain
);
// router.post('/user/subscription', authenticate, User.manageSubscriptionLink);
// router.put('/user', authenticate, User.updateProfile);
// router.put('/user/follow', authenticate, User.userFollow);
// router.get('/user/network', authenticate, User.getUserNetwork);

// ------------------------------
// ------------------------------
// ------------------------------

//
// TEMP
//

router.post('/preview', async function(req, res) {
  // reformat
  const previewDefaults = {
    title: 'Default Title',
    description: 'Default Description',
    copyright: 'Matt Lovan',
    headerImage: {
      url: 'https://picsum.photos/id/1/200/300',
      title: 'Default Image',
    },
    items: [],
  };

  try {
    // get Clubstack content
    const clubStackContent = await UserModel.findOne({
      subdomain: req.body.url,
    }).lean();
    const clubdata = clubStackContent ? clubStackContent.subdomainData : null;

    // get SubStack
    const subStackContent = await getSubstackContent(req.body.url);

    res.status(200).send({
      ...previewDefaults,
      ...subStackContent,
      ...clubdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
