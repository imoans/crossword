// @flow

import React, { Component } from 'react'
import Start from '../containers/start'
import State from '../../domain/redux/state'
import actionCreators from '../../domain/redux/actions'
import store from '../redux/store'

export default class App extends Component {
  componentDidMount() {
    const domainState = new State()
    store.dispatch(actionCreators.setState(domainState))
  }

  render() {
    return <Start />
  }
}
