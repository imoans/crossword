// @flow

import type { State as DomainState } from '../../domain/redux/state'
import React from 'react'
import socket from '../socket'
import Game from '../../domain/game'
import GameForClient from '../../domain/game-for-client'
import GameService from '../../domain/game-service'
import Player from '../../domain/player'
import actionCreators from '../../domain/redux/actions'
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native'
import { Link } from 'react-router-dom'
import PATH from '../constants/path'
import COLORS from '../constants/colors'

type Props = {
  domain: DomainState,
  dispatch: any,
}

type State = {
  userName: string,
  playerNames: Array<string>,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
})

export default class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      playerNames: []
    }

    socket.on('addUser', (userName) => {
      const playerNames = [ ...this.state.playerNames, userName ]
      this.setState({ playerNames })
    })
  }

  addUser() {
    socket.emit('addUser', this.state.userName)
  }

  startGame() {
    console.log('start game')
    const players = this.state.playerNames.map(name => new Player({ name }))
    socket.emit('startGame', players)
  }

  updateUserName(e) {
    this.setState({
      userName: e.target.value
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>crossword</Text>

        <Text>join from here</Text>
        <Text>input your name </Text>
        <TextInput
          onBlur={(e) => this.updateUserName(e)}
        />
        <Text onClick={(e) => this.addUser(e)}>
          join
        </Text>

        <Text>members waiting for the game</Text>
        <Text>{this.state.playerNames.join(', ')}</Text>

        <Link to={PATH.GAME} onClick={() => this.startGame()}>
          start game!!!
        </Link>
      </View>
    )
  }
}
