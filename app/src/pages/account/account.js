import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Bouncing } from 'components/random';
import LineChart from 'components/lineChart';
import UpdateProfile from 'pages/account/updateProfile';

import { BsFillChatDotsFill } from 'react-icons/bs';
import { GoFileSubmodule } from 'react-icons/go';
import { CgFeed } from 'react-icons/cg';
import { MdEmail } from 'react-icons/md';

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
              <h2>Community Website</h2>
              <p>Activate your website and start building your community</p>
            </div>

            <div className="mb-4"></div>

            {/* Website */}
            <h3 className="background">
              <span>Website Activity</span>
            </h3>

            <div className="mb-4"></div>

            <div className="grid grid-5-3">
              <div>
                <div className="h5 text-center">
                  <b>Website:</b>{' '}
                  {user.subdomain ? (
                    <a
                      href={'https://' + user.subdomain + '.clubstack.party'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'https://' + user.subdomain + '.clubstack.party'}
                    </a>
                  ) : null}
                </div>

                <div className="mb-4"></div>

                <LineChart />
              </div>

              <div className="">
                <div className="panel">
                  <div className="box">
                    <i className="fa fa-users fa-fw danger red"></i>
                    <div className="info">
                      <h3>7,209</h3>
                      <span> Visitors</span>
                      <p>this month</p>
                    </div>
                  </div>
                </div>
                <div className="mb-3"></div>
                <div className="panel">
                  <div className="box">
                    <i className="fa fa-video fa-fw danger blue"></i>
                    <div className="info">
                      <h3>24</h3>
                      <span> Videos</span>
                      <p>Active</p>
                    </div>
                  </div>
                </div>
                <div className="mb-3"></div>
                <div className="panel">
                  <div className="box">
                    <i className="fa fa-eye fa-fw danger blue"></i>
                    <div className="info">
                      <h3>24,234</h3>
                      <span> Views</span>
                      <p>this month</p>
                    </div>
                  </div>
                </div>
                <div className="mb-3"></div>
                <div>
                  <Link to="content" className="btn btn-sm btn-theme">
                    Manage Website
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Activate Community </h2>
              <p>
                There are <b>97</b> people on the waitlist
              </p>

              <div className="grid grid-4" style={{ padding: '20px 0' }}>
                <div>
                  <div className="icon-large">
                    <BsFillChatDotsFill />
                  </div>
                  Live Chat
                </div>
                <div>
                  <div className="icon-large">
                    <GoFileSubmodule />
                  </div>
                  File Sharing
                </div>
                <div>
                  <div className="icon-large">
                    <CgFeed />
                  </div>
                  Activity Feed
                </div>
                <div>
                  <div className="icon-large">
                    <MdEmail />
                  </div>
                  Email Newsletter
                </div>
              </div>
            </div>

            {/* Email */}
            <h3 className="background">
              <span>Subscribers</span>
            </h3>
            <div className="grid grid-5-3">
              <div>
                <LineChart />
              </div>

              <div className="">
                <div className="panel">
                  <div className="box">
                    <i className="fa fa-users fa-fw success red"></i>
                    <div className="info">
                      <h3>242</h3>
                      <span> Subscribers</span>
                      <p>this month</p>
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
                <div className="mb-3"></div>
                <div className="mb-3"></div>
                <div>
                  <Link to="subscribers" className="btn btn-sm btn-theme">
                    Manage Community
                  </Link>
                </div>
              </div>
            </div>
          </section>

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
