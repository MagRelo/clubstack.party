import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

import UserLogin from './loginForm';

function LoginButton(props) {
  // modal states
  const [loginOpen, setLoginOpen] = useState(false);

  function closeAndCreateSession() {
    setLoginOpen(false);
    props.createSession();
  }

  return (
    <React.Fragment>
      {props.activeSession ? (
        <button
          className="pure-button pure-button-primary"
          onClick={props.clearSession}
        >
          Logout
        </button>
      ) : (
        <React.Fragment>
          <Link to="/signup">Signup</Link>

          {/* LOGIN */}
          <button
            className="pure-button pure-button-primary"
            onClick={() => setLoginOpen(true)}
          >
            Login
          </button>
          <Dialog isOpen={loginOpen} onDismiss={() => setLoginOpen(false)}>
            <UserLogin createSession={closeAndCreateSession} />
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default LoginButton;
