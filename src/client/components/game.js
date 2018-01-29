// @flow

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import COLORS from '../constants/colors'
import GameService from '../../domain/game-service'
import actionCreators from '../../domain/redux/actions'
import Card from './card'

type Props = {
  domain: DomainState,
  dispatch: any,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
})

export default class Game extends Component {
  constructor(props) {
    super()
    this.service = new GameService(props.domain.game)
  }

  componentDidMount() {
    const game = this.service.dealHands()
    this.props.dispatch(actionCreators.updateGame(game))
  }

  render() {
    const domain = this.props
    const hands = domain.game ? game.getHands() : []

    return (
      <View style={styles.container}>
        <Text>{domain.game ? game.getPlayersName().join(', ') : ''}</Text>
        <Text>game!!!</Text>
        <Text>your hands</Text>
        {hands.map(hand => <Card value={hand.value} />)}
      </View>
    )
  }
}
