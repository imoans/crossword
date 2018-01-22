// @flow

import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from '../store'
import App from '../components'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => { actions: actions(dispatch) }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

export default connect(mapStateToProps, mapDispatchToProps)(App)
