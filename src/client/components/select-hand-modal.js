// @flow

import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import CardView from './card'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
  },
  hands: {
    flex: 1,
    flexDirection: 'row',
  }
})

type Props = {
  visible: boolean,
  hands: Array<Card>,
  onSelectedHand: (hand: Card) => void,
}

// TODO change to modal after modal support
const SelectHandModal = (props: Props) => {
  if (!props.visible) return null
  return (
    <View style={styles.container}>
      <Text>Select card to put here</Text>
      <View style={styles.hands}>
        {props.hands.map((hand, i) => (
          <CardView
            key={i}
            value={hand.value}
            onPress={() => props.onSelectedHand(hand)}
          />
        ))}
      </View>
    </View>
  )
}

export default SelectHandModal
