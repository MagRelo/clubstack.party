import React, { useState, useEffect, useContext } from 'react';
// import { Link } from '@reach/router';

import { Bouncing, SubscriptionLink } from 'components/random';
import UpdateProfile from 'pages/account/updateProfile';

// import LineChart from 'components/lineChart';
// import { BsFillChatDotsFill } from 'react-icons/bs';
// import { GoFileSubmodule } from 'react-icons/go';
// import { CgFeed } from 'react-icons/cg';
// import { MdEmail } from 'react-icons/md';

import { AuthContext } from 'App';
function User({ userId }) {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const apiUserId = userId ? userId : user._id;

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/user/' + apiUserId;
    callApi(method, endPoint)
      .then((body) => {
        // setDisplayUser(body.user);
        // setStats(body.stats);
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
        <Bouncing />
      ) : (
        <div className="container">
          <section>
            <div className="section-title">
              <h2>Account</h2>
            </div>

            {/* Profile */}
            <h3 className="background">
              <span>Manage Profile</span>
            </h3>

            <div className="panel">
              <UpdateProfile />
            </div>

            <div className="mb-4"></div>

            {/* Profile */}
            <h3 className="background">
              <span>Manage Subscriptions</span>
            </h3>
            <div className="mb-4"></div>

            <SubscriptionLink />
          </section>
        </div>
      )}
    </div>
  );
}

export default User;

// <div className="mb-4"></div>
// {/* Resources */}
// <h3 className="background">
//   <span>Resources</span>
// </h3>
// */}
//  <div className="grid grid-3">
//   <div className="panel mb-3">
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-around',
//       }}
//     >
//       <img src={ZoomLogo} alt="zoom" height="28px" />
//     </div>
//     <hr />
//     <p className="small">
//       Zoom is a live video-conferencing service.
//     </p>

//     <div className="text-center">
//       <a href="/slack" className="btn btn-sm btn-theme">
//         View Schedule
//       </a>
//     </div>
//   </div>

//   <div className="panel mb-3">
//     <div style={{ display: 'flex', justifyContent: 'space-around' }}>
//       <img src={Slack} alt="google" height="28px" />{' '}
//     </div>
//     <hr />
//     <p className="small">
//       Slack provides chat rooms (channels) organized by topic, private
//       groups, and direct messaging.
//     </p>

//     <div className="text-center">
//       <a href="/slack" className="btn btn-sm btn-theme">
//         Open Slack
//       </a>
//     </div>
//   </div>

//   <div className="panel mb-3">
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-around',
//       }}
//     >
//       <div>
//         <img src={GoogleDriveLogo} alt="google" height="28px" />{' '}
//         <b>Google Drive</b>
//       </div>
//     </div>
//     <hr />
//     <p className="small">
//       Google Drive is a file storage and synchronization service
//       developed by Google.
//     </p>

//     <div className="text-center">
//       <a href="/slack" className="btn btn-sm btn-theme">
//         Open Drive
//       </a>
//     </div>
//   </div>
// </div>
