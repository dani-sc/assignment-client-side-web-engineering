import { put, takeLatest, takeEvery, all, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga';
import request from './request'
import * as types from './actionTypes'
import * as actions from './actions'
// import { getConstructorsLength } from './selectors'

function* fetchConstructors({offset} = {}) {
  // Get all constructors from API, so we can fill typeahead with the right data
  // The easiest and most efficient way would be to just add ?limit=500, but that's not allowed in this exercise

  if (offset === undefined) offset = 0;
  const response = yield call(request, `http://ergast.com/api/f1/constructors.json?offset=${offset}`);
  const constructors = response.MRData.ConstructorTable.Constructors;
  yield put(actions.constructorsFetched(constructors));
  
  const numberOfConstructorsFetched = offset + constructors.length;
  const totalNumberOfConstructors = response.MRData.total;
  if (numberOfConstructorsFetched < totalNumberOfConstructors) {
    yield put(actions.fetchConstructors(numberOfConstructorsFetched));
  }
}

function* watchFetchConstructors() {
  yield takeEvery(types.FETCH_CONSTRUCTORS, fetchConstructors);
}

function* fetchDrivers({constructorId}) {
  console.log(`fetching drivers for ${constructorId}`);
  const response = yield call(request, `http://ergast.com/api/f1/constructors/${constructorId}/drivers.json?limit=500`)
  const drivers = response.MRData.DriverTable.Drivers;
  console.log(drivers);
  yield put(actions.driversFetched(drivers));
}

function* watchFetchDrivers() {
  console.log('watch fetch drivers');
  yield takeLatest(types.FETCH_DRIVERS, fetchDrivers);
}

export default function* rootSaga() {
  yield all([
    fetchConstructors(),
    watchFetchConstructors(),
    watchFetchDrivers(),
  ])
}