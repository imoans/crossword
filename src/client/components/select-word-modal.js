// @flow

// import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Card from './card'
import type WordByPoint from './game'

type State = {
  visible: boolean,
}

type Props = {
  visible: boolean,
  wordByPoint: WordByPoint,
  onPress: () => void,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default class SelectWordModal extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <View>
            <Text>Select word</Text>
            <Text>{this.props.word}</Text>
            <TouchableOpacity onPress={this.props.onComplete}>
              <Text>put card!!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}
