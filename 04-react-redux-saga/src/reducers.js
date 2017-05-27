import * as types from './actionTypes';

const initialState = {
  constructors: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_CONSTRUCTORS_SUCCESS: {
      return Object.assign({}, state, {
        constructors: action.constructors
      });
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;