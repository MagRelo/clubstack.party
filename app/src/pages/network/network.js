import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from 'App';

import { Loading } from 'components/random';

import Teaser from 'pages/position/positionTeaser';
import { UserProfile } from 'pages/account/userProfile';
import { UserScore } from 'pages/account/userScore';

function NetworkFeed(props) {
  const { callApi } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [networkPosts, setNetworkPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    setLoading(true);

    const method = 'GET';
    const endPoint = '/api/user/network';
    callApi(method, endPoint)
      .then((body) => {
        setNetworkPosts(body.feed);
        setFollowing(body.following || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.toString());
        setLoading(false);
      });
  }, [callApi]);

  return (
    <section className="container">
      {error ? <p>{error}</p> : null}
      <div className="grid grid-5-3">
        <div>
          <h1>Activity</h1>
          {loading ? (
            <Loading />
          ) : (
            <div>
              {networkPosts.map((object) => {
                switch (object.verb) {
                  case 'addFollow:User':
                    return (
                      <div className="panel" key={object.id}>
                        <p>new follow</p>
                        <UserProfile user={object.data} />
                      </div>
                    );
                  case 'addPosition':
                    return <Teaser position={object.data} key={object.id} />;
                  default:
                    return null;
                }
              })}
            </div>
          )}
        </div>
        <div>
          <h2>Leaderboard</h2>
          <hr />
          {following.map((follow) => {
            return <UserScore user={follow} key={follow._id} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default NetworkFeed;
