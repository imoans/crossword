// @flow

import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import { unique } from '../../util/array'
import { View, Text, StyleSheet } from 'react-native'
import COLORS from '../constants/colors'
import GameServiceForClient from '../../domain/game-service-for-client'
import GameForClient, { type PlainGameForClient } from '../../domain/game-for-client'
import type { CardsArrangement } from '../../domain/field'
import actionCreators from '../../domain/redux/client/actions'
import SelectHandModal from './select-hand-modal'
import SelectWordModal from './select-word-modal'
import SkipTurnModal from './skip-turn-modal'
import CardView from './card'
import Field, { NUMBER_OF_CARDS } from './field'
import socket from '../socket'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
    justifyContent: 'space-around',
  },
  handsViewContainer: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    alignItems: 'center',
  },
  handsView: {
    flexDirection: 'row',
  }
})

type Props = {
  domain: DomainState,
  dispatch: any,
}

type State = {
  cardsArrangementBeforeConfirm: CardsArrangement,
  cardIdsToMakeWord: Array<string>,
  handToPut: ?Card,
  errorString: string,
}

export default class Game extends Component {
  constructor(props: Props) {
    super(props)

    socket.on('updateGame', (plainGameForClient: PlainGameForClient) => {
      const game = new GameForClient(plainGameForClient)
      this.props.dispatch(actionCreators.updateGame(game))
    })

    socket.on('failedToPutCard', (word: string) => {
      this.setState({
        errorString: `${word} is invalid!`
      })
    })
  }

  state: State = {
    cardIdsToMakeWord: [],
    handToPut: null,
    errorString: '',
  }

  getWord(): string {
    const { cardIdsToMakeWord } = this.state
    const field = this.props.domain.game.field
    const { temporaryCardsArrangament, cardsArrangement } = field
    const points = cardIdsToMakeWord.map(id => {
      return cardsArrangement[id] || temporaryCardsArrangament[id]
    })
    points.sort((a,b) => a.x - b.x)
    points.sort((a,b) => a.y - b.y)

    return points.map(point => field.getCardByPoint(point).value).join('')
  }

  isYourTurn() {
    return this.props.domain.game.isYourTurn()
  }

  onSelectedHand = (hand: Card) => {
    this.setState({ handToPut: hand })
  }

  onPressTile = (point: Point) => {
    if (!this.isYourTurn() || this.state.handToPut == null) return
    // TODO check point
    const service = new GameServiceForClient(this.props.domain.game)
    const game = service.putCard(this.state.handToPut, point)
    socket.emit('updateGame', game)
  }

  onPressCard = (card: Card) => {
    if (!this.isYourTurn()) return
    const cardIdsToMakeWord = unique(this.state.cardIdsToMakeWord.concat(card.id))
    this.setState({ cardIdsToMakeWord })
  }

  onCompleteWord = () => {
    socket.emit('confirmPutCard', this.getWord())
    this.initializeState()
  }

  initializeState() {
    this.setState({
      handToPut: null,
      cardIdsToMakeWord: [],
      errorString: '',
    })
  }

  onSkipTurn = () => {
    socket.emit('skipTurn')
    this.initializeState()
  }

  onCancelPuttingCard = () => {
    socket.emit('cancelPutting')
    this.initializeState()
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
          handToPut={this.state.handToPut}
          visible={this.isYourTurn()}
          onSelectedHand={this.onSelectedHand}
          onCancel={this.onCancelPuttingCard}
        />
        <SelectWordModal
          visible={this.isYourTurn()}
          word={this.getWord()}
          onComplete={this.onCompleteWord}
        />
        <SkipTurnModal
          visible={this.isYourTurn()}
          onPress={this.onSkipTurn}
        />
        {this.state.errorString.length > 0 &&
          <Text>{this.state.errorString}</Text>
        }
        <Field
          field={field}
          onPressCard={this.onPressCard}
          onPressTile={this.onPressTile}
        />
        {hands.length > 0 &&
          <View style={styles.handsViewContainer}>
            <Text>your hands</Text>
            <View style={styles.handsView}>
              {hands.map(
                (hand, i) => <CardView key={i} value={hand.value} />
              )}
            </View>
          </View>
        }
      </View>
    )
  }
}
