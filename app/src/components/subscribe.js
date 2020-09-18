import React, { useState } from 'react';

// Stripe setup
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_dMv1AAldL0wj69FLCG4c8jce00J8jWxWg9');
const successUrl = 'https://google.com';
const cancelUrl = 'https://bing.com';
const priceID = 'price_1HSPMlKDqYLeupJPUCOdWIju';

function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async (event) => {
    setIsLoading(true);

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceID, quantity: 1 }],
      mode: 'subscription',
      successUrl: successUrl,
      cancelUrl: cancelUrl,
    });

    if (error) console.log(error);
  };

  return (
    <button onClick={handleClick} className="btn btn-theme">
      {isLoading ? (
        <div className="spinner">
          <div />
        </div>
      ) : (
        <span>Join Free for 7 Days</span>
      )}
    </button>
  );
}

export default SubscribeButton;
