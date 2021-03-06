import React, { useContext } from 'react';
// import { Link } from '@reach/router';

// import LineChart from 'components/lineChart';
import { SubscriptionLink } from 'components/random';
import UpdateProfile from 'pages/account/updateProfile';
import UserBankAccount from 'pages/account/userBankAccount';

// import LineChart from 'components/lineChart';
// import { BsFillChatDotsFill } from 'react-icons/bs';
// import { GoFileSubmodule } from 'react-icons/go';
// import { CgFeed } from 'react-icons/cg';
// import { MdEmail } from 'react-icons/md';

import { AuthContext } from 'App';
function User({ userId }) {
  const { user } = useContext(AuthContext);

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
          <h2>Account</h2>
        </div>

        <h3 className="background">
          <span>Manage Profile</span>
        </h3>

        <div className="panel">
          <UpdateProfile />
        </div>

        <h3 className="background">
          <span>Payment Account</span>
        </h3>

        <p>We deposit your earnings directly into your bank account.</p>

        <div className="panel">
          <UserBankAccount />
        </div>

        <h3 className="background">
          <span>Manage Subscriptions</span>
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae
          praesentium quam obcaecati ut non eaque? Fugiat omnis labore soluta
          itaque? Reiciendis, est magni? Autem et, eos corporis eum ex alias.
        </p>
        <SubscriptionLink active={!!user.subscriptions.length} />
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
