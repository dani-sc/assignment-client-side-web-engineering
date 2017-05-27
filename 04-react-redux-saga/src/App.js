import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { fetchDrivers } from './actions'
const Typeahead = require('react-typeahead').Typeahead;

class App extends Component {
  render() {
    const { constructors, fetchDrivers, drivers } = this.props;

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
          onOptionSelected={fetchDrivers}
        />
        <h4>{`${drivers.length} drivers found`}</h4>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Nationality</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 && drivers.map((driver) => (
              <tr key={driver.driverId}>
                <td>{driver.givenName}</td>
                <td>{driver.familyName}</td>
                <td>{driver.nationality}</td>
                <td>{driver.dateOfBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

App.propTypes = {
  constructors: PropTypes.array.isRequired,
  drivers: PropTypes.arrayOf(PropTypes.shape({
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    nationality: PropTypes.string,
    dateOfBirth: PropTypes.string,
  })),
};

App.defaultProps = {
  constructors: [{}],
  drivers: [{}],
};

const mapStateToProps = state => ({
  constructors: state.constructors,
  drivers: state.drivers,
});

const mapDispatchToProps = dispatch => ({
  fetchDrivers: (constructor) => {
    dispatch(fetchDrivers(constructor.constructorId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
