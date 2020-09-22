import React from 'react';
import { Link } from '@reach/router';

function AboutPage(props) {
  return (
    <div>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>An error has occured.</h1>
        <p>We're sorry, something has gone wrong.</p>

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
