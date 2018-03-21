// @flow

import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import CardView from './card'
import COLORS from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    alignItems: 'center',
  },
  hands: {
    flex: 1,
    flexDirection: 'row',
  }
})

type Props = {
  visible: boolean,
  hands: Array<Card>,
  handToPut: ?Card,
  onSelectedHand: (hand: Card) => void,
  onCancel: () => void,
}

// TODO change to modal after modal support
const SelectHandModal = (props: Props) => {
  if (!props.visible) return null

  const { hands, handToPut, onSelectedHand, onCancel } = props
  return (
    <View style={styles.container}>
      <Text>Select card to put here</Text>
      <View style={styles.hands}>
      {hands.map(hand => {
        const selected = handToPut == null ? false : handToPut.id === hand.id
        return (
          <CardView
            key={hand.id}
            selected={selected}
            value={hand.value}
            onPress={() => onSelectedHand(hand)}
          />
        )})
      }
      </View>
      <TouchableOpacity onPress={onCancel}>
        <Text>cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SelectHandModal
