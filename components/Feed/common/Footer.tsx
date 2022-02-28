import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { ArkBookmark, ArkFolder } from '../../../types'
import { getBookmarkFrom } from '../../../utils/bookmark'
import { Text } from '../../Themed'
import t from '../../../utils/locale'
import { Feather } from '@expo/vector-icons'
import Colors from '../../../constants/Colors'
import useColorScheme from '../../../hooks/useColorScheme'
import { useNavigation, CommonActions } from '@react-navigation/core'
import Singleton from '../../../utils/textile/instance'

const FeedFooter = ({
  feed,
  folders,
}: {
  feed: ArkBookmark
  folders: ArkFolder[]
}) => {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  let ct: ArkFolder | undefined = undefined
  if (feed.collectionId && folders) {
    ct = folders.find((t) => t._id === feed.collectionId)
  }

  return (
    <View>
      <View style={styles.metabar}>
        <Text style={styles.pubTime}>{`${t('published at')} ${
          feed.pubtime
        }`}</Text>
        <Text>
          <Text
            style={[styles.pubTime, styles.fromLink]}
            onPress={() => {
              WebBrowser.openBrowserAsync(feed.origin).catch((error) =>
                console.warn('An error occurred: ', error)
              )
            }}
          >
            {getBookmarkFrom(feed)}
          </Text>
        </Text>
      </View>
      {!!ct && (
        <Pressable
          onPress={() => {
            const instance = Singleton.getInstance()
            navigation.dispatch(
              CommonActions.navigate({
                name: 'FolderDetail',
                params: {
                  folder: ct as ArkFolder,
                  pubkey: instance.getPubkey(),
                },
              })
            )
          }}
        >
          <View style={styles.bookmark}>
            <Feather name="folder" size={18} color={Colors[colorScheme].tint} />
            <Text style={{ color: Colors[colorScheme].tint, marginLeft: 8 }}>
              {ct?.title}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  )
}

export default FeedFooter

const styles = StyleSheet.create({
  bookmark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 0.5,
    borderTopColor: '#999',
    marginTop: 4,
    paddingTop: 4,
  },
  pubTime: {
    color: '#999',
    fontSize: 12,
  },
  metabar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  fromLink: {},
})
