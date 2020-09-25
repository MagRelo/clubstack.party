import React, { useState, useEffect, useContext } from 'react';
import { navigate } from '@reach/router';

import { BiLinkExternal } from 'react-icons/bi';

import UpdateProfile from 'pages/account/updateProfile';
import { Loading } from 'components/random';
import { AuthContext } from 'App';

function User({ userId }) {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [displayUser, setDisplayUser] = useState(false);
  const [stats, setStats] = useState(false);

  // if not userId => we're on /account
  const isMe = !userId;
  const apiUserId = userId ? userId : user._id;

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/user/' + apiUserId;
    callApi(method, endPoint)
      .then((body) => {
        setDisplayUser(body.user);
        setStats(body.stats);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.toString());
        setLoading(false);
      });
  }, [apiUserId, callApi]);

  function redirectToStripe(params) {
    const method = 'POST';
    const endPoint = '/api/user/subscription';
    callApi(method, endPoint)
      .then((body) => {
        // redirect
        console.log(body.url);

        navigate(body.url);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.toString());
        setLoading(false);
      });
  }

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="grid grid-3-5">
            <div>Something</div>

            <div>
              {/* Profile */}
              <h3 className="background">
                <span>Profile</span>
              </h3>
              <UpdateProfile />

              {/* Email */}
              {/* <h3 className="background">
            <span>Email Preferences</span>
          </h3> */}

              {/* Subscription */}
              <h3 className="background">
                <span>Subscription</span>
              </h3>
              <p>This will redirect you to a new page</p>
              <button
                className="btn btn-sm btn-theme"
                onClick={redirectToStripe}
              >
                Manage Subscription <BiLinkExternal />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
