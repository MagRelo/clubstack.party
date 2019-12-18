import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Tabs, TabList, TabPanels, TabPanel } from '@reach/tabs';
import {
  lineItem,
  formatCurrency,
  CoolTab,
  Loading
} from 'components/util/random';

import PaymentsTable from './userPaymentsTable';
import ResponseList from './userResponseTable';
import JobTable from './userJobsTable';
import LinksTable from './userLinksTable';
import StreamList from './userStream';

import { AuthContext } from 'App';

function User(props) {
  const authContext = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [links, setLinks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [responses, setResponses] = useState([]);
  const [stream, setStream] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    let isSubscribed = true;

    // hit user API route, get all data
    getUser(authContext.clearSession).then(body => {
      if (isSubscribed) {
        setUserData(body.user);
        setJobs(body.links.filter(link => link.generation === 0));
        setLinks(body.links.filter(link => link.generation !== 0));
        setStream(body.stream);
        setResponses(body.responses);
        setPayments(body.payments);
        setIsLoading(false);
      }
    });

    // cleanup
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="row row-6-1">
      <div>
        <h3 className="section-header">Account</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <div className="user-profile clear-fix">
              <img src={userData.avatar} alt="avatar" className="user-avatar" />
              <div className="user-info">
                <div className="user-name">{userData.name}</div>
                <div className="user-location">{userData.location}</div>
              </div>
            </div>

            <Tabs style={{ marginTop: '1em' }}>
              <TabList style={{ marginBottom: '1em' }}>
                <CoolTab count={jobs.length}>Jobs</CoolTab>
                <CoolTab count={links.length}>Links</CoolTab>
                <CoolTab count={responses.length}>Applications</CoolTab>
                <CoolTab>Profile</CoolTab>
              </TabList>

              <TabPanels>
                {/* Jobs */}
                <TabPanel style={{ outline: 'none' }}>
                  <JobTable links={jobs} />
                </TabPanel>

                {/* Links */}
                <TabPanel style={{ outline: 'none' }}>
                  <LinksTable links={links} />
                </TabPanel>

                {/* Responses */}
                <TabPanel style={{ outline: 'none' }}>
                  <div>
                    <ResponseList responses={responses} />
                  </div>
                </TabPanel>

                <TabPanel style={{ outline: 'none' }}>
                  <div>
                    <h3 className="section-header">Account Balance</h3>
                    {lineItem('Pending Balance', formatCurrency(0))}

                    {userData.hasAccount ? (
                      lineItem('Account', userData.stripeAccountLabel)
                    ) : (
                      <p style={{ textAlign: 'center' }}>
                        <Link to="/user/account">Link Bank Account</Link>
                      </p>
                    )}
                  </div>

                  <h3 className="section-header">Payments</h3>
                  <PaymentsTable payments={payments} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        )}
      </div>

      {/* stream */}
      <div>
        <h3 className="section-header">Activity</h3>
        <StreamList stream={stream} userId={userData._id} />
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
  });
}
