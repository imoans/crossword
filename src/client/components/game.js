// @flow

import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import { View, Text, StyleSheet } from 'react-native'
import COLORS from '../constants/colors'
import GameServiceForClient from '../../domain/game-service-for-client'
import GameForClient from '../../domain/game-for-client'
import actionCreators from '../../domain/redux/client/actions'
import SelectHandModal from './select-hand-modal'
import SelectWordModal from './select-word-modal'
import DrawCardModal from './draw-card-modal'
import Card from './card'
import Field, { NUMBER_OF_CARDS } from './field'
import socket from '../socket'

type Props = {
  domain: DomainState,
  dispatch: any,
}

export type WordByPoint = {[value: string]: Point}

type State = {
  selectHandsModalVisible: boolean,
  selectWordModalVisible: boolean,
  drawCardModalVisible: boolean,
  wordByPoint: WordByPoint,
  point: Point,
  cardToPut: ?Card,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
})

export default class Game extends Component {
  static getWord(wordByPoint: WordByPoint): string {
    const points = Object.keys(wordByPoint).map(word => wordByPoint[word])
    points.sort((a,b) => a.x - b.x)
    points.sort((a,b) => a.y - b.y)

    return points.map(point => (
      Object.keys(wordByPoint).find(word => {
        const cardPoint = wordByPoint[word]
        return cardPoint.x === point.x && cardPoint.y === point.y
      })
    )).join('')
  }

  constructor(props) {
    super(props)

    socket.on('updateGame', (plainGameForClient) => {
      const game = new GameForClient(plainGameForClient)
      this.props.dispatch(actionCreators.updateGame(game))
    })
  }

  state: State = {
    selectHandsModalVisible: false,
    selectWordModalVisible: false,
    drawCardModalVisible: false,
    point: {},
    wordByPoint: {},
    cardToPut: null,
  }

  isYourTurn() {
    return this.props.domain.game.isYourTurn()
  }

  onSelectedHand = (hand: Card) => {
    this.setState({ cardToPut: hand })
    if (Object.keys(this.state.wordByPoint) === 0) return
    const service = new GameServiceForClient(this.props.domain.game)
    const game = service.putCard(hand, this.state.point)
    socket.emit('updateGame', game)
  }

  onPressTile = (point: Point) => {
    if (!this.isYourTurn()) return
    this.setState({
      point,
      selectHandsModalVisible: true,
    })
  }

  onPressCard = (card: Card, point: Point) => {
    if (!this.isYourTurn()) return
    this.setState({
      wordByPoint: { ...this.state.wordByPoint, [card.value]: point }
    })
  }

  onCompleteWord = () => {
    const word = Game.getWord(this.state.wordByPoint)

    socket.emit('confirmPutCard', {
      word,
      card: this.state.cardToPut,
      point: this.state.point,
    })

    this.setState({
      cardToPut: null,
      point: {},
      wordByPoint: {},
    })
  }

  onDrawCard = () => {
    const service = new GameServiceForClient(this.props.domain.game)
    const newGame = service.drawCard()
    this.props.dispatch(actionCreators.updateGame(newGame))
    socket.emit('updateGame', newGame)
  }

  render() {
    const game = this.props.domain.game
    const hands = game.getYourHands ? game.getYourHands() : []
    const playerNameOnTurnText =
      game.isYourTurn() ? 'your' : `${game.getPlayerOnTurn().name}'s`
    const field = game.field ? game.field : {}

    return (
      <View style={styles.container}>
        <Text>{game ? game.getPlayersName().join(', ') : ''}</Text>
        <Text>game!!!</Text>
        <Text>{`it's ${playerNameOnTurnText} turn!!!!!!`}</Text>
        <Text>{"number of player's hands"}</Text>
        <Text>{
          game.getPlayerIds().map(id => {
            const player = game.getPlayerById(id)
            if (player == null) return ''
            return `${player.name}: ${game.getNumberOfHandsByPlayerId(id)}`
          }).join('\n')
        }</Text>

        <SelectHandModal
          hands={hands}
          visible={this.state.selectHandsModalVisible}
          onSelectedHand={this.onSelectedHand}
        />
        <SelectWordModal
          visible={this.state.selectWordModalVisible}
          word={Game.getWord(this.state.wordByPoint)}
          onComplete={this.onCompleteWord}
        />
        <DrawCardModal
          visible={this.state.drawCardModalVisible}
          onPress={this.onDrawCard}
        />
        <Field
          point={this.state.point}
          field={field}
          cardToPut={this.state.cardToPut}
          onPressCard={this.onPressCard}
          onPressTile={this.onPressTile}
        />

        {hands.length > 0 &&
          <View style={{ flexDirection: 'row' }}>
            <Text>your hands</Text>
            {hands.map(
              (hand, i) => <Card key={i} value={hand.value} />
            )}
          </View>
        }

      </View>
    )
  }
}
