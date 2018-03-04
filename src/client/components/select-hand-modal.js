// @flow

// import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Card from './card'

type State = {
  visible: boolean,
}

type Props = {
  visible: boolean,
  hands: Array, // Array<Card>
  selectedPoint: Point,
  onSelectedHand: () => void,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hands: {
    flex: 1,
    flexDirection: 'row',
  }
})

export default class SelectHandModal extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <View>
            <Text>Select card to put here</Text>
            <View style={styles.hands}>
              {this.props.hands.map((hand, i) => (
                <Card
                  key={i}
                  value={hand.value}
                  onPress={() => this.props.onSelectedHand(hand)}
                />
              ))}
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
