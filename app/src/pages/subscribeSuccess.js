import React from 'react';
import { Link } from '@reach/router';

function AboutPage(props) {
  return (
    <div>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Thank You For Joining!</h1>
        <p>
          We'll send you an email with instructions as soon as your subscription
          is processed.
        </p>

        <p>Suggested Pages:</p>
        <ul className="list-unstyled">
          <li>
            <Link to="/">Videos</Link>
          </li>

          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
