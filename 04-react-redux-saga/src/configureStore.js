import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import { helloSaga } from './sagas';

function configureStore () {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
  );
  sagaMiddleware.run(helloSaga);

  // const action = type => store.dispatch({type});

  // return {
  //   ...createStore(
  //     rootReducer,
  //     applyMiddleware(sagaMiddleware)),
  //   runSaga: sagaMiddleware.run(rootSaga),
  // };
}

export default configureStore;
