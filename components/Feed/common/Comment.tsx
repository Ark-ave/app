import React from 'react'
import { ArkBookmark } from '../../../types'
import { View, Text } from '../../Themed'
import useColorScheme from '../../../hooks/useColorScheme'
import Colors from '../../../constants/Colors'
import { Feather } from '@expo/vector-icons'

export default function Comment({ feed }: { feed: ArkBookmark }) {
  if (!feed.comment) {
    return null
  }
  const colorScheme = useColorScheme()
  return (
    <View
      style={{
        borderBottomWidth: 1,
        backgroundColor: Colors[colorScheme].contentBackground,
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: Colors[colorScheme].tint,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Feather
        name="feather"
        size={20}
        color={Colors[colorScheme].tint}
        style={{ marginRight: 10 }}
      />
      <Text style={{ fontSize: 20, fontFamily: 'NotoSansSC' }}>
        {feed.comment}
      </Text>
    </View>
  )
}
