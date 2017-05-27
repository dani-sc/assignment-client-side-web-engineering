import * as types from './actionTypes';

const initialState = {
  constructors: [],
  drivers: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONSTRUCTORS_SUCCESS: {
      return Object.assign({}, state, {
        constructors: action.constructors
      });
    }
    case types.FETCH_DRIVERS_SUCCESS: {
      return Object.assign({}, state, {
        drivers: action.drivers
      });
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;