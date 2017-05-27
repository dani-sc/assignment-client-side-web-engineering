import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
const Typeahead = require('react-typeahead').Typeahead;

class App extends Component {
  render() {
    const { constructors } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Typeahead
          options={constructors}
          placeholder="Enter constructor's name"
          filterOption='name'
          displayOption='name'
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  constructors: state.constructors,
});

const mapDispatchToProps = dispatch => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
