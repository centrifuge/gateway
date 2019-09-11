import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import createRootReducer from './reducers';
import sagas from './sagas';

const sagasMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (defaultStore) => {
  const store = createStore(
    createRootReducer(history),
    //@ts-ignore
    defaultStore,
    composeEnhancers(applyMiddleware(sagasMiddleware)),
  );

  sagasMiddleware.run(sagas);
  return store;
};

export default configureStore;
