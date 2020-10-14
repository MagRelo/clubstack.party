import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';

import { Bouncing } from 'components/random';
import { ImWarning } from 'react-icons/im';

// Stripe setup
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const domain = process.env.REACT_APP_STRIPE_DOMAIN;

function SubscribePage({ priceId, subdomain, title }) {
  return (
    <div>
      {priceId ? (
        <Subscribe
          priceId={priceId}
          caption={'Join Now'}
          legend={'Join ' + title}
          subdomain={subdomain}
        />
      ) : (
        <JoinWaitlist
          caption={'Join the Waitlist'}
          legend={'Launching Soon! Join the Waitlist'}
          subdomain={subdomain}
        />
      )}
    </div>
  );
}

export default SubscribePage;

export function Subscribe({ legend, caption, priceId, subdomain }) {
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
        const { userId } = await response.json();

        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          successUrl: 'https://' + subdomain + '.' + domain + '/login',
          cancelUrl: 'https://' + subdomain + '.' + domain + '/',
          customerEmail: formObject.email,
          clientReferenceId: userId,
        });

        if (error) throw new Error(error);
        return;
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMessage(error.message);
      });
  }

  return (
    <div className="">
      <form name="loginForm" onSubmit={login}>
        {legend ? <legend>{legend}</legend> : null}
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
            <span>{caption}</span>
          )}
        </button>

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
  );
}

export function JoinWaitlist({ legend, caption, subdomain }) {
  const { callApi } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

    await callApi('POST', 'api/user/waitlist', {
      email: formObject.email,
      subdomain: subdomain,
    })
      .then(async (response) => {
        // confirm susccess
        setLoading(false);
        setSuccessMessage(`Done! You're on the list.`);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMessage(error.message);
      });
  }

  return (
    <div className="">
      <form name="loginForm" onSubmit={login}>
        {legend ? <legend>{legend}</legend> : null}
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
            <span>{caption}</span>
          )}
        </button>

        {errorMessage ? (
          <div>
            <div className="mb-3"></div>
            <ImWarning /> <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div>
            <div className="mb-3"></div>
            <span>{successMessage}</span>
          </div>
        ) : null}
      </form>
    </div>
  );
}

// export default Subscribe;

// <SubscribeButton />
