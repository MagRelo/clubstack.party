import React, { useContext } from 'react';
// import { Link } from '@reach/router';

import { AuthContext } from 'App';
import { UserDisplay } from 'pages/account/userProfile';

function User() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <section>
        <div className="section-title">
          <h2>Clubs</h2>
        </div>

        <h3 className="background">
          <span>My Clubs</span>
        </h3>
        {!user.subscriptions.length ? <p>No Clubs</p> : null}
        <div className="grid grid-3">
          {user.subscriptions.map((item, index) => {
            return (
              <div key={item._id}>
                <UserDisplay
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
