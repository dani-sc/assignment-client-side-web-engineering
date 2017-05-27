import * as types from './actionTypes';

export function fetchConstructors(offset) {
  return {
    type: types.FETCH_CONSTRUCTORS,
    offset,
  }
}

export function constructorsFetched(constructors) {
  return {
    type: types.FETCH_CONSTRUCTORS_SUCCESS,
    constructors,
  };
}

export function fetchDrivers(constructorId) {
  return {
    type: types.FETCH_DRIVERS,
    constructorId,
  }
}

export function driversFetched(drivers) {
  return {
    type: types.FETCH_DRIVERS_SUCCESS,
    drivers,
  };
}
