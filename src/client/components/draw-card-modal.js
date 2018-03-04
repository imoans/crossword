// @flow

// import type { Card } from '../../domain/Card'
import React, { Component } from 'react'
import type { Point } from '../../domain/field'
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import Card from './card'

type Props = {
  visible: boolean,
  onPress: () => void,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default class DrawCardModal extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <View>
            <TouchableOpacity onPress={this.props.onPress}>
              <Text>draw card</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}
