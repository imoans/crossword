// @flow

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import COLORS from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    alignItems: 'center',
  },
  disable: {
    opacity: 0.5,
  }
})

type Props = {
  visible: boolean,
  onComplete: () => void,
  word: string,
}

// TODO change to modal after modal support
const SelectWordModal = (props: Props) => {
  if (!props.visible) return null
  const { word, onComplete } = props
  const textStyle = word.length === 0 ? styles.disable : null
  return (
    <View style={styles.container}>
      <Text>Select word</Text>
      <Text>{word}</Text>
      <TouchableOpacity onPress={onComplete}>
        <Text style={textStyle}>put card!!</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SelectWordModal
