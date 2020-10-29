import React, { useContext } from 'react';
import { Link } from '@reach/router';

import { AuthContext } from 'App';
import { UserProfile } from 'pages/account/userProfile';
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
                <UserProfile
                  displayUser={(item) => {
                    return { _id: index, ...item };
                  }}
                />

                <Link to={'/'}>{item.subdomain}</Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default User;
