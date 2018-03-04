// @flow

import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { render } from 'react-native'
import store from '../redux/store'
import PATH from '../constants/path'
import { View } from 'react-native'

import { Router, Route, BrowserRouter } from 'react-router-dom'

import App from '../components/app'
import Game from '../containers/game'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => { actions: actions(dispatch) }

render(
  <Provider store={store}>
    <BrowserRouter>
      <View>
        <Route path={PATH.TOP} component={App} />
        <Route path={PATH.GAME} component={Game} />
      </View>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)

export default connect(mapStateToProps, mapDispatchToProps)(App)
