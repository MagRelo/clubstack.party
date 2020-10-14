var express = require('express');
var router = express.Router();

const passport = require('passport');
const magicLogout = require('./controllers/magic-auth').logout;
const { createUser } = require('./controllers/user');
const payments = require('./integrations/payments');

const UserModel = require('./models').UserModel;

//
// AUTH
router.post('/login', passport.authenticate('magic'), (req, res) => {
  return res.status(200).send(req.user);
});

router.post('/logout', async (req, res) => {
  if (req.isAuthenticated()) {
    await magicLogout(req.user.issuer);
    req.logout();
    return res.status(200).end();
  } else {
    return res.status(401).end(`User is not logged in.`);
  }
});

router.get('/status', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: 'Not Authenticated' });
  }
  return res.status(200).send(req.user);
});

router.post('/email', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      // Return User
      return res
        .status(200)
        .send({ email: user.email, userId: user.userId, status: user.status });
    } else {
      // Create User
      const { email, userId, status } = await createUser(req.body.email);
      return res.status(201).send({ email, userId, status });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).end(`Server Error`);
  }
});

router.post('/stripe/webhook', async (request, res) => {
  const signature = request.headers['stripe-signature'];

  // console.log(request.rawBody);

  try {
    await payments.handleStripeEvent(request.rawBody, signature);
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).end(`Server Error`);
  }
});

module.exports = router;
