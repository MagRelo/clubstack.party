import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';
// import { Link } from '@reach/router';

import { ImWarning } from 'react-icons/im';

import { magicLogin } from 'api/magic';
import { Bouncing } from 'components/random';

function Login(props) {
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

    try {
      // test email
      const { status } = await fetch(`/auth/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formObject.email }),
      });

      if (status === 200 || status === 201) {
        // do magic thing
        const didToken = await magicLogin(formObject.email);

        return fetch(`/auth/login`, {
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
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>
      <section>
        <div className="container" style={{ paddingTop: '40px' }}>
          <div className="form-wrapper panel">
            <form name="loginForm" onSubmit={login}>
              <legend>Sign In</legend>

              <p>We'll send a link to your email address.</p>

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
                  <span>Sign In</span>
                )}
              </button>

              <div className="mb-4"></div>

              {errorMessage ? (
                <div>
                  <ImWarning />{' '}
                  <span>{errorMessage ? errorMessage : null}</span>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Login;
