import React, { useState, useEffect, useContext } from 'react';
// import { Link } from '@reach/router';

import { Bouncing } from 'components/random';

import { GroupPic } from './allGroups';

import { AuthContext } from 'App';

function Group({ subdomain }) {
  const { callApi } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [group, setGroup] = useState(false);

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/group/' + subdomain;
    callApi(method, endPoint)
      .then((body) => {
        setGroup(body);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.toString());
        setLoading(false);
      });
  }, [subdomain, callApi]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? <Bouncing /> : null}
      {group ? (
        <div className="grid grid-5-3">
          <div>
            <GroupHeader displayName={'Clubhouse'} subdomain={'clubhouse'} />

            {/* <div className="grid-left">
              <div className="grid-label">Website Address</div>
              <div>https://clubstack.com</div>
              <div className="grid-label">Chat Room</div>
              <div>'Automatic'</div>
            </div> */}
          </div>

          <div>
            <h3 className="background">
              <span>Events</span>
            </h3>
            <p>
              <i>No Upcoming Events</i>
            </p>

            <h3 className="background">
              <span>Activity</span>
            </h3>

            <div className="panel">asdf</div>
            <div className="panel">asd</div>
            <div className="panel">sdf</div>
            <div className="panel">asdf</div>
            <div className="panel">adf</div>
          </div>
        </div>
      ) : null}

      {/* 
      <hr />
      <code>{JSON.stringify(group)}</code>
       */}
    </div>
  );
}

export default Group;

export function GroupHeader({ subdomain, avatar, displayName, caption }) {
  return (
    <div className="user-info">
      <div>
        <GroupPic avatarUrl={avatar} />
      </div>
      <div className="user-text">
        <h2 style={{ marginBottom: 0 }}>{displayName}</h2>
        <div>
          <span className="grid-label mr-2">Website</span>
          <a
            href={`https://${subdomain}.clubstack.party`}
          >{`https://${subdomain}.clubstack.party`}</a>
        </div>
      </div>
    </div>
  );
}
