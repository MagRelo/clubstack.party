import React, { Component } from 'react';
import { connect } from 'react-redux';

class LinkForm extends Component {
  state = {
    formAlert: false,
    formError: false,
    formSuccess: false,
    formSubmitting: false,
    formMessage: '',

    linkCreated: false,
    parentLink: 'null',
    debug: true
  };

  async handleSubmit(event) {
    event.preventDefault();

    // set loading state
    this.setState({
      formSubmitting: true
    });

    try {
      const newLink = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentLinkId: this.props.parentLinkId,
          userId: '123'
        })
      }).then(response => response.json());

      console.log(newLink);
      this.setState({
        formSuccess: true,
        formAlert: true,
        formSubmitting: false,
        formMessage: 'Success!',
        linkCreated: true
      });
    } catch (error) {
      this.setState({
        formError: true,
        formAlert: true,
        formSubmitting: false,
        formMessage: error.message
      });

      return console.log(error);
    }
  }

  resetForm() {
    this.setState({
      formAlert: false,
      formError: false,
      formSuccess: false,
      formSubmitting: false,
      formMessage: ''
    });
  }

  alertClass() {
    if (this.state.formError) return 'alert error';
    if (this.state.formSuccess) return 'alert success';
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div>
        <form
          name="newLinkForm"
          className="pure-form"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <legend>Create Referral Link</legend>

          {this.state.debug ? (
            <div>
              <p>parent: {this.state.parentLink}</p>
              <p>account: {this.state.selectedAccount}</p>
            </div>
          ) : null}

          <button className="pure-button pure-button-primary">
            Create Link
          </button>

          {this.state.formSubmitting ? (
            <span style={{ fontSize: 'smaller', marginLeft: '1em' }}>
              Submitting...
            </span>
          ) : null}

          {this.state.formAlert ? (
            <div className={this.alertClass()}>
              <p>{this.state.formMessage}</p>

              <button
                className="pure-button"
                onClick={this.resetForm.bind(this)}
              >
                Ok
              </button>
            </div>
          ) : null}

          <hr />

          <p>links and stuff </p>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedAccount: state.account.selectedAccount
  };
};

export default connect(
  mapStateToProps,
  null
)(LinkForm);