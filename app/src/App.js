import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';

// import { StripeProvider } from 'react-stripe-elements';
import Cookies from 'js-cookie';

// CSS
import '@reach/dialog/styles.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './index.css';
import './app.css';

import LandingPage from 'pages/landingPage';
import TOS_and_Privacy from 'pages/TOS_and_Privacy';
import About from 'pages/about';

import User from 'components/user';
import LinkPage from 'components/link';
import Search from 'components/search';
import Response from 'components/response';

// Header
import LoginButton from 'components/loginButton';

// testing
// import createUser from 'components/createUser';
// import createLink from 'components/createLink';
// <Route path="/adduser" component={createUser} />
// <Route path="/addlink" component={createLink} />

// import createQuery from 'components/createQuery';
import createQuery2 from 'components/createQuery-AL';

function App(props) {
  const [activeSession, setActiveSession] = useState(false);

  useEffect(
    () => {
      const servesaCookie = Cookies.get('servesa-auth-token');
      if (servesaCookie) {
        // hit server and see if logged in
        getUser().then(isLoggedIn => {
          if (isLoggedIn) {
            setActiveSession(true);
          } else {
            Cookies.remove('servesa-auth-token');
            setActiveSession(false);
          }
        });
      }
    },
    [activeSession]
  );

  function createSession(user) {
    Cookies.set('servesa-auth-token', user.token);
    setActiveSession(true);
    props.history.push('/user');
  }

  function clearSession() {
    Cookies.remove('servesa-auth-token');
    setActiveSession(false);
    props.history.push('/');
  }

  return (
    <div className="container">
      <nav className="header">
        <div className="menu">
          <NavLink exact={true} activeClassName="is-active" to={'/search'}>
            Search
          </NavLink>
          {activeSession ? (
            <NavLink activeClassName="is-active" to={'/user'}>
              My Account
            </NavLink>
          ) : null}

          <span>|</span>

          <LoginButton
            activeSession={activeSession}
            createSession={createSession}
            clearSession={clearSession}
          />
        </div>

        <h1>
          <Link to="/">incentive.exchange</Link>
        </h1>

        <h2>Business protocol layer</h2>
      </nav>

      <div className="content-wrapper">
        {activeSession ? (
          <Switch>
            {/* Auth required */}
            <Route path="/addquery" component={createQuery2} />
            <Route path="/response/:responseId" component={Response} />
            <Route path="/user" component={User} />

            <Route path="/search" component={Search} />
            <Route path="/link/:linkId" component={LinkPage} />
            <Route path="/terms" component={TOS_and_Privacy} />
            <Route path="/about" component={About} />
            <Route component={LandingPage} />
          </Switch>
        ) : (
          <Switch>
            <Route path="/search" component={Search} />
            <Route path="/link/:linkId" component={LinkPage} />
            <Route path="/terms" component={TOS_and_Privacy} />
            <Route path="/about" component={About} />
            <Route component={LandingPage} />
          </Switch>
        )}
      </div>

      <footer>
        <ul>
          <li>incentive.exchange</li>
          <li>
            <Link to="/terms">Terms of Service & Privacy</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default withRouter(App);

async function getUser() {
  const apiEndpoint = '/api/user/status';

  return await fetch(apiEndpoint)
    .then(r => {
      return r.status === 200 ? true : false;
    })
    .catch(error => {
      console.error(error);
      return false;
    });
}
