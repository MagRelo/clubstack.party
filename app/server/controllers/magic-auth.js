const UserModel = require('../models').UserModel;

// Magic Auth
const { Magic } = require('@magic-sdk/admin');
const magic = new Magic(process.env.MAGIC_SECRET_KEY);
const passport = require('passport');
const MagicStrategy = require('passport-magic').Strategy;

const strategy = new MagicStrategy(async function(user, done) {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  const existingUser = await UserModel.findOne({
    $and: [
      { email: userMetadata.email },
      { status: { $in: ['NewSubscriber', 'Active'] } },
    ],
  });

  if (existingUser && existingUser.status === 'NewSubscriber') {
    return newSubscriber(user, userMetadata, done);
  }

  if (existingUser && existingUser.status === 'Active') {
    return login(user, done);
  }

  console.log('unknown user:', userMetadata.email);
  return done(null, false, { message: 'unknown user' });
});

passport.use(strategy);

/* User Signup */
const newSubscriber = async (user, userMetadata, done) => {
  console.log('new subscriber:', user);

  const updatedUser = await UserModel.findOneAndUpdate(
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

  return done(null, updatedUser);
};

/* User Login */
const login = async (user, done) => {
  /* Replay attack protection (https://go.magic.link/replay-attack) */
  if (user.claim.iat <= user.lastLoginAt) {
    return done(null, false, {
      message: `Replay attack detected for user ${user.issuer}}.`,
    });
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { issuer: user.issuer },
      { $set: { lastLoginAt: user.claim.iat } },
      { new: true }
    );

    return done(null, updatedUser);
  } catch (error) {
    console.log(error);
    done(error, null);
  }
};

exports.logout = async function(issuer) {
  return magic.users.logoutByIssuer(issuer);
};

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
