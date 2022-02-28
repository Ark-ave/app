import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import BottomActions from '../components/Bookmark/BottomActions'
import Feed from '../components/Feed'
import { useAppSelector } from '../hooks/useStore'
import { useFolderByID } from '../hooks/useTextile'
import { selectCollectionById } from '../store/account'
import { ArkBookmark, RootStackScreenProps } from '../types'

export default function BookmarkDetail({
  navigation,
}: RootStackScreenProps<'BookmarkDetail'>) {
  const { params } = useRoute()

  const feed = (params as any).feed as ArkBookmark
  const editable = (params as any).editable as boolean
  const mutate = (params as any).mutate
  const { folder } = useFolderByID(feed.collectionId!)

  useEffect(() => {
    if (feed) {
      navigation.setOptions({ title: feed.title })
    }
  }, [feed])

  if (!editable) {
    return (
      <ScrollView style={styles.container}>
        <Feed feed={feed} folders={[]} />
      </ScrollView>
    )
  }
  return (
    <ScrollView horizontal={false} alwaysBounceVertical>
      <BottomActions
        feed={feed}
        defaultFolder={folder}
        editable
        mutate={mutate}
      />
      <Feed feed={feed} folders={[]} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
