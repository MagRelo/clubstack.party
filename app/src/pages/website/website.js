import React, { useContext } from 'react';
import { Link } from '@reach/router';

// import { SiteGrid } from 'components/random';
import LineChart from 'components/lineChart';
// import VideoCard from 'components/videoCard';
import ContentCard from 'components/contentCard';
import { BiBookAdd, BiEdit } from 'react-icons/bi';

import { AuthContext } from 'App';
function Website() {
  const { user } = useContext(AuthContext);

  const website = user.group
    ? `https://${user.group.subdomain}.clubstack.party`
    : 'not active';

  return (
    <div className="container">
      <section>
        <div className="section-title">
          <h2>Publishing</h2>
          <p>Find Your People · Build Your Audience</p>
          {/* 
          <div className="form-wrapper">
            <SiteGrid />
          </div> */}
        </div>

        {/* Website */}
        <h3 className="background">
          <span>Audience</span>
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

            <div className="box">
              <i className="fa fa-video fa-fw danger blue"></i>
              <div className="info">
                <h3>+29%</h3>
                <span> Growth</span>
                <p>in Content Engagement</p>
              </div>
            </div>
            <div className="box">
              <i className="fa fa-file-invoice-dollar fa-fw green"></i>
              <div className="info">
                <h3>73%</h3>
                <span> open rate</span>
                <p>on Weekly Newsletter</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="background">
          <Link to="/website/content">
            <span>Content</span>
          </Link>
        </h3>

        <div className="grid grid-3">
          {user.content &&
            user.content.map((item) => {
              return (
                <div key={item._id}>
                  <ContentCard {...item} />
                </div>
              );
            })}

          <div className=" text-center">
            <p>Add a new peice of content</p>
            <Link to="/website/content/add" className="btn btn-theme btn-sm">
              Add Content <BiBookAdd />
            </Link>
          </div>
        </div>

        <h3 className="background">
          <span>Settings</span>
        </h3>

        <div className="grid grid-2">
          <div className="grid-left">
            <div className="grid-label">Status</div>
            <div>Active</div>
            <div className="grid-label">Web Address</div>
            <div>{website}</div>
            <div className="grid-label">Start Date</div>
            <div>12/21/2019</div>
            <div className="grid-label">Email Schedule</div>
            <div>'Sunday 7PM'</div>
            <div className="grid-label">Email Send</div>
            <div>'Automatic'</div>
          </div>

          <div className="grid-left">
            <div className="grid-label">Title</div>
            <div>{user?.group.title}</div>
            <div className="grid-label">Description</div>
            <div>{trimString(user?.group.description)}</div>
            <div className="grid-label">Copyright</div>
            <div>{user?.group.copyright}</div>
            <div className="grid-label">Email Schedule</div>
            <div>'Sunday 7PM'</div>
            <div className="grid-label">Email Send</div>
            <div>'Automatic'</div>
          </div>
        </div>

        <div className="mb-4"></div>
        <div className="text-center">
          <Link to="/website/settings" className="btn btn-theme btn-sm">
            Edit Settings <BiEdit />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Website;

function trimString(input) {
  if (typeof input == 'string') {
    // console.log(input.substr(0, 42));
    return input.substr(0, 42) + '...';
  }

  console.log(typeof input);
  return '';
}

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
