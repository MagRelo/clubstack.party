import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';
import ContentCard from 'components/contentCard';

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
  }, [callApi, user._id]);

  return (
    <div className="container">
      <div>
        <h2>Manage Content</h2>
        <p>
          <Link to="/website">Publishing</Link> <BiChevronRight /> Content
        </p>

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
                <Link to={'/website/content/' + item._id} key={item._id}>
                  <ContentCard {...item} />
                </Link>
              );
            })}

          <div>
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
