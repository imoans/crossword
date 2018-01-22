// @flow

import React from 'react'
import socket from '../socket'

export default class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: ''
    }
  }

  componentWillMount() {
  }

  addUser() {
    socket.emit('addUser', this.state.userName)
  }

  updateUserName(e) {
    this.setState({
      userName: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>crossword</h1>

        <h2>join from here</h2>
        <p>input your name </p>
        <input onBlur={(e) => this.updateUserName(e)} id="user-name-input" type="text" />
        <div onClick={(e) => this.addUser(e)}>join</div>

        <h2>members waiting for the game</h2>
        <div id="members">{this.state.userName}</div>

        <div>start game!!!</div>
      </div>
    )
  }
}
