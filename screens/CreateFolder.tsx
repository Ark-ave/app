import * as React from 'react'
import { StyleSheet } from 'react-native'

import Create from '../components/Folder/Create'
import { View } from '../components/Themed'

export default function CreateFolder() {
  return (
    <View style={styles.container}>
      <Create />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
})
