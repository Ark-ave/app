import React from 'react'
import { useWindowDimensions } from 'react-native'
import { ScrollView } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'

import Card from './Card'
import { View } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import { ArkFollow, ArkFollowMutate } from '../../types'

export default function Follows({
  follows,
  mutate,
}: {
  follows: ArkFollow[]
  mutate?: ArkFollowMutate
}) {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()
  const scrollView = React.useRef<ScrollView | null>(null)

  useScrollToTop(scrollView)

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Colors[colorScheme].background,
      }}
      ref={scrollView}
      horizontal={false}
      alwaysBounceVertical
    >
      <View
        style={{
          flex: 1,
          maxWidth: window.width - 20,
        }}
      >
        {(follows || []).map((follow, idx) => {
          return <Card key={idx} follow={follow} mutate={mutate} />
        })}
      </View>
    </ScrollView>
  )
}
