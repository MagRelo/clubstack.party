import React, { useState, useEffect, useContext } from 'react';
// import { Link } from '@reach/router';

import { Loading } from 'components/random';

import UpdateProfile from 'pages/account/updateProfile';

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

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="grid grid-3">
            <div className="panel">
              <div className="box">
                <i className="fa fa-video fa-fw danger blue"></i>
                <div className="info">
                  <h3>24</h3>
                  <span> Videos</span>
                  <p>5,388 Views</p>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="box">
                <i className="fa fa-users fa-fw success red"></i>
                <div className="info">
                  <h3>242</h3>
                  <span> Subscribers</span>
                  <p>Active this Month</p>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="box">
                <i className="fa fa-file-invoice-dollar fa-fw green"></i>
                <div className="info">
                  <h3>$5,965</h3>
                  <span> per month</span>
                  <p>Recurring Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4"></div>

          {/* Email */}
          <h3 className="background">
            <span>Subscribers</span>
          </h3>

          <button className="btn btn-sm btn-theme">Manage Subscribers</button>

          {/* Subscription */}
          <h3 className="background">
            <span>Content</span>
          </h3>

          {/* Resources */}
          <h3 className="background">
            <span>Resources</span>
          </h3>

          {/* Profile */}
          <h3 className="background">
            <span>Profile</span>
          </h3>
          <UpdateProfile />
        </div>
      )}
    </div>
  );
}

export default User;
