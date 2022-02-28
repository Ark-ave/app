import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, TextInput, useWindowDimensions } from 'react-native'
import WebView from 'react-native-webview'
import Toast from 'react-native-toast-message'
import * as Clipboard from 'expo-clipboard'
import TurndownServiceStr from '../../utils/injects/turndown'
import {
  doubanNote,
  doubanStatus,
  doubanTopic,
} from '../../utils/injects/douban'
import Feed from '../Feed'
import { ScrollView } from 'react-native-gesture-handler'
import { ArkBookmark, BookmarkType } from '../../types'
import { wechatArticle } from '../../utils/injects/wechat'
import Loader from '../Feed/Loader'
import { useNavigation } from '@react-navigation/native'
import { View, Text } from '../Themed'
import BottomActions from './BottomActions'
import { weibo } from '../../utils/injects/weibo'
import { commonArticle } from '../../utils/injects/common'
import t from '../../utils/locale'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import Singleton from '../../utils/textile/instance'

export default function AddBookmark({
  mutate,
}: {
  mutate: (action: string, bm: ArkBookmark) => void
}) {
  const [actionVisible, setActionVisible] = useState(false)
  const [feed, setFeed] = useState(null)
  const [uri, setURI] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()
  const webviewRef = useRef(null)
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()

  useEffect(() => {
    const instance = Singleton.getInstance()
    if (instance.getIdentity()) {
      setActionVisible(true)
    }
    Clipboard.getStringAsync()
      .then((str) => {
        if (str.startsWith('https://')) {
          setURI(str)
        }
      })
      .catch(console.log)
  }, [])

  let uriType = BookmarkType.OTHER
  if (/douban.com\/people\/\S*\/status\/\d/.test(uri)) {
    uriType = BookmarkType.DOUBAN_STATUS
  } else if (
    /douban.com\/(note|review|(movie|book|music)\/review)\/\d/.test(uri)
  ) {
    uriType = BookmarkType.DOUBAN_NOTE
  } else if (/douban.com\/group\/topic\/\d/.test(uri)) {
    uriType = BookmarkType.DOUBAN_TOPIC
  } else if (/mp.weixin.qq.com\/s/.test(uri)) {
    uriType = BookmarkType.WECHAT_ARTICLE
  } else if (/weibo.(com|cn)\/detail\/\d/.test(uri)) {
    uriType = BookmarkType.WEIBO
  }

  const isValidUri =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
      uri
    )

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 10,
          width: window.width,
        }}
        horizontal={false}
        alwaysBounceVertical
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: Colors[colorScheme].textInputBackground,
            },
          ]}
          value={uri}
          onChangeText={(text) => setURI(text)}
        />

        {!isLoading && !!feed && <Feed feed={feed as any} folders={[]} />}

        {!!uri && !isValidUri && (
          <View style={styles.placeholder}>
            <Text style={styles.uriNotSupport}>{t('invalid url')}</Text>
          </View>
        )}

        {isValidUri && isLoading && (
          <View style={styles.loadingWrap}>
            <Loader />
          </View>
        )}

        {isValidUri && (
          <WebView
            ref={webviewRef}
            source={{ uri }}
            style={{ height: 0 }}
            injectedJavaScript={TurndownServiceStr}
            onLoadStart={() => {
              setIsLoading(true)
            }}
            onLoadEnd={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              if (!nativeEvent.loading && webviewRef) {
                const current = webviewRef?.current as any
                if (uriType === BookmarkType.DOUBAN_STATUS) {
                  current.injectJavaScript(doubanStatus)
                } else if (uriType === BookmarkType.DOUBAN_NOTE) {
                  current.injectJavaScript(doubanNote)
                } else if (uriType === BookmarkType.DOUBAN_TOPIC) {
                  current.injectJavaScript(doubanTopic)
                } else if (uriType === BookmarkType.WECHAT_ARTICLE) {
                  current.injectJavaScript(wechatArticle)
                } else if (uriType === BookmarkType.WEIBO) {
                  current.injectJavaScript(weibo)
                } else {
                  current.injectJavaScript(commonArticle)
                }
              }
            }}
            onMessage={(event) => {
              try {
                const feed = JSON.parse(event.nativeEvent.data)
                if (feed.error) {
                  setIsLoading(false)
                  Toast.show({
                    type: 'error',
                    text1: t('parsed error'),
                  })
                } else {
                  setFeed({
                    ...feed,
                    refer: feed.refer
                      ? JSON.stringify(feed.refer)
                      : feed.refer ?? '',
                  })
                  setIsLoading(false)
                  if (uriType !== BookmarkType.DOUBAN_STATUS) {
                    navigation.setOptions({ title: feed.title ?? '' })
                  }
                }
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: (error as any).message,
                })
              }
            }}
          />
        )}
      </ScrollView>
      {actionVisible && <BottomActions feed={feed} mutate={mutate} />}
    </View>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    marginTop: 30,
  },
  input: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 2,
    color: '#333',
    marginTop: 20,
    marginBottom: 0,
    borderColor: '#333',
    borderWidth: 2,
    width: '100%',
  },
  uriNotSupport: {
    textAlign: 'center',
    color: '#999',
  },
  loadingWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
})
