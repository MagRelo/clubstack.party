import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';

import { ImWarning } from 'react-icons/im';

import { magicLogin } from 'api/magic';
import { Bouncing } from 'components/random';

// Stripe setup
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_dMv1AAldL0wj69FLCG4c8jce00J8jWxWg9');
const successUrl = 'https://google.com';
const cancelUrl = 'https://bing.com';
const priceID = 'price_1HSPMlKDqYLeupJPUCOdWIju';

function Subscribe(props) {
  const { createSession } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function login(event) {
    event.preventDefault();

    setLoading(true);

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // test email
    await fetch(`/auth/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formObject.email }),
    })
      .then(async (response) => {
        const { userId, status } = await response.json();

        // Subscribe
        if (status === 'Pending') {
          // Email not found => User created => redirect them to Stripe to Subscribe
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceID, quantity: 1 }],
            mode: 'subscription',
            successUrl: successUrl,
            cancelUrl: cancelUrl,
            customerEmail: formObject.email,
            clientReferenceId: userId,
          });

          if (error) throw new Error(error);
          return;
        }

        // Login
        if (status === 'NewSubscriber' || status === 'Active') {
          // do magic thing
          const didToken = await magicLogin(formObject.email);

          // send to server
          return await fetch(`/auth/login`, {
            headers: new Headers({
              Authorization: 'Bearer ' + didToken,
            }),
            withCredentials: true,
            credentials: 'same-origin',
            method: 'POST',
          }).then(async (response) => {
            const user = await response.json();
            return createSession(user);
          });
        }

        console.error('TEST - Unhandled User Status');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMessage(error.message);
      });
  }

  return (
    <React.Fragment>
      <section>
        <div className="container">
          <div className="form-wrapper panel">
            <form name="loginForm" onSubmit={login}>
              <legend>Join Now</legend>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required={true}
                  className="form-control"
                />
              </div>

              <hr />

              <button className="btn btn-theme">
                {loading ? (
                  <span>
                    <Bouncing />
                  </span>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>

              <div className="mb-4"></div>

              {errorMessage ? (
                <div className="panel">
                  <div>
                    <ImWarning />
                    <span> Email Not Found</span>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Subscribe;

// <SubscribeButton />
