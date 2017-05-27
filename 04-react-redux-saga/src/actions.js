import * as types from './actionTypes';

export function constructorsLoaded(constructors) {
  return {
    type: types.LOAD_CONSTRUCTORS_SUCCESS,
    constructors,
  };
}