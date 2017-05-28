import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { fetchDrivers } from './actions'
import { Typeahead } from 'react-bootstrap-typeahead';

class App extends Component {
  render() {
    const { constructors, fetchDrivers, drivers } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Professional Formula 1 Driver Search</h2>
        </div>
        <p className="App-intro">
          To get started, search in the professional search field below for constructors, which will be displayed professionally.
        </p>
        <h4>{`${constructors ? constructors.length : 0} constructors loaded`}</h4>
        <Typeahead
          onChange={fetchDrivers}
          options={constructors}
          labelKey='name'
          autoFocus
          minLength={1}
        />
        <h4>{`${drivers ? drivers.length : 0} drivers found`}</h4>
        <table className='table table-striped'>
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

const mapStateToProps = ({ constructors, drivers }) => ({
  constructors,
  drivers,
});
const mapDispatchToProps = dispatch => ({
  fetchDrivers: (constructor) => {
    if (constructor[0]) {
      dispatch(fetchDrivers(constructor[0].constructorId));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
