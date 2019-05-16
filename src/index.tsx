import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import configureStore, { history } from './store';

import 'normalize.css';
import { InvoiceInvoiceData } from '../clients/centrifuge-node';
import config from './common/config';

const runApplication = (store) => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
}



// in dev mode we do not have the prerendering of redux so need to login the user
if (process.env.NODE_ENV === 'development') {
  console.log()
  const loginData = {}
  console.log(loginData,JSON.stringify(loginData))
  fetch('/api/users/login', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(config.admin), // body data type must match "Content-Type" header
  })
    .then(res => res.json())
    .then(response => {
      runApplication(configureStore({
        user: {
          auth: {
            loggedInUser: response,
          },
        },
      }));
    })



} else {
  //@ts-ignore
  runApplication(configureStore(window.__PRELOADED_STATE__ || {}));
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
