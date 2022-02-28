import React from 'react'
import { View, Text } from './Themed'
import t from '../utils/locale'
import Loading from './LottieAnim/Default'
import { ArkBookmark, ArkFolder } from '../types'
import Feeds from './Feeds'

interface Props {
  bookmarks: ArkBookmark[]
  folders: ArkFolder[]
  isLoading: boolean
  error: any
  mutate: (action: string, bm: ArkBookmark) => void
  page: number
  setPage: (page: number) => void
  refetch: () => void
  refreshing: boolean
}

export default function MyBookmarks({
  bookmarks,
  isLoading,
  folders,
  error,
  mutate,
  page,
  setPage,
  refetch,
  refreshing,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading />}
      {!isLoading && (folders || []).length === 0 && !error && (
        <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
          {t('there is no bookmark')}
        </Text>
      )}
      {!isLoading && !!error && (
        <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
          {`😱 ${error.message}`}
        </Text>
      )}
      {!!bookmarks && (
        <Feeds
          folders={folders || []}
          bookmarks={(bookmarks || []) as ArkBookmark[]}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          mutate={mutate}
          refreshing={refreshing}
          refetch={refetch}
        />
      )}
    </View>
  )
}
