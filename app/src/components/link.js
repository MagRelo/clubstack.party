import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

import LinkForm from './createLink';
import LinkAdmin from './linkAdmin';

class Profile extends Component {
  state = { contactOpen: false, linkOpen: false, name: '' };

  async componentDidMount() {
    // get linkId from URL
    const linkId = this.props.match.params.linkId;

    // get position data
    const response = await fetch('/api/link/' + linkId);
    if (response.status === 200) {
      const responseObj = await response.json();

      // console.log(query);

      this.setState({
        name: responseObj.query.title,
        description: responseObj.query.description,
        payoff: responseObj.link.payoff,
        userPayoff: responseObj.link.userPayoff,
        isUser: responseObj.link.isUser
      });
    } else {
      console.log('not found', response.status);
    }
  }

  formatCurrency(input) {
    if (typeof input === 'number') {
      return input.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    }
    return '';
  }

  render() {
    return (
      <div>
        <div className="panel">
          <h2>{this.state.name}</h2>
          <p>Description: {this.state.description}</p>

          <button
            className="pure-button pure-button-primary"
            style={{ marginBottom: '1em' }}
            onClick={() => this.setState({ contactOpen: true })}
          >
            Apply – {this.formatCurrency(this.state.payoff)}
          </button>
          <Dialog
            isOpen={this.state.contactOpen}
            onDismiss={() => this.setState({ contactOpen: false })}
          >
            <p>(UI needed to request payment)</p>
          </Dialog>
        </div>

        {this.state.isUser ? (
          <LinkAdmin
            payoff={this.state.payoff}
            userPayoff={this.state.userPayoff}
          />
        ) : (
          <button
            className="pure-button pure-button-primary"
            style={{ marginTop: '1em' }}
            onClick={() => this.setState({ contactOpen: true })}
          >
            Promote for {this.formatCurrency(this.state.userPayoff)}
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
