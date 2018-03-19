// @flow

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
  },
})

type Props = {
  visible: boolean,
  onPress: () => void,
}

// TODO change to modal after modal support
const DrawCardModal = (props: Props) => {
  if (!props.visible) return null
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onPress}>
        <Text>draw card</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DrawCardModal
