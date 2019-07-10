import React, { Component } from 'react';

// icons
// import { IoIosGlobe } from 'react-icons/io';
// import { GiInfo } from 'react-icons/gi';
// import { GoGitMerge, GoBroadcast } from 'react-icons/go';
// import { MdInsertDriveFile } from 'react-icons/md';

class LandingPage extends Component {
  state = { accounts: null };

  render() {
    return (
      <React.Fragment>
        <section>
          <h2>Incentive Exchange</h2>
          <p>
            Build private social networks around standarized transactions.
            Establish community norms and practices to streamline negotiation.
            Enable independent agents to coordinate to achieve your goals.
          </p>
          <div className="row row-3">
            <div>
              <h3>1) Design the Deal</h3>
              <ul>
                <li>Standardize Terms & Structure</li>
                <li>
                  Add <b>Network Incentives</b>: Value(minus) vs. Price(plus)
                </li>
                <li>
                  Set <b>Incentive Pricing</b>: Algorithmic or Open
                </li>
              </ul>
            </div>
            <div>
              <h3>2) Design your Network</h3>
              <ul>
                <li>Membership: Open vs. Private</li>
                <li>Connections: Public vs. Private</li>
                <li>Actions: Public vs. Private</li>
              </ul>
            </div>
            <div>
              <h3>3) Do Business</h3>
              <ul>
                <li>Instant, friction-free transactions</li>
                <li>Powerful search, insights, and analytics tools</li>
                <li>Use familiar social tools to interact</li>
                <li>Integrate with popular enterprise products</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Incentive Query Networks</h2>

          <h3>Reduce</h3>

          <ol>
            <li>Search</li>
            <li>Transactional</li>
            <li>Direct</li>
            <li>Assessment</li>
            <li>Accountability & Recourse</li>
          </ol>
        </section>

        <section>
          <h2>Examples</h2>

          <div className="row row-3">
            <div>
              <h3>Talent</h3>
              <p>Post a request and a completion bonus.</p>
              <p>Watch as a network of referrals form.</p>
              <p>Select the winner to distribute the completion bonus.</p>
            </div>
            <div>
              <h3>Commodities</h3>
            </div>
            <div>
              <h3>Stagetime</h3>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default LandingPage;
