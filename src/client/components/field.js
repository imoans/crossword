// @flow

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import COLORS from '../constants/colors'
import type { CardsArrangement, Point } from '../../domain/field'
import Card, { CARD_SIZE } from './card'
import { range } from '../../util/array'

export const NUMBER_OF_CARDS = {
  HORIZONTAL: 11,
  VERTICAL: 11,
}

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE.WIDTH * NUMBER_OF_CARDS.HORIZONTAL,
    height: CARD_SIZE.HEIGHT * NUMBER_OF_CARDS.VERTICAL,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    borderWidth: 1,
    borderColor: COLORS.BASE,
    width: CARD_SIZE.WIDTH,
    height: CARD_SIZE.HEIGHT,
  }
})

type Props = {
  point: Point,
  cardToPut: Card,
  field: Field,
  onPressCard: () => void,
  onPressTile: (point: Point) => void,
}

const getHorizontalCardsFromLeft = (row: number, field: Field): Array<Card> => {
  const { HORIZONTAL } = NUMBER_OF_CARDS
  const cardsAtRow = range(1, HORIZONTAL).map(x => (
    field.getCardByPoint({ x, y: row })
  ))

  return cardsAtRow
}

const renderRow = (cards: Array<Card>, onPressTile, row, selectedPoint, cardToPut, onPressCard) => {
  return (
    <View style={styles.row}>
    {range(1, NUMBER_OF_CARDS.HORIZONTAL).map(x => {
      const selected = selectedPoint.x && selectedPoint.y && selectedPoint.x === x && selectedPoint.y === row
      const card = cards[x - 1]
      const point = { x, y: row }
      if (selected && cardToPut || card != null) {
        const value = card ? card.value : cardToPut.value
        return (
          <Card
            key={x}
            value={value}
            onPress={() => onPressCard(card, point)}
          />
        )
      }
      return (
        <Tile
          key={x}
          selected={selected}
          onPress={() => onPressTile(point)}
        />
      )
    })}
    </View>
  )
}

const Field = (props: Props) => {
  const { field } = props
  return (
    <View style={styles.container}>
      {range(1, NUMBER_OF_CARDS.VERTICAL).map(y => {
        const cards = getHorizontalCardsFromLeft(y, field)
        return renderRow(cards, props.onPressTile, y, props.point, props.cardToPut, props.onPressCard)
      })}
    </View>
  )
}

const Tile = (props: { onPress: () => void, selected: boolean }) => {
  const { ACCENT, PRIMARY } = COLORS
  const backgroundColor = props.selected ? PRIMARY : ACCENT
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.tile, { backgroundColor }]} />
    </TouchableOpacity>
  )

}

export default Field
