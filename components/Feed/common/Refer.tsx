import React, { useEffect, useState } from 'react'
import useColorScheme from '../../../hooks/useColorScheme'
import { ArkBookmark, BookmarkType } from '../../../types'
import Markdown from '../../Markdown'
import Tweet from '../Tweet'
import Colors from '../../../constants/Colors'

export default function Refer({ feed }: { feed: ArkBookmark }) {
  const [parsedRefer, setParsedRefer] = useState(feed.refer)
  const [parsing, setParsing] = useState(true)
  const colorScheme = useColorScheme()
  useEffect(() => {
    try {
      const result = JSON.parse(feed.refer)
      setParsedRefer(result as any)
      setParsing(false)
    } catch (error) {
      setParsedRefer(feed.refer as any)
      setParsing(false)
    }
  }, [feed.refer])

  if (parsing) {
    return null
  }

  const isWeibo = feed.type === BookmarkType.WEIBO
  let weiboRefer = {}
  if (isWeibo) {
    weiboRefer = {
      backgroundColor: Colors[colorScheme].quotedContentBackground,
      padding: 10,
      marginTop: 10,
    }
  }
  return typeof parsedRefer === 'string' ? (
    <Markdown
      key="refer-markdown"
      content={parsedRefer}
      feed={feed}
      style={{
        marginTop: 15,
        ...weiboRefer,
        text: {
          fontSize: 18,
        },
      }}
    />
  ) : (
    <Tweet
      key="refer-tweet"
      feed={parsedRefer as ArkBookmark}
      isQuoted
      folders={[]}
    />
  )
}
