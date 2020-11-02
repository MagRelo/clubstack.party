import React from 'react';
import { Link } from '@reach/router';
// ,{ useState, useEffect, useContext }

import LineChart from 'components/lineChart';
import { ToolGrid } from 'components/random';
// import UpdateProfile from 'pages/account/updateProfile';

// import LineChart from 'components/lineChart';
// import { BsFillChatDotsFill } from 'react-icons/bs';
// import { GoFileSubmodule } from 'react-icons/go';
// import { CgFeed } from 'react-icons/cg';
import { BiEdit } from 'react-icons/bi';

// import { AuthContext } from 'App';
function User({ userId }) {
  // const { callApi, user } = useContext(AuthContext);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  // const apiUserId = userId ? userId : user._id;

  // useEffect(() => {
  //   setLoading(true);
  //   const method = 'GET';
  //   const endPoint = '/api/user/' + apiUserId;
  //   callApi(method, endPoint)
  //     .then((body) => {
  //       // setDisplayUser(body.user);
  //       // setStats(body.stats);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setError(error.toString());
  //       setLoading(false);
  //     });
  // }, [apiUserId, callApi]);

  return (
    <div className="container">
      <section>
        <div className="section-title">
          <h2>Community</h2>
          <p>Connect Your People · Build A Network</p>
          {/* <div className="form-wrapper">
            <ToolGrid />
          </div> */}
        </div>

        <h3 className="background">
          <span> Revenue</span>
        </h3>

        <div className="grid grid-5-3">
          <div>
            <LineChart />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            <div className="box">
              <i className="fa fa-users fa-fw danger red"></i>
              <div className="info">
                <h3>7,209</h3>
                <span> Visitors</span>
                <p>this month</p>
              </div>
            </div>

            <div>
              <div className="box">
                <i className="fa fa-video fa-fw danger blue"></i>
                <div className="info">
                  <h3>+29%</h3>
                  <span> Growth</span>
                  <p>this month</p>
                </div>
              </div>
            </div>

            <div>
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
        </div>
        <h3 className="background">
          <span>Settings</span>
        </h3>

        <div className="grid grid-2">
          <div className="grid-left">
            <div className="grid-label">Status</div>
            <div>Active</div>

            <div className="grid-label">Pricing</div>
            <div>'$29/mo'</div>
            <div className="grid-label">7-Day Trial</div>
            <div>'Enabled'</div>
            <div className="grid-label">Copyright</div>
            <div>'Copyright'</div>
          </div>

          <div className="grid-left">
            <div className="grid-label">Email Schedule</div>
            <div>'Sunday 7PM'</div>
            <div className="grid-label">Email Send</div>
            <div>'Automatic'</div>

            <div className="grid-label">Video Settings</div>
            <div>Enabled</div>

            <div className="grid-label">Video Settings</div>
            <div>Enabled</div>
          </div>
        </div>

        <div className="mb-4"></div>
        <div className="text-center">
          <Link to="/community/subscribers" className="btn btn-theme btn-sm">
            Edit Settings <BiEdit />
          </Link>
        </div>

        <h3 className="background">
          <span>Members</span>
        </h3>

        <p>No members yet...</p>
      </section>
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
