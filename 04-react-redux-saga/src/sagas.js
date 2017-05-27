import { put, takeEvery, all, call } from 'redux-saga/effects'
import request from './request'
import * as types from './actionTypes'
import { constructorsFetched, driversFetched } from './actions'

function* fetchConstructors() {
  // Get all constructors from API, so we can fill typeahead with the right data
  const response = yield call(request, 'http://ergast.com/api/f1/constructors.json?limit=500');
  const constructors = response.MRData.ConstructorTable.Constructors;
  console.log("entered getConstructors");
  console.log(constructors);
  yield put(constructorsFetched(constructors));
}

function* fetchDrivers({constructorId}) {
  console.log(`fetching drivers for ${constructorId}`);
  const response = yield call(request, `http://ergast.com/api/f1/constructors/${constructorId}/drivers.json?limit=500`)
  const drivers = response.MRData.DriverTable.Drivers;
  console.log(drivers);
  yield put(driversFetched(drivers));
}

function* watchFetchDrivers() {
  console.log('watch fetch drivers');
  yield takeEvery(types.FETCH_DRIVERS, fetchDrivers);
}

export default function* rootSaga() {
  yield all([
    fetchConstructors(),
    watchFetchDrivers(),
  ])
}