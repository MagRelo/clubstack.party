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
          <h2>Communities</h2>
        </div>

        <ul>
          {user.subscriptions.map((item, index) => {
            return (
              <li key={item._id}>
                <UserProfile
                  displayUser={(item) => {
                    return { _id: index, ...item };
                  }}
                />

                <Link to={'/'}>{item.subdomain}</Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default User;
