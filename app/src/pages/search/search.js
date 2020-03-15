// import React from 'react';
import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';

import { useTrail, animated } from 'react-spring';

import JobSearchForm from 'pages/search/searchForm';
import ActivityTile from 'pages/search/searchResult_tile';

function SearchFlow() {
  // search data
  // const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  //searchTerm
  useEffect(() => {
    // setIsSearching(true);
    setError('');

    getSearchResults(searchTerm)
      .then(results => {
        setResults(results);
        // setIsSearching(false);
      })
      .catch(error => {
        console.log(error);
        setError(error.toString());
        // setIsSearching(false);
      });
  }, [searchTerm]);

  function submit(searchText) {
    setSearchTerm(searchText);
  }

  const config = { mass: 5, tension: 2000, friction: 200 };
  const trail = useTrail(results.length, {
    config,
    opacity: 1,
    x: 0,
    height: 80,
    from: { opacity: 0, x: 20, height: 0 }
  });

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <JobSearchForm submit={submit} />
        </div>

        {error ? <p style={{ textAlign: 'center' }}>{error}</p> : null}

        {!results.length ? (
          <p style={{ textAlign: 'center' }}>No Results</p>
        ) : null}

        <div className="grid grid-3">
          {trail.map(({ x, height, ...rest }, index) => {
            return (
              <animated.div
                key={index}
                style={{
                  ...rest,
                  transform: x.interpolate(x => `translate3d(0,${x}px,0)`)
                }}
              >
                {ActivityTile(results[index].link)}
              </animated.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchFlow;

async function getSearchResults(searchTerm, days) {
  const queryString = `?searchTerm=${searchTerm}`;
  return fetch('/api/search' + queryString, {
    method: 'GET'
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }

    // some type of error has occured...
    console.log(response.status, response.statusText);

    throw new Error(response.statusText);
  });
}

// <MetaData />
// function MetaData() {
//   return (
//     <Helmet>
//       <title>Talent Relay | Search</title>
//       <meta name="description" content="Talent Relay – Search for Links" />
//       <link rel="canonical" href={'https://talent.incentive.exchange/search'} />

//       <meta property="og:site_name" content="Talent Relay" />
//       <meta property="og:type" content="website" />
//       <meta
//         property="og:url"
//         content={'https://talent.incentive.exchange/search'}
//       />
//       <meta property="og:title" content="Talent Relay | Search" />
//       <meta
//         property="og:description"
//         content="Talent Relay – Search for Links"
//       />

//       {/* <meta property="og:image" content="" /> */}
//       {/* <meta property="og:image:secure_url" content="" /> */}
//       {/* <meta property="og:image:type" content="jpeg" /> */}
//       {/* <meta property="og:image:height" content="606" /> */}
//       {/* <meta property="og:image:width" content="808" /> */}

//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:site" content="@spoonuniversity" />
//       <meta name="twitter:title" content="Talent Relay | Search" />
//       <meta
//         name="twitter:description"
//         content="Talent Relay – Search for Links"
//       />
//       {/* <meta name="twitter:image" content="" /> */}
//     </Helmet>
//   );
// }