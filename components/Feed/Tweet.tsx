import React from 'react'
import { ArkBookmark, ArkFolder } from '../../types'
import styles from './styles'
import Markdown from '../Markdown'
import { View } from '../Themed'
import FeedTitle from './common/Title'
import FeedFooter from './common/Footer'
import FeedHeader from './common/Header'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import FeedComment from './common/Comment'
import Refer from './common/Refer'

interface Props {
  feed: ArkBookmark
  folders: ArkFolder[]
  style?: StyleSheet
  isQuoted?: boolean
}

export default function Tweet({ feed, style, isQuoted, folders }: Props) {
  const colorScheme = useColorScheme()

  if (!feed) {
    return null
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
        {
          backgroundColor: isQuoted
            ? Colors[colorScheme].quotedContentBackground
            : Colors[colorScheme].contentBackground,
        },
      ]}
    >
      <FeedComment feed={feed} />
      <FeedHeader feed={feed} isQuoted={isQuoted} />
      <FeedTitle
        feed={feed}
        style={{
          text: {
            color: Colors[colorScheme].text,
            fontSize: 18,
            lineHeight: 32,
            fontFamily: 'NotoSerifSC',
          },
          link: {
            color: '#008cd5',
            textDecorationLine: 'underline',
            fontStyle: 'italic',
          },
        }}
      />
      {!!feed.content && (
        <Markdown
          key="content"
          content={feed.content}
          feed={feed}
          style={{
            text: {
              color: Colors[colorScheme].text,
              fontFamily: 'NotoSerifSC',
            },
          }}
        />
      )}
      {refer}
      {!isQuoted && <FeedFooter feed={feed} folders={folders} />}
    </View>
  )
}
