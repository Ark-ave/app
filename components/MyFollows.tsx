import React from 'react'
import { View, Text } from './Themed'
import t from '../utils/locale'
import Loading from './LottieAnim/Default'
import { ArkFolder, ArkFollow, ArkFollowMutate } from '../types'
import FollowList from './Follow/List'

interface Props {
  isLoading: boolean
  follows: ArkFollow[]
  error: any
  mutate: ArkFollowMutate
}

export default function MyFollows({
  isLoading,
  follows,
  error,
  mutate,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loading />}
      {!isLoading && (follows || []).length === 0 && !error && (
        <View style={{ paddingVertical: 50 }}>
          <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
            {t('there is no follows')}
          </Text>
        </View>
      )}
      {!isLoading && !!error && (
        <Text style={{ fontSize: 18, opacity: 0.7, textAlign: 'center' }}>
          {`😱 ${error.message}`}
        </Text>
      )}
      {!!follows && <FollowList follows={follows} mutate={mutate} />}
    </View>
  )
}
