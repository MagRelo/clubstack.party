import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';
import VideoCard from 'components/videoCard';

function Resources() {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/content/';
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
        <div className="container">
          <h2>Manage Resources</h2>
          <p>
            <Link to="/admin">Admin</Link> - Resources
          </p>
          <div className="grid grid-3">
            {content &&
              content.map((item) => {
                return <VideoCard {...item} key={item._id} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;
