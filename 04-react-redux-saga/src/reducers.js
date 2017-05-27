import { SHOW_HELLO_WORLD } from './actions'

const initialState = {
  constructors: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_HELLO_WORLD: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;