import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { ArkBookmark, ArkFolder, BookmarkType } from '../../types'
import { View } from '../Themed'

import Article from './Article'
import Tweet from './Tweet'
import { _deleteBookmarks } from '../../store/account'
import { isArticle } from '../../utils/bookmark'

interface Props {
  feed: ArkBookmark
  folders: ArkFolder[]
  style?: StyleSheet
  isQuoted?: boolean
  isDigest?: boolean
  onOperate?: (feed: ArkBookmark) => void
}

export default function Feed({ feed, isDigest, folders, onOperate }: Props) {
  if (!feed) {
    return null
  }

  let content = null
  if (isArticle(feed.type)) {
    content = <Article feed={feed} isDigest={isDigest} folders={folders} />
  } else {
    content = <Tweet feed={feed} folders={folders} />
  }

  return (
    <View style={{ marginBottom: 20 }}>
      {content}
      {!!onOperate && (
        <Pressable style={styles.operation} onPress={() => onOperate(feed)}>
          <Feather name="more-horizontal" size={20} color="#666" />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  operation: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
})
