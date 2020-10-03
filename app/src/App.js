import React, { useState, useEffect } from 'react';
import { Router, navigate } from '@reach/router';

import { OnRouteChange } from 'routingHack.js';

import Helmet from 'react-helmet';
// import Cookies from 'js-cookie';
import { Loading } from './components/random';

// Header
// import Header from 'components/header';
import Footer from 'components/footer';

// Routes
// import Home from 'pages/home';
// import LandingPage from 'pages/landingPage';
import Preview from 'pages/preview';
import Login from 'pages/login';
import Subscribe from 'pages/subscribe';
import Terms from 'pages/legal';
import About from 'pages/about';
import NotFound from 'pages/404';

import Dashboard from 'pages/account/dashboard';
import Account from 'pages/account/account';
import Admin from 'pages/admin/admin';
import Subscribers from 'pages/admin/subscribers';
import Resources from 'pages/admin/resources';
import Content from 'pages/admin/content';
import AddContent from 'pages/admin/editContent';
import EditContent from 'pages/admin/editContent';

// Setup Auth context
export const AuthContext = React.createContext({});

function App() {
  const nonAuthPages = [
    '/',
    '/login',
    '/about',
    '/terms',
    '/subscribe',
    '/preview',
  ];
  const pathname = window.location.pathname;
  const isAuthPage = !~nonAuthPages.indexOf(pathname);
  // console.log(pathname, 'redirect?', isAuthPage);

  const [loadingSession, setLoadingSession] = useState(isAuthPage);
  const [activeSession, setActiveSession] = useState(false);
  const [user, setUser] = useState({});

  // get session status
  useEffect(() => {
    fetch('/auth/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      // success (201's?)
      if (response.status === 200) {
        const user = await response.json();
        setUser(user);
        setActiveSession(true);
        setLoadingSession(false);
        return;
      }

      console.log(response.status, response.statusText);
      if (response.status === 401) {
        setLoadingSession(false);
        return clearSession();
      }
    });
  }, []);

  async function callApi(method, endPoint, body) {
    return fetch(endPoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      // success (201's?)
      if (response.status === 200 || response.status === 201) {
        return response.json();
      }

      if (response.status === 401) {
        clearSession();
      }

      // some type of error has occured...
      console.log(response.status, response.statusText);
      throw new Error(response.statusText);
    });
  }

  function createSession(user, redirect) {
    // update context
    setUser(user);
    setActiveSession(true);

    if (redirect) {
      navigate(redirect);
      // } else if (user.needsOnboarding) {
      //   navigate('/onboarding');
      // } else if (!user.displayName) {
      //   navigate('/profile');
    } else {
      navigate('/dashboard');
    }
  }

  function updateUser(user) {
    // update context
    setUser(user);
  }

  function clearSession() {
    const pathname = window.location.pathname;
    const isAuthPage = !~nonAuthPages.indexOf(pathname);

    // logout on backend
    setActiveSession(false);
    setUser({});

    if (isAuthPage) {
      return navigate('/login');
    }
  }

  async function logout() {
    await fetch('auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      // success (201's?)
      if (response.status === 200 || response.status === 201) {
        return clearSession();
      }
      // some type of error has occured...
      console.log(response.status, response.statusText);
      // throw new Error(response.statusText);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        activeSession,
        createSession,
        clearSession,
        callApi,
        user,
        updateUser,
        logout,
      }}
    >
      {MetaData()}

      <div className="page-wrapper">
        {/* <Header /> */}

        {loadingSession ? (
          <Loading />
        ) : (
          <div className="content-wrapper">
            <Router>
              <Preview path="/" />
              <Terms path="/terms" />
              <About path="/about" />

              <Preview path="/preview" />

              <Login path="/login" />
              <Subscribe path="/subscribe" />
              {/* Auth required */}
              {activeSession ? (
                <React.Fragment>
                  <Dashboard path="/dashboard" />
                  <Account path="/account" />

                  {/* Admin */}
                  <Subscribers path="/admin/subscribers" />
                  <Resources path="/admin/resources" />
                  <Content path="/admin/content" />

                  <AddContent path="/admin/content/add" />
                  <EditContent path="/admin/content/:contentId" />

                  <Admin path="/admin" />
                </React.Fragment>
              ) : null}

              <NotFound default />
            </Router>

            <OnRouteChange
              action={() => {
                window.scrollTo(0, 0);
              }}
            ></OnRouteChange>
          </div>
        )}
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;

function MetaData() {
  return (
    <Helmet>
      <title>ClubStack</title>
      <meta name="description" content="User-Generated Communities" />
      <link rel="canonical" href={'https://clubstack.party'} />

      <meta property="og:site_name" content="ClubStack" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={'https://clubstack.party'} />
      <meta property="og:image:secure_url" content="https://clubstack.party" />
      <meta
        property="og:image"
        content="https://clubstack.party/logo_share.png"
      />
      <meta property="og:image:type" content="png" />
      <meta property="og:image:height" content="201" />
      <meta property="og:image:width" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@i_dot_e" />
      <meta name="twitter:title" content="ClubStack" />
      <meta name="twitter:description" content="ClubStack" />
      <meta
        name="twitter:image"
        content="https://clubstack.party/logo_share.png"
      />
    </Helmet>
  );
}
