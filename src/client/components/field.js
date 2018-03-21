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

const Tile = (props: { onPress: (point: Point) => void }) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.tile} />
    </TouchableOpacity>
  )
}

const Field = (props: Props) => {
  const { onPressCard, onPressTile, field } = props
  const { VERTICAL, HORIZONTAL } = NUMBER_OF_CARDS

  return (
    <View style={styles.container}>
    {range(1, VERTICAL).map(y => {
      const cards = range(1, HORIZONTAL).map(x => field.getCardByPoint({ x, y}))
      return (
        <View style={styles.row}>
        {cards.map((card, i) => {
          if (card != null) {
            return (
              <CardView
                key={i}
                value={card.value}
                onPress={() => onPressCard(card)}
              />
            )
          }

          return (
            <Tile
              key={i}
              onPress={() => onPressTile({ x: i + 1, y, })}
            />
          )
        })}
        </View>
      )
    })}
    </View>
  )
}

export default Field
