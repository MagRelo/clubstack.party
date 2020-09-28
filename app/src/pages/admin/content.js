import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';
import VideoCard from 'components/videoCard';

import { BiBookAdd, BiChevronRight } from 'react-icons/bi';

function Content() {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/content?userId=' + user._id;
    callApi(method, endPoint)
      .then((body) => {
        setContent(body);
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
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2>
            Manage Content
            <Link
              to="/admin/content/add"
              className="btn btn-theme btn-sm"
              style={{ float: 'right' }}
            >
              Add Content <BiBookAdd />
            </Link>
          </h2>
          <p>
            <Link to="/admin">Admin</Link> <BiChevronRight />{' '}
            <u>Manage Content</u>
          </p>
          <div className="grid grid-3">
            {content &&
              content.map((item) => {
                return <VideoCard {...item} key={item._id} active={false} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
