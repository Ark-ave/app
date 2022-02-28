import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/core'
import * as React from 'react'
import { StyleSheet, ScrollView, Pressable } from 'react-native'

import { Text, View } from '../components/Themed'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { useMyFolders } from '../hooks/useTextile'
import { ArkFolder, RootStackScreenProps } from '../types'

export default function SelectFolder({
  navigation,
}: RootStackScreenProps<'SelectFolder'>) {
  const { params } = useRoute()
  const selectedFolder = (params as any)?.selectedFolder as
    | ArkFolder
    | undefined
  const setSelectedFolder = (params as any)?.setSelectedFolder as (
    folder: ArkFolder
  ) => void

  const colorScheme = useColorScheme()

  const { folders } = useMyFolders()

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {folders.map((folder: ArkFolder) => {
          return (
            <Pressable
              key={folder._id}
              onPress={() => {
                setSelectedFolder && setSelectedFolder(folder)
                navigation.goBack()
              }}
            >
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>{folder.title}</Text>
                {folder._id === selectedFolder?._id && (
                  <Feather
                    name="check"
                    size={24}
                    color={Colors[colorScheme].tint}
                  />
                )}
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
})
