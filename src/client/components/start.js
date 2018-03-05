// @flow

import type { State as DomainState } from '../../domain/redux/state'
import React from 'react'
import socket from '../socket'
import Game from '../../domain/game'
import GameForClient from '../../domain/game-for-client'
import GameService from '../../domain/game-service'
import Player from '../../domain/player'
import actionCreators from '../../domain/redux/actions'
import { NUMBER_OF_CARDS } from './field'
import { getCenterPoint } from '../../util/get-center-point'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Redirect } from 'react-router'
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
  joined: boolean,
  isInProgress: boolean,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  disable: {
    opacity: 0.8,
  },
})

export default class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      playerNames: [],
      joined: false,
    }

    socket.on('addPlayer', (playerNames) => {
      this.setState({ playerNames })
    })

    socket.on('joined', (playerNames) => {
      this.setState({ joined: true })
    })

    socket.on('inProgress', () => {
      this.setState({ isInProgress: true })
    })

    socket.on('disconnect', (playerName, playerNames) => {
      this.setState({ playerNames })
      console.log(`${playerName} disconnect`)
    })
  }

  addUser() {
    if (this.state.joined) return
    socket.emit('addPlayer', this.state.userName)
  }

  startGame = () => {
    if (!this.isReady() || this.state.isInProgress) return
    const { HORIZONTAL, VERTICAL } = NUMBER_OF_CARDS
    const center = getCenterPoint(HORIZONTAL, VERTICAL)
    socket.emit('startGame', center)
  }

  updateUserName(e) {
    this.setState({
      userName: e.target.value
    })
  }

  isReady() {
    return this.state.playerNames.length >= 2
  }

  render() {
    if (this.state.isInProgress) return <Redirect to={PATH.GAME} />

    return (
      <View style={styles.container}>
        <Text>crossword</Text>

        <Text>join from here</Text>
        <Text>input your name </Text>
        <TextInput
          onBlur={(e) => this.updateUserName(e)}
        />
        <Text
          onClick={(e) => this.addUser(e)}
          style={this.state.joined ? styles.disable : null}
        >
          join
        </Text>
        <Text>members waiting for the game</Text>
        <Text>{this.state.playerNames.join(', ')}</Text>

        <TouchableOpacity onPress={this.startGame}>
          <Text style={this.isReady() ? null : styles.disable}>
            start game!!!
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
