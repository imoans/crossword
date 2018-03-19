// @flow

import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'

import domainReducer from '../../domain/redux/server/reducers'
import reducer from './reducers'

const reducers = combineReducers({
  domain: domainReducer,
  server: reducer
})
const middlewareList = [
  thunk,
]

const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewareList))
)

export default store
