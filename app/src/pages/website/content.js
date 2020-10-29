import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';
import VideoCard from 'components/videoCard';

import { BiBookAdd } from 'react-icons/bi';

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
  }, [callApi, user._id]);

  return (
    <div className="container">
      <div>
        <h2>Manage Content</h2>

        <div className="mb-4"></div>
        <h3 className="background">
          <span>Website Content</span>
        </h3>
      </div>

      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-3">
          {content &&
            content.map((item) => {
              return (
                <VideoCard
                  {...item}
                  key={item._id}
                  active={false}
                  editing={true}
                />
              );
            })}

          <div className="panel">
            <Link
              to="/website/content/add"
              className="btn btn-theme btn-sm"
              style={{ float: 'right' }}
            >
              Add Content <BiBookAdd />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
