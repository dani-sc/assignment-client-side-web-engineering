import { put, takeEvery, all, call, throttle } from 'redux-saga/effects'
import request from './request'
import * as types from './actionTypes'
import * as actions from './actions'

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
  const response = yield call(request, `http://ergast.com/api/f1/constructors/${constructorId}/drivers.json?limit=500`)
  const drivers = response.MRData.DriverTable.Drivers;
  yield put(actions.driversFetched(drivers));
}

function* watchFetchDrivers() {
  // Does not really make sense to throttle here, but it's part of the exercise
  // See explanation at https://github.com/redux-saga/redux-saga/blob/master/docs/recipes/README.md
  yield throttle(500, types.FETCH_DRIVERS, fetchDrivers);
}

export default function* rootSaga() {
  yield all([
    fetchConstructors(),
    watchFetchConstructors(),
    watchFetchDrivers(),
  ])
}