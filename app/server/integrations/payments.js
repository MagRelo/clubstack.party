//  Plaid Config
var plaid = require('plaid');
var plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments[process.env.PLAID_ENV],
  {
    version: '2019-05-29',
    clientApp: process.env.PLAID_CLIENT_APP_NAME
  }
);
console.log('Plaid mode:' + process.env.PLAID_ENV);

// Stripe
let stripeApiKey = '';
if (process.env.STRIPE_TEST_MODE) {
  stripeApiKey = process.env.STRIPE_TEST_KEY;
  console.log('Stripe mode: test, key: ' + stripeApiKey);
} else {
  stripeApiKey = process.env.STRIPE_LIVE_KEY;
  console.log('Stripe mode: LIVE!');
}
const stripe = require('stripe')(stripeApiKey);

//
// Methods
//

// https://stripe.com/docs/api/customers/create
exports.createStripeCustomer = async function(userData) {
  const userObject = {
    name: userData.firstname + ' ' + userData.lastname,
    email: userData.email,
    description: '(' + (process.env.STRIPE_TEST_MODE ? 'TEST' : 'LIVE') + ')',
    source: userData.token.id
  };
  // create stripe customer and attach
  // console.log('createStripeCustomer', userObject);
  return await stripe.customers.create(userObject);
};

exports.createStripeAccount = async function(userData, ipAddress) {
  // exchange plaid token for stripe token
  const accessToken = await plaidClient.exchangePublicToken(userData.token);
  const bankToken = await plaidClient.createStripeToken(
    accessToken.access_token,
    userData.metaData.account_id
  );

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
        day: dob_array[2]
      },
      ssn_last_4: userData.ssn
    },
    business_profile: {
      product_description:
        'User refers information and/or applicants to platform customers'
    },
    external_account: bankToken.stripe_bank_account_token,
    tos_acceptance: {
      date: userData.tos.date,
      ip: ipAddress,
      user_agent: userData.tos.user_agent
    },
    requested_capabilities: ['platform_payments']
  });

  return account;
};

exports.createStripeCharge = async function(
  stripeCustomerId,
  stripeToken,
  amount_in_cents,
  responseId
) {
  const chargeObject = {
    amount: amount_in_cents,
    currency: 'usd',
    customer: stripeCustomerId,
    source: stripeToken,
    description: 'Test payment',
    metadata: {
      responseId: responseId
    }
  };

  if (process.env.STRIPE_TEST_MODE) {
    delete chargeObject.customer;
    chargeObject.source = 'tok_visa';
  }

  console.log('Payment:', chargeObject);

  return stripe.charges.create(chargeObject);
};
