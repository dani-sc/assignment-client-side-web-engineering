import * as types from './actionTypes';

const initialState = {
  constructors: [],
  drivers: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONSTRUCTORS_SUCCESS: {
      return {
        ...state,
        constructors: [...state.constructors, ...action.constructors],
      };
    }
    case types.FETCH_DRIVERS_SUCCESS: {
      return {
        ...state,
        drivers: action.drivers
      }
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;