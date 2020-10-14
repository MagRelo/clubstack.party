const UserModel = require('../models').UserModel;
const { activateUser, updateLatestLogin } = require('./user');

// Magic Auth
const { Magic } = require('@magic-sdk/admin');
const magic = new Magic(process.env.MAGIC_SECRET_KEY);
const passport = require('passport');
const MagicStrategy = require('passport-magic').Strategy;

const strategy = new MagicStrategy(async function(user, done) {
  // get user from Magic
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  const existingUser = await UserModel.findOne({ email: userMetadata.email });

  // console.log(userMetadata, existingUser, user);

  // First login
  if (existingUser && !existingUser.lastLoginAt) {
    const updatedUser = await activateUser(user, userMetadata);
    return done(null, updatedUser);
  }

  // next logins...
  if (existingUser) {
    /* Replay attack protection (https://go.magic.link/replay-attack) */
    if (user.claim.iat <= existingUser.lastLoginAt) {
      return done(null, false, {
        message: `Replay attack detected for user ${user.issuer}}.`,
      });
    }

    const updatedUser = await updateLatestLogin(user);
    return done(null, updatedUser);
  }

  console.log('unknown user:', userMetadata.email);
  return done(null, false, { message: 'unknown user' });
});
passport.use(strategy);

/* Defines what data are stored in the user session */
passport.serializeUser((user, done) => {
  done(null, user.issuer);
});

/* Populates user data in the req.user object */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findOne({ issuer: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

exports.logout = async function(issuer) {
  return magic.users.logoutByIssuer(issuer);
};

//
// Middleware
//
exports.authenticate = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: 'Not Authenticated' });
  }
  next();
};

exports.adminOnly = function(req, res, next) {
  if (!req.user.type === 'Admin') {
    return res.status(401).send({ error: 'Admin Only' });
  }
  next();
};

exports.getSubdomain = async function(req, res, next) {
  console.log('subdomains: ', req.subdomains.join());

  req.subdomain = req.subdomains.join();

  next();
};

exports.requireSubdomain = async function(req, res, next) {
  if (!req.subdomain) {
    return res.status(404).send({ error: 'No Subdomain' });
  }

  next();
};
