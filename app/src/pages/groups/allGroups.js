import React, { useContext } from 'react';
import { Link } from '@reach/router';

// import { Loading } from 'components/random';
// import Dashboard from 'components/dashboard';

import { AuthContext } from 'App';

function User({ userId }) {
  const { user } = useContext(AuthContext);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  // const [displayUser, setDisplayUser] = useState(false);
  // const [stats, setStats] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   const method = 'GET';
  //   const endPoint = '/api/user/' + apiUserId;
  //   callApi(method, endPoint)
  //     .then((body) => {
  //       // setDisplayUser(body.user);
  //       // setStats(body.stats);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setError(error.toString());
  //       setLoading(false);
  //     });
  // }, [apiUserId, callApi]);

  return (
    <div className="container">
      {/* {error ? <p>{error}</p> : null} */}
      {/* {loading ? <Loading /> : null} */}

      <section>
        <div className="section-title">
          <h2>Communities</h2>
        </div>

        <ul>
          {user.subscriptions.map((item) => {
            return (
              <li>
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
