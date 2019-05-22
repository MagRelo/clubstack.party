import React, { Component } from 'react';
import { connect } from 'react-redux';

const messages = [
  { id: '1', title: 'asdf', message: 'asdoiuasdfo' },
  { id: '2', title: '1234', message: 'asdoiuasdfo' },
  { id: '3', title: 'poiu', message: 'asdoiuasdfo' },
  { id: '4', title: 'xcvb', message: 'asdoiuasdfo' }
];

class Inbox extends Component {
  state = { accounts: null, messages: messages };

  render() {
    return (
      <div>
        <h3>Referrals</h3>

        {this.state.messages.map(message => {
          return (
            <div className="inbox-message" key={message.id}>
              <div>
                <h3>{message.title}</h3>

                <p>{message.message}</p>
              </div>
            </div>
          );
        })}
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
)(Inbox);
