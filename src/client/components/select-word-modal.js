// @flow

// import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Card from './card'
import type WordByPoint from './game'

type State = {
  visible: boolean,
  putButtonDisable: boolean,
}

type Props = {
  visible: boolean,
  wordByPoint: WordByPoint,
  onComplete: () => void,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disable: {
    opacity: 0.5,
  }
})


export default class SelectWordModal extends Component {
  onPress = () => {
    if (this.props.word.length === 0) return
    this.props.onComplete()
  }

  render() {
    const textStyle = this.props.word.length === 0 ? styles.disable : null
    return (
      <View style={styles.container}>
        <Modal
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <View>
            <Text>Select word</Text>
            <Text>{this.props.word}</Text>
            <TouchableOpacity onPress={this.onPress}>
              <Text style={textStyle}>put card!!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}
