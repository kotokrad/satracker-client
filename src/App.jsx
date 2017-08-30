import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import Map from './components/Map';
import reducers from './reducers';
import './App.css';

const composeStoreWithMiddleware = applyMiddleware(promiseMiddleware())(createStore); //

export default () => (
  <Provider store={composeStoreWithMiddleware(reducers)}>
    <div style={{ height: '100%' }}>
      <Map />
    </div>
  </Provider>
);
