import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { FaEdit } from 'react-icons/fa';

import {
  // formatCurrency,
  Loading,
  JobBoard,
  ProfilePic
} from 'components/random';

// import PaymentsTable from './userPaymentsTable';
// import ResponseList from './userResponseTable';
// import JobTable from './userJobsTable';
import LinksTable from './userLinksTable';
// import UserProfileForm from 'pages/user/userProfileForm';

import { AuthContext } from 'App';

function User(props) {
  const { clearSession, user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(user);
  const [links, setLinks] = useState([]);
  // const [jobs, setJobs] = useState([]);
  // const [payments, setPayments] = useState([]);
  // const [responses, setResponses] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    let isSubscribed = true;

    // hit user API route, get all data
    getUser(clearSession).then(body => {
      if (isSubscribed) {
        setUserData(body.user);
        // setJobs(body.links.filter(link => link.generation === 0));
        setLinks(body.links.filter(link => link.generation !== 0));

        // setResponses(body.responses);
        // setPayments(body.payments);
        setIsLoading(false);
      }
    });

    // cleanup
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="container user-container">
      <div className="grid grid-x-2">
        <div>
          <h1 style={{ margin: 0 }}>Your Job Board</h1>
        </div>
        <div>
          <JobBoard jobBoardId={userData.jobBoardId} />
        </div>
      </div>

      <div className="mb-4"></div>

      <div>
        <div>
          {isLoading ? (
            <Loading />
          ) : (
            <div>
              <div className="panel">
                <div className="user-profile">
                  <Link
                    to="/profile"
                    style={{ float: 'right' }}
                    className="btn btn-sm btn-unstyled"
                  >
                    Edit Profile <FaEdit />
                  </Link>

                  <ProfilePic avatarUrl={userData.avatar} />
                  <div className="user-info">
                    <div className="user-name">{userData.displayName}</div>
                    <p>{userData.description}</p>
                  </div>
                </div>

                <LinksTable links={links} />

                <div style={{ textAlign: 'center' }}>
                  <Link to="/search" className="btn btn-theme btn-sm">
                    Search for Jobs
                  </Link>
                </div>
              </div>

              <section>
                <div className="container section-title">
                  <h2>Side Hustles</h2>
                  <p>Other Ways to Earn Money on Talent Relay</p>
                </div>

                <div className="grid grid-2 text-center">
                  <div className="panel">
                    <h3>Onboard Employers → Get Paid</h3>
                    <p>
                      <i>Sign-up Employers and get 5% of every job posted.</i>
                    </p>
                  </div>

                  <div className="panel">
                    <h3>Onboard Candidates → Get Paid</h3>
                    <p>
                      <i>Sign-up Employers and get 5% of every job posted.</i>
                    </p>
                  </div>

                  <div className="panel">
                    <h3>Get Hired → Get Paid</h3>
                    <p>
                      <i>Every job on Talent Relay includes a hiring bonus</i>
                    </p>
                    <div style={{ textAlign: 'center' }}>
                      <Link to="/search" className="btn btn-theme btn-sm">
                        Search for Jobs
                      </Link>
                    </div>
                  </div>

                  <div className="panel">
                    <h3>For Employers</h3>

                    <div style={{ textAlign: 'center' }}>
                      {userData.hasPaymentSource ? (
                        <Link to="/addquery" className="btn btn-theme btn-sm">
                          Post a Job
                        </Link>
                      ) : (
                        <div>
                          <p>
                            <i>
                              Add a payment source to your{' '}
                              <Link to="/profile">profile</Link> in order to
                              post a job
                            </i>
                          </p>
                          <button disabled className="btn btn-theme btn-sm">
                            Create Employer Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;

async function getUser(clearSession) {
  return await fetch('/api/user').then(response => {
    if (response.status === 200) {
      return response.json();
    }

    // some type of error has occured...
    if (response.status === 401) {
      // logout with context function
      console.log(response.status, 'logging out...');
      clearSession();
    }

    console.log(response.status);
    return {};
  });
}
