// @flow

import type { State as DomainState } from '../../domain/redux/client/state'
import React from 'react'
import socket from '../socket'
import Game from '../../domain/game'
import domainActions from '../../domain/redux/client/actions'
import GameForClient from '../../domain/game-for-client'
import GameService from '../../domain/game-service'
import Player from '../../domain/player'
import actionCreators from '../../domain/redux/client/actions'
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
  playerName: string,
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
      playerName: '',
    }

    socket.on('updateGame', (plainGame) => {
      const game = new GameForClient(plainGame)
      this.props.dispatch(domainActions.updateGame(game))
    })

    socket.on('disconnect', (playerName) => {
      console.log(`${playerName} disconnect`)
    })
  }

  isJoined() {
    return this.props.domain.game.isJoined()
  }

  isInProgress() {
    return this.props.domain.game.progress.isInProgress
  }

  addPlayer = () => {
    if (this.isJoined() || this.state.playerName.length === 0) return
    socket.emit('addPlayer', this.state.playerName)
  }

  startGame = () => {
    if (!this.isReady() || this.isInProgress()) return
    const { HORIZONTAL, VERTICAL } = NUMBER_OF_CARDS
    const center = getCenterPoint(HORIZONTAL, VERTICAL)
    socket.emit('startGame', center)
  }

  updateUserName(e) {
    this.setState({
      playerName: e.target.value
    })
  }

  isReady() {
    return this.props.domain.game.getNumberOfPlayers() >= 2
  }

  render() {
    if (this.isInProgress()) return <Redirect to={PATH.GAME} />
    const game = this.props.domain.game

    return (
      <View style={styles.container}>
        <Text>crossword</Text>

        <Text>join from here</Text>
        <Text>input your name </Text>
        <TextInput
          onBlur={(e) => this.updateUserName(e)}
        />
        <Text
          onClick={this.addPlayer}
          style={this.isJoined() ? styles.disable : null}
        >
          join
        </Text>
        <Text>members waiting for the game</Text>
        {game.getNumberOfPlayers() > 0 &&

          <Text>{game.getPlayersName().join(', ')}</Text>
        }

        <TouchableOpacity onPress={this.startGame}>
          <Text style={this.isReady() ? null : styles.disable}>
            start game!!!
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
