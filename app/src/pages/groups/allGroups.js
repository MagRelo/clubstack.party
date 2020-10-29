import React, { useContext } from 'react';
import { Link } from '@reach/router';
import Img from 'react-image';
import { GiHouse } from 'react-icons/gi';

import { AuthContext } from 'App';
import { ProfilePic } from 'pages/account/userProfile';

function User() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <section>
        <div className="section-title">
          <h2>Houses</h2>
        </div>

        <h3 className="background">
          <span>My Houses</span>
        </h3>
        {!user.subscriptions.length ? <p>No Houses</p> : null}
        <div className="grid grid-3">
          {user.subscriptions.map((item, index) => {
            return (
              <div key={item._id}>
                <GroupDisplay
                  subdomain={item.subdomain}
                  avatar={item.avatar}
                  displayName={item.displayName}
                  caption={item.caption}
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

export function GroupDisplay({ subdomain, avatar, displayName, caption }) {
  return (
    <Link to={'/clubs/' + subdomain}>
      <div className="user-info">
        <div>
          <ProfilePic avatarUrl={avatar} />
        </div>

        <div className="user-text">
          <div className="user-name">{displayName}</div>
          <div className="user-caption">{caption}</div>
        </div>
      </div>
    </Link>
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
