import React from 'react'
import { View, Text } from './Themed'
import t from '../utils/locale'
import Loading from './LottieAnim/Default'
import { ArkFolder, ArkFolderMutate } from '../types'
import Folders from './Folder/List'

interface Props {
  isLoading: boolean
  folders: ArkFolder[]
  error: any
  mutate: ArkFolderMutate
}

export default function MyFolders({
  isLoading,
  folders,
  error,
  mutate,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading />}
      {!isLoading && (folders || []).length === 0 && !error && (
        <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
          {t('there is no folder')}
        </Text>
      )}
      {!isLoading && !!error && (
        <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
          {`😱 ${error.message}`}
        </Text>
      )}
      {!!folders && (
        <Folders folders={folders as ArkFolder[]} mutate={mutate} />
      )}
    </View>
  )
}
