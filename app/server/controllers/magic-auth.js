const UserModel = require('../models').UserModel;

/* 1️⃣ Setup Magic Admin SDK */
const { Magic } = require('@magic-sdk/admin');
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

/* 2️⃣ Implement Auth Strategy */
const passport = require('passport');
const MagicStrategy = require('passport-magic').Strategy;

const strategy = new MagicStrategy(async function(user, done) {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
  const existingUser = await UserModel.findOne({ email: userMetadata.email });
  if (!existingUser) {
    console.log('unknown user:', userMetadata.email);
    return done(null, false, { message: 'unknown user' });
  } else if (!existingUser.lastLoginAt) {
    /* Login user if otherwise */
    return newSubscriber(user, userMetadata, done);
  } else {
    /* Login user if otherwise */
    return login(user, done);
  }
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

  const updatedUser = await UserModel.findOneAndUpdate(
    { issuer: user.issuer },
    { $set: { lastLoginAt: user.claim.iat } },
    { new: true }
  );

  return done(null, updatedUser);
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

exports.authenticate = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: 'Not Authenticated' });
  }
  next();
};
