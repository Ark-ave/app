import React, { useState, useRef } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

import Feed from './Feed'
import { View } from './Themed'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import LoadingModal from './Modals/LoadingModal'

import ActionSheetModal from './Modals/ActionSheetModal'
import t from '../utils/locale'
import { ArkBookmark, ArkFolder } from '../types'
import Singleton from '../utils/textile/instance'
import { PAGE_SIZE } from '../utils/constants'
import Button from '../components/Button'
import { useScrollToTop } from '@react-navigation/native'

interface Props {
  bookmarks: ArkBookmark[]
  folders: ArkFolder[]
  isLoading: boolean
  page: number
  setPage: (page: number) => void
  mutate: (action: string, bms: ArkBookmark) => void
  refreshing: boolean
  refetch: () => void
}

export default function Feeds({
  bookmarks,
  folders,
  isLoading,
  page,
  setPage,
  mutate,
  refreshing,
  refetch,
}: Props) {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  const scrollView = useRef<ScrollView | null>(null)

  useScrollToTop(scrollView)

  const [operatingFeed, setOperatingFeed] = useState(null)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
      horizontal={false}
      alwaysBounceVertical
      ref={scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refetch} />
      }
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {bookmarks.map((feed, idx) => {
          return (
            <Feed
              key={feed._id}
              feed={feed}
              folders={folders}
              isDigest
              onOperate={(feed) => setOperatingFeed(feed as any)}
            />
          )
        })}
        {!isLoading && (bookmarks || []).length === PAGE_SIZE && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button
              label={t('next page')}
              primary
              style={{ marginBottom: 20 }}
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

      {operatingFeed && (
        <ActionSheetModal
          modalVisible
          setModalVisible={() => setOperatingFeed(null)}
          options={[
            {
              title: t('edit'),
              onPress: () => {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'BookmarkDetail',
                    params: {
                      feed: operatingFeed,
                      editable: true,
                      mutate,
                    },
                  })
                )
                setOperatingFeed(null)
              },
            },
            {
              title: t('delete'),
              onPress: async () => {
                const feed = { ...(operatingFeed as any) }

                try {
                  setOperatingFeed(null)
                  setLoadingModalVisible(true)
                  const instance = Singleton.getInstance()
                  await instance.deleteBookmarks([feed._id!])
                  setLoadingModalVisible(false)
                  mutate('delete', feed)
                } catch (error) {
                  Toast.show({
                    type: 'error',
                    text1: (error as any).message,
                  })
                  setLoadingModalVisible(false)
                  setOperatingFeed(feed)
                }
              },
            },
          ]}
        />
      )}
      <LoadingModal
        modalVisible={loadingModalVisible}
        setModalVisible={setLoadingModalVisible}
      />
    </ScrollView>
  )
}
