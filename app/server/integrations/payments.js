//  Plaid Config
// var plaid = require('plaid');
// var plaidClient = new plaid.Client(
//   process.env.PLAID_CLIENT_ID,
//   process.env.PLAID_SECRET,
//   process.env.PLAID_PUBLIC_KEY,
//   plaid.environments[process.env.PLAID_ENV],
//   {
//     version: '2019-05-29',
//     clientApp: process.env.PLAID_CLIENT_APP_NAME,
//   }
// );
// console.log('Plaid mode:' + process.env.PLAID_ENV);

//

// User
const UserModel = require('../models').UserModel;
const { addUserToGroup, removeUserFromGroup } = require('./rocketchat');

// Stripe
const subscribeEndpointSecret = process.env.STRIPE_SUBSCRIBE_SECRET;
const subscribeReturnUrl =
  process.env.STRIPE_SUBSCRIBE_RETURN_URL || 'https://example.com/account';
let stripeApiKey = '';
if (process.env.STRIPE_LIVE_KEY) {
  stripeApiKey = process.env.STRIPE_LIVE_KEY;
  console.log('Stripe mode: LIVE!');
} else {
  stripeApiKey = process.env.STRIPE_TEST_KEY;
  console.log('Stripe mode: test, key: ' + stripeApiKey);
}
const stripe = require('stripe')(stripeApiKey);

//
// Methods
//
exports.createStripeCharge = async function(
  stripeCustomerId,
  stripeToken,
  amount_in_cents,
  otherDataObject
) {
  const chargeObject = {
    amount: amount_in_cents,
    currency: 'usd',
    customer: stripeCustomerId,
    source: stripeToken,
    description: 'Test payment',
    metadata: otherDataObject,
  };

  if (process.env.STRIPE_TEST_MODE) {
    delete chargeObject.customer;
    chargeObject.source = 'tok_visa';
  }

  console.log('Payment:', chargeObject);

  return stripe.charges.create(chargeObject);
};

// https://stripe.com/docs/api/customers/create
exports.createStripeCustomer = async function(userData, stripeCustomerId) {
  const userObject = {
    name: userData.firstname + ' ' + userData.lastname,
    email: userData.email,
    description: '(' + (process.env.STRIPE_TEST_MODE ? 'TEST' : 'LIVE') + ')',
    source: userData.token.id,
  };

  // add or update
  if (stripeCustomerId) {
    console.log('update');
    // update
    return await stripe.customers.update(stripeCustomerId, userObject);
  } else {
    // add
    return await stripe.customers.create(userObject);
  }
};

exports.deleteCustomerPaymentSource = async function(customerId, cardId) {
  return await stripe.customers.deleteSource(customerId, cardId);
};

exports.createStripeAccount = async function(userData, ipAddress) {
  // // exchange plaid token for stripe token
  // const accessToken = await plaidClient.exchangePublicToken(userData.token);
  // const bankToken = await plaidClient.createStripeToken(
  //   accessToken.access_token,
  //   userData.metaData.account_id
  // );

  // create "Stripe Connect" account with bank account
  const dob_array = userData.dob.split('-'); // "2019-06-13"
  const account = await stripe.accounts.create({
    type: 'custom',
    country: 'US',
    email: userData.email,
    business_type: 'individual',
    individual: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      dob: {
        year: dob_array[0],
        month: dob_array[1],
        day: dob_array[2],
      },
      ssn_last_4: userData.ssn,
    },
    business_profile: {
      product_description:
        'User refers information and/or applicants to platform customers',
    },
    // external_account: bankToken.stripe_bank_account_token,
    tos_acceptance: {
      date: userData.tos.date,
      ip: ipAddress,
      user_agent: userData.tos.user_agent,
    },
    requested_capabilities: ['platform_payments'],
  });

  return account;
};

// https://stripe.com/docs/api/external_account_bank_accounts/delete
exports.deleteStripeAccountSource = async function(accountId, sourceId) {
  return await stripe.accounts.deleteExternalAccount(accountId, sourceId);
};

exports.handleStripeEvent = async function(body, signature) {
  // reconstruct event
  let event = stripe.webhooks.constructEvent(
    body,
    signature,
    subscribeEndpointSecret
  );
  const session = event.data.object;
  console.log('New Event:', event);

  // New Subscriber
  if (event.type === 'checkout.subscription.created') {
    // Get Source User (subscriber)
    const sourceUser = await UserModel.findOne({
      email: session.customer_email,
    });
    if (!sourceUser) {
      throw new Error('No sourceUser: ' + session.customer_email);
    }

    // Get Target User
    const productCode = session.items.data[0].price.id;
    const targetUser = await UserModel.findOne({ productCode: productCode });
    if (!targetUser) {
      throw new Error('No targetUser: ' + productCode);
    }

    //
    // Add source to target channel
    //
    await addUserToGroup(
      targetUser.rocketChannel._id,
      sourceUser.rocketUser._id
    );

    //
    // Update target user
    //
    targetUser.subscribers.push(sourceUser._id);
    await targetUser.save();

    //
    // Update source user
    //
    sourceUser.subscriptions.push(targetUser._id);
    sourceUser.stripeEvents.push(event);
    // customerId?
    sourceUser.status = 'NewSubscriber';
    await sourceUser.save();

    return true;
  }

  // Cancel Subscriber
  if (event.type === 'customer.subscription.deleted') {
    // Source User
    const sourceUser = await UserModel.findOne({
      email: session.customer_email,
    });
    if (!sourceUser) {
      throw new Error('No sourceUser: ' + session.customer_email);
    }

    // Target User
    const productCode = session.items.data[0].price.id;
    const targetUser = await UserModel.findOne({ productCode: productCode });
    if (!targetUser) {
      throw new Error('No targetUser: ' + productCode);
    }

    //
    // Update Group
    //
    await removeUserFromGroup(
      targetUser.rocketChannel._id,
      sourceUser.rocketUser._id
    );

    //
    // Update target user
    //
    targetUser.subscribers.pull(sourceUser._id);
    await targetUser.save();

    sourceUser.subscriptions.pull({ _id: targetUser._id });
    sourceUser.stripeEvents.push(event);
    await sourceUser.save();
  }

  // shove event into a customer (if found) just in case
  return UserModel.updateOne(
    {
      $or: [
        { email: session.customer_email },
        { userId: session.client_reference_id },
        { stripeCustomerId: session.customer },
      ],
    },
    {
      $set: {
        stripeCustomerId: session.customer,
      },
      $push: {
        stripeEvents: event,
      },
    }
  );
};

exports.getSubscriberRedirectURL = async function(stripeCustomerId) {
  var session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: subscribeReturnUrl,
  });

  // console.log(session);

  return session.url;
};
