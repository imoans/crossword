// @flow

import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware
} from 'redux'
import logger from 'redux-logger'

import reducer from '../../domain/redux/reducers'

const reducers = combineReducers({
  domain: reducer,
})
const middlewareList = [
  logger,
]

const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewareList))
)

export default store
