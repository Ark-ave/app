import React from 'react'
import { useWindowDimensions } from 'react-native'
import { ScrollView } from 'react-native'
import { useScrollToTop } from '@react-navigation/native'

import Folder from '.'
import { View } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import { ArkFolder, ArkFolderMutate } from '../../types'

export default function Folders({
  folders,
  mutate,
}: {
  folders: ArkFolder[]
  mutate?: ArkFolderMutate
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
        {(folders || []).map((folder, idx) => {
          return <Folder key={idx} folder={folder} mutate={mutate} />
        })}
      </View>
    </ScrollView>
  )
}
