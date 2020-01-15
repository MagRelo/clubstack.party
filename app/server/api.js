var express = require('express');
var router = express.Router();

// Controllers
const {
  linkedinAuth,
  sendToken,
  getToken,
  authenticate,
  userStatus,
  getUser
} = require('./controllers/auth');

const {
  populateUser,
  updateFollow,
  getUserFriends,
  sendTweet,
  sendEmail,
  addAccount,
  deleteAccountSource,
  addCustomer,
  deleteCustomerPaymentSource
} = require('./controllers/user');
const {
  createQuery,
  updateQuery,
  getLink,
  createChildLink,
  getApplicationsByLink,
  getApplicationById
} = require('./controllers/link');
const {
  createResponse,
  getResponse,
  closeResponse
} = require('./controllers/response');

const { getAllData } = require('./controllers/admin');

const LinkModel = require('./models').LinkModel;
const SignupModel = require('./models').SignupModel;

//
// MISC
//

// const SendGrid = require('./integrations/sendgrid');

// search
router.get('/search', getToken, getUser, async function(req, res) {
  try {
    const results = await LinkModel.find({
      isBuried: false
    })
      .populate('user')
      .then(linkArray => {
        return linkArray.map(link => {
          let responseObj = {
            link: {
              _id: link._id,
              linkId: link.linkId,
              postedBy: link.user.name,
              userId: link.user._id,
              createdAt: link.createdAt,
              respondBonus: link.target_bonus,
              promoteBonus: link.potentialPayoffs[link.generation + 1]
            },
            query: {
              _id: null,
              title: link.title,
              bonus: link.bonus,
              type: link.type,
              data: link.data
            }
          };

          // not logged in
          if (!req.user) {
            responseObj.user = {
              isFollowingLink: false,
              isFollowingUser: false,
              isQueryOwner: false,
              isLinkOwner: false,
              isLoggedIn: false
            };
            return responseObj;
          }

          // logged in
          responseObj.user = {
            isFollowingLink:
              req.user.follows && req.user.follows.indexOf(link._id) > -1,
            isFollowingUser:
              req.user.follows && req.user.follows.indexOf(link.user._id) > -1,
            isQueryOwner: false,
            isLinkOwner: req.user._id.equals(link.user._id),
            isLoggedIn: true
          };

          return responseObj;
        });
      });

    res.status(200).send(results);
  } catch (error) {
    console.log(req.path, error);
    res.status(500).send(error);
  }
});

router.post('/signup', async function(req, res) {
  try {
    // const Signup = new SignupModel(req.body);
    // const dbResponse = await Signup.save();

    const response = await SignupModel.update(
      { email: req.body.email },
      req.body,
      { upsert: true }
    );
    console.log(response);

    // send to sendgrid
    // const sendGridResponse = await SendGrid.addContact(req.body);

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/admin', getToken, authenticate, getUser, getAllData);

//
// AUTH
router.post('/auth/linkedin/callback', linkedinAuth, sendToken);
router.get('/auth/status', getToken, authenticate, getUser, userStatus);

//
// USER
//

router.get('/user', getToken, authenticate, getUser, populateUser);
router.post('/user/follow', getToken, authenticate, getUser, updateFollow);
router.get('/user/friends', getToken, authenticate, getUser, getUserFriends);
router.post('/user/tweet', getToken, authenticate, getUser, sendTweet);
router.post('/user/email', getToken, authenticate, getUser, sendEmail);

// Stripe APis
router.post('/user/account', getToken, authenticate, getUser, addAccount);
router.delete(
  '/user/account',
  getToken,
  authenticate,
  getUser,
  deleteAccountSource
);
router.post('/user/customer', getToken, authenticate, getUser, addCustomer);
router.delete('/user/customer', getToken, getUser, deleteCustomerPaymentSource);

//
// LINK
//

router.post('/query/add', getToken, authenticate, getUser, createQuery);
router.put(
  '/query/update/:linkId',
  getToken,
  authenticate,
  getUser,
  updateQuery
);

router.get('/link/:linkId', getToken, getUser, getLink);
router.post('/link/add', getToken, authenticate, getUser, createChildLink);
router.get('/applications/:linkId', getToken, getUser, getApplicationsByLink);
router.get('/application/:responseId', getToken, getUser, getApplicationById);
router.post('/application/payment', getToken, getUser, closeResponse);

//
// RESPONSE
//

// create response
router.post('/response/add', getToken, authenticate, getUser, createResponse);

// get response
router.get(
  '/response/:responseId',
  getToken,
  authenticate,
  getUser,
  getResponse
);

// close response (create payment)
router.put(
  '/response/:responseId',
  getToken,
  authenticate,
  getUser,
  closeResponse
);

module.exports = router;
