import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';

import { FormStatusButtons } from 'components/random';

import { magicLogin } from 'api/magic';

function Login(props) {
  const { createSession } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [email, setEmail] = useState(null);

  async function login(event) {
    event.preventDefault();

    setLoading(true);

    try {
      // test email
      const { status } = await fetch(`/auth/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (status === 200 || status === 201) {
        // do magic thing
        const didToken = await magicLogin(email);

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <hr />

              <FormStatusButtons
                saveFunction={login}
                saveLabel={'Sign In'}
                isDirty={true}
                isLoading={loading}
                errorMessage={errorMessage}
              />
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Login;
