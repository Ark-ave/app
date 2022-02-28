import * as React from 'react'
import { StyleSheet } from 'react-native'

import Create from '../components/Follow/Create'
import { View } from '../components/Themed'

export default function CreateFollow() {
  return (
    <View style={styles.container}>
      <Create />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
})
