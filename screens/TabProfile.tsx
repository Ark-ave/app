import * as React from 'react'
import { StyleSheet, Pressable, SafeAreaView } from 'react-native'

import Profile from '../components/Profile'
import { View, Text } from '../components/Themed'
import t from '../utils/locale'
import { RootTabScreenProps } from '../types'

export default function TabProfile({
  navigation,
}: RootTabScreenProps<'TabProfile'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30, fontFamily: 'NotoSerifSC-Bold' }}>
          {t('user')}
        </Text>
        <Pressable></Pressable>
      </View>
      <Profile />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    width: '100%',
  },
})
