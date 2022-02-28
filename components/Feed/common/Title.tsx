import React from 'react'
import { StyleSheet } from 'react-native'
import { ArkBookmark, BookmarkType } from '../../../types'
import Markdown from '../../Markdown'
import { Text } from '../../Themed'
import { isArticle } from '../../../utils/bookmark'

const FeedTitle = ({ feed, style }: { feed: ArkBookmark; style?: any }) => {
  if (feed.title === '' || feed.title === '\n') {
    return null
  }
  if (isArticle(feed.type)) {
    return <Text style={styles.articleTitle}>{feed.title}</Text>
  }
  return <Markdown key="title" content={feed.title} feed={feed} style={style} />
}

export default FeedTitle

const styles = StyleSheet.create({
  articleTitle: {
    fontSize: 24,
    fontFamily: 'NotoSerifSC-Bold',
  },
})
