// @flow

import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware
} from 'redux'

const reducers = combineReducers({})
const middlewareList = []

const store = createStore(reducers, compose(applyMiddleware(...middlewareList)))

export default store
