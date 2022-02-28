import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { View, Text, Heading } from '../components/Themed'
import { ArkBookmark, ArkFolder } from '../types'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import Feed from '../components/Feed'
import { Feather } from '@expo/vector-icons'
import { useBookmarksByFolder } from '../hooks/useTextile'
import { PAGE_SIZE } from '../utils/constants'
import Button from '../components/Button'
import t from '../utils/locale'
import Loading from '../components/LottieAnim/Default'

export default function FolderDetail() {
  const { params } = useRoute()
  const colorScheme = useColorScheme()
  const [page, setPage] = useState(1)
  const scrollView = useRef<ScrollView | null>(null)

  const folder = (params as any).folder as ArkFolder
  const pubkey = (params as any).pubkey as string

  const { bookmarks, isLoading, error } = useBookmarksByFolder(
    pubkey,
    folder._id!,
    page
  )

  const navigation = useNavigation()
  useEffect(() => {
    if (folder) {
      navigation.setOptions({ title: folder.title })
    }
  }, [folder])

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
      horizontal={false}
      alwaysBounceVertical
      scrollEventThrottle={16}
      ref={scrollView}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather
              name="folder"
              size={40}
              color={Colors[colorScheme].tint}
              style={{ marginRight: 10 }}
            />
            <Heading>{folder.title}</Heading>
          </View>
          <Text style={{ fontSize: 12, color: '#666', marginLeft: 50 }}>
            {folder.description}
          </Text>
        </View>
        {isLoading && <Loading />}
        {!isLoading && (bookmarks || []).length === 0 && !error && (
          <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
            {t('folder is empty')}
          </Text>
        )}
        {!isLoading && !!error && (
          <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
            {`😱 ${error.message}`}
          </Text>
        )}
        {(bookmarks || []).map((feed: ArkBookmark) => {
          return <Feed key={feed._id} feed={feed} isDigest folders={[]} />
        })}
        {!isLoading && (bookmarks || []).length === PAGE_SIZE && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button
              label={t('next page')}
              primary
              style={{ marginBottom: 50 }}
              onPress={() => {
                setPage(page + 1)
                scrollView &&
                  scrollView?.current!.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  })
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
