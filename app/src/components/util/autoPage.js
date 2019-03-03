import React, { Component } from 'react';
import { connect } from 'react-redux';

import Select from 'react-select';

import store from 'state/store';

import Loader from 'components/util/web3Wrapper';
import AutoForm from 'components/util/autoForm';

class LandingPage extends Component {
  state = { accounts: null, contract: '', methodList: [], method: '' };

  contractSelect(option) {
    // build method list
    const targetContract = store.getState().contracts[option.value];
    let methods = [];
    for (var key in targetContract._jsonInterface) {
      if (targetContract._jsonInterface[key].type === 'function') {
        methods.push(targetContract._jsonInterface[key]);
      }
    }

    this.setState({
      contract: option.value,
      methodList: methods.map(method => {
        return { value: method.name, label: method.name };
      }),
      method: ''
    });
  }

  methodSelect(option) {
    this.setState({
      method: option.value
    });
  }

  render() {
    return (
      <div>
        <h1>AutoForm</h1>
        <Loader>
          <div>
            <form className="pure-form">
              <label htmlFor="contractSelect">Select Target Contract</label>
              <Select
                options={this.props.contractList}
                id="contractSelect"
                name="contractSelect"
                onChange={this.contractSelect.bind(this)}
              />

              <label htmlFor="methodSelect">Select Contract Method</label>
              <Select
                options={this.state.methodList}
                id="methodSelect"
                name="methodSelect"
                onChange={this.methodSelect.bind(this)}
              />
            </form>

            {!!this.state.contract && !!this.state.method ? (
              <AutoForm
                contract={this.state.contract}
                method={this.state.method}
              />
            ) : null}
          </div>
        </Loader>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contractList: state.contracts.contractList
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);
