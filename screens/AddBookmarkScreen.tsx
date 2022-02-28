import { useRoute } from '@react-navigation/core'
import * as React from 'react'
import { StyleSheet } from 'react-native'

import AddBookmark from '../components/Bookmark/Create'
import { View } from '../components/Themed'

export default function AddBookmarkScreen(props: any) {
  const { params } = useRoute()
  const mutate = (params as any).mutate

  return (
    <View style={styles.container}>
      <AddBookmark mutate={mutate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
