import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';
// import VideoCard from 'components/videoCard';
import UserTable from 'components/userTable';
import { BiChevronRight } from 'react-icons/bi';

function Content() {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [content, setContent] = useState(null);

  // useEffect(() => {
  //   setLoading(true);
  //   const method = 'GET';
  //   const endPoint = '/api/content/';
  //   callApi(method, endPoint)
  //     .then((body) => {
  //       // setContent(body);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setError(error.toString());
  //       setLoading(false);
  //     });
  // }, [callApi]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <h2>Manage Community</h2>
          <p>
            <Link to="/website">Website</Link> <BiChevronRight />{' '}
            <u>Community</u>
          </p>

          {/* Stripe Account */}
          <h3 className="background">
            <span>Pricing & Account</span>
          </h3>
          <div className="mb-4"></div>

          {/* Subscribers */}
          <h3 className="background">
            <span>Subscribers</span>
          </h3>
          <div className="mb-4"></div>
          <UserTable />

          {/* Email */}
          <h3 className="background">
            <span>Preferences</span>
          </h3>
          <div className="mb-4"></div>
          <ul>
            <li>Email Prefs</li>
            <li>Chat channel</li>
            <li>asdf</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Content;
