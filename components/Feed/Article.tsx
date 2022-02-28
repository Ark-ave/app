import React from 'react'
import { CommonActions, useNavigation } from '@react-navigation/native'
import LZString from 'lz-string'
import { ArkBookmark, ArkFolder, BookmarkType } from '../../types'

import Markdown from '../Markdown'
import { Text, View } from '../Themed'
import FeedTitle from './common/Title'
import FeedFooter from './common/Footer'
import FeedHeader from './common/Header'
import styles from './styles'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import t from '../../utils/locale'
import FeedComment from './common/Comment'
import Refer from './common/Refer'

interface Props {
  feed: ArkBookmark
  folders: ArkFolder[]
  style?: StyleSheet
  isQuoted?: boolean
  isDigest?: boolean
}

export default function Article({ feed, isQuoted, isDigest, folders }: Props) {
  const navigation = useNavigation()
  const colorScheme = useColorScheme()

  if (!feed) {
    return null
  }

  let isLongArticle = false,
    content = formatContent(feed.content || '')

  if (content && isDigest && content.length > 200) {
    content = content.slice(0, 180) + '...'
    isLongArticle = true
  }

  let refer = null
  if (feed.refer) {
    refer = <Refer feed={feed} />
  }
  return (
    <View
      style={[
        styles.feedItem,
        isQuoted && styles.quotedItem,
        { backgroundColor: Colors[colorScheme].contentBackground },
      ]}
    >
      <FeedComment feed={feed} />
      {feed.type !== BookmarkType.OTHER && <FeedTitle feed={feed} />}
      <FeedHeader feed={feed} isQuoted={isQuoted} />
      {!!content && (
        <Markdown
          key="content"
          content={content}
          feed={feed}
          style={{
            text: {
              color: Colors[colorScheme].text,
              fontSize: 18,
              lineHeight: 32,
              fontFamily: 'NotoSerifSC',
            },
          }}
        />
      )}
      {isDigest && isLongArticle && (
        <Text
          style={styles.readMore}
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'BookmarkDetail',
                params: {
                  feed,
                  editable: false,
                },
              })
            )
          }}
        >
          {t('read more')}
        </Text>
      )}
      {refer}
      <FeedFooter feed={feed} folders={folders} />
    </View>
  )
}

function formatContent(content: string) {
  if (!content) {
    return ''
  }
  if (content.startsWith('lz:')) {
    return LZString.decompress(content.substr(3))
  }
  return content
}
