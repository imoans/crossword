// @flow

import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import COLORS from '../constants/colors'
import FONT_SIZE from '../constants/font-size'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  value: {
    color: COLORS.TEXT,
  },
})

type Props = {
  value: string
}

const Card = (props) => {
  return (
    <View styles={style.container}>
      <Text styles={style.value}>{props.value}</Text>
    </View>
  )
}

export default Card
