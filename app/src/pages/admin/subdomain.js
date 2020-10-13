import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { Loading } from 'components/random';
import { AuthContext } from 'App';

import { BiBookAdd, BiChevronRight } from 'react-icons/bi';

function Content() {
  const { callApi, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    setLoading(true);
    const method = 'GET';
    const endPoint = '/api/admin/subdomain';
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
  }, [callApi, user]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2>
            Manage Subdomains
            <Link
              to="/admin/subdomain/add"
              className="btn btn-theme btn-sm"
              style={{ float: 'right' }}
            >
              Add Subdomain <BiBookAdd />
            </Link>
          </h2>
          <p>
            <Link to="/admin">Admin</Link> <BiChevronRight />{' '}
            <u>Manage Subdomains</u>
          </p>
          <ul>
            {content.map((item) => {
              return (
                <li key={item._id}>
                  <Link to={'/admin/subdomain/' + item.subdomain}>
                    {item.subdomain + ' - ' + item.email}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Content;
