import { put, takeEvery, all, call } from 'redux-saga/effects'
import request from './request'
import * as types from './actionTypes'
import { constructorsLoaded } from './actions'

function* helloSaga() {
  console.log('Hello Sagas!')
}

function* getConstructors() {
  // Get all constructors from API, so we can fill typeahead with the right data
  const constructors = yield call(request, 'http://ergast.com/api/f1/constructors.json?limit=500');
  console.log("entered getConstructors");
  console.log(constructors);
  yield put(constructorsLoaded(constructors));
}

export default function* rootSaga() {
  yield all([
    helloSaga(),
    getConstructors(),
  ])
}