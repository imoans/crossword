// @flow

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import COLORS from '../constants/colors'
import type { Card } from '../../domain/card'
import type { CardsArrangement, Point } from '../../domain/field'
import CardView, { CARD_SIZE } from './card'
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
    backgroundColor: COLORS.ACCENT,
  }
})

type Props = {
  field: Field,
  onPressCard: (card: Card) => void,
  onPressTile: (point: Point) => void,
}

const getHorizontalCardsFromLeft = (row: number, field: Field): Array<Card> => {
  const { HORIZONTAL } = NUMBER_OF_CARDS
  return range(1, HORIZONTAL).map(x => (
    field.getCardByPoint({ x, y: row })
  ))
}

const renderRow = (row: number, props: Props) => {
  const { onPressCard, onPressTile, field } = props
  const cards = getHorizontalCardsFromLeft(row, field)

  return (
    <View style={styles.row}>
    {range(1, NUMBER_OF_CARDS.HORIZONTAL).map(x => {
      const card = cards[x - 1]
      if (card != null) {
        return (
          <CardView
            key={x}
            value={card.value}
            onPress={() => onPressCard(card)}
          />
        )
      }

      const point = { x, y: row }
      return (
        <Tile
          key={x}
          onPress={() => onPressTile(point)}
        />
      )
    })}
    </View>
  )
}

const Field = (props: Props) => {
  return (
    <View style={styles.container}>
      {range(1, NUMBER_OF_CARDS.VERTICAL).map(y => renderRow(y, props))}
    </View>
  )
}

const Tile = (props: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.tile} />
    </TouchableOpacity>
  )
}

export default Field
