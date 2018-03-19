// @flow

import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import COLORS from '../constants/colors'
import FONT_SIZE from '../constants/font-size'

export const CARD_SIZE = {
  WIDTH: 40,
  HEIGHT: 50,
}

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE.WIDTH,
    height: CARD_SIZE.HEIGHT,
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BASE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: COLORS.BASE,
  },
})

type Props = {
  value: string,
  onPress: (card: any) => void,
}

const CardView = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <Text style={styles.value}>{props.value}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CardView
