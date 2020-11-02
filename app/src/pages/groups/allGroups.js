import React, { useContext, useEffect, useState } from 'react';
import { Link } from '@reach/router';
import Img from 'react-image';
import { GiHouse } from 'react-icons/gi';

import { AuthContext } from 'App';
import { ProfilePic } from 'pages/account/userProfile';

function User() {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [groups, setGroups] = useState([]);

  // get all groups
  useEffect(() => {
    setLoading(true);

    const method = 'GET';
    const endPoint = '/api/group';
    callApi(method, endPoint)
      .then((body) => {
        setGroups(body);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.toString());
        setLoading(false);
      });
  }, [callApi]);

  return (
    <div className="container">
      <section>
        <div className="section-title">
          <h2>Publications</h2>
        </div>

        <h3 className="background">
          <span>My Publications</span>
        </h3>
        {!user.subscriptions.length ? (
          <p className="text-center">
            <i>Publications that you are a member of will appear here.</i>
          </p>
        ) : null}
        <div className="grid grid-3">
          {user.subscriptions.map((item, index) => {
            return (
              <div key={item._id}>
                <MyGroupDisplay
                  subdomain={item.subdomain}
                  avatar={item.avatar}
                  displayName={item.displayName}
                  caption={item.caption}
                />
              </div>
            );
          })}
        </div>

        <h3 className="background">
          <span>All Publications</span>
        </h3>

        {/* get groups error */}
        {error ? <p>{error}</p> : null}

        <div className="grid grid-3">
          {groups.map((item, index) => {
            return (
              <div key={item._id}>
                <AllGroupDisplay
                  subdomain={item.subdomain}
                  avatar={item.image}
                  displayName={item.title}
                  caption={item.description}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default User;

export function MyGroupDisplay({ subdomain, avatar, displayName, caption }) {
  return (
    <Link to={'/clubs/' + subdomain}>
      <GroupUser avatar={avatar} displayName={displayName} caption={caption} />
    </Link>
  );
}

export function AllGroupDisplay({ subdomain, avatar, displayName, caption }) {
  return (
    <a href={'https://' + subdomain + '.clubstack.party'}>
      <GroupUser avatar={avatar} displayName={displayName} caption={caption} />
    </a>
  );
}

function GroupUser({ avatar, displayName, caption }) {
  return (
    <div className="user-info">
      <div>
        <ProfilePic avatarUrl={avatar} />
      </div>

      <div className="user-text">
        <div className="user-name">{displayName}</div>
        <div className="user-caption">{caption}</div>
      </div>
    </div>
  );
}

export function GroupPic({ avatarUrl }) {
  const defaultPic = () => {
    return (
      <div className="user-avatar">
        <div className="user-avatar-pic" alt="avatar">
          <GiHouse />
        </div>
      </div>
    );
  };

  return (
    <Img
      className="user-avatar"
      src={[avatarUrl]}
      loader={defaultPic()}
      unloader={defaultPic()}
    />
  );
}
