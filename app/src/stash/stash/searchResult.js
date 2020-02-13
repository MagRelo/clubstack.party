import React from 'react';
import { Link } from '@reach/router';
import { useTrail, animated } from 'react-spring';

import { formatCurrency } from 'components/random';
// import LinkButton from 'components/linkButton';
// import ResponseButton from 'components/responseButton';

function SearchResult(link, query, user) {
  return (
    <React.Fragment>
      <td>
        <Link to={'/link/' + link.linkId}>{query.title}</Link>
      </td>
      <td>{query.data.employer}</td>
      <td>
        {formatCurrency(query.data.salaryMin, true) +
          ' – ' +
          formatCurrency(query.data.salaryMax, true)}
      </td>
      <td>{formatCurrency(link.respondBonus)}</td>
      <td>{formatCurrency(link.promoteBonus)}</td>
    </React.Fragment>
  );
}

function Results(props) {
  const config = { mass: 5, tension: 2000, friction: 200 };
  const trail = useTrail(props.results.length, {
    config,
    opacity: 1,
    x: 0,
    height: 80,
    from: { opacity: 0, x: 20, height: 0 }
  });

  return (
    <table className="pure-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Employer</th>
          <th>Salary</th>
          <th>Apply</th>
          <th>Promote</th>
        </tr>
      </thead>

      <tbody>
        {trail.map(({ x, height, ...rest }, index) => {
          return (
            <animated.tr
              key={index}
              style={{
                ...rest
              }}
            >
              {SearchResult(
                props.results[index].link,
                props.results[index].query,
                props.results[index].user
              )}
            </animated.tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Results;
