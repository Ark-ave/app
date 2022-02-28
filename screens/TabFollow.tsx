import * as React from 'react'
import { StyleSheet, Pressable, SafeAreaView } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { View, Text } from '../components/Themed'
import { ArkFolder, ArkFollow, RootTabScreenProps } from '../types'
import t from '../utils/locale'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import { useAppSelector } from '../hooks/useStore'
import { selectIdentity } from '../store/account'
import { useMyFollows } from '../hooks/useTextile'
import MyFollows from '../components/MyFollows'

export default function TabFollow({
  navigation,
}: RootTabScreenProps<'TabFollow'>) {
  const colorScheme = useColorScheme()
  const identity = useAppSelector(selectIdentity)

  const { follows, isLoading, error, mutate } = useMyFollows()

  const _mutateFollows = (action: string, follow: ArkFollow) => {
    switch (action) {
      case 'create':
        mutate([follow, ...follows])
        break
      case 'delete':
        mutate(follows.filter((t: ArkFollow) => t._id !== follow._id))
        break
      case 'update':
        mutate(
          follows.map((t: ArkFollow) => (t._id !== follow._id ? t : follow))
        )
        break
      default:
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30, fontFamily: 'NotoSerifSC-Bold' }}>
          {t('follow')}
        </Text>
        <Pressable
          onPress={() => {
            navigation.navigate('CreateFollow', {
              mutate: _mutateFollows,
            })
          }}
        >
          {!!identity && (
            <Feather
              name="user-plus"
              size={24}
              color={Colors[colorScheme].tint}
            />
          )}
        </Pressable>
      </View>
      <MyFollows
        follows={follows}
        isLoading={isLoading}
        error={error}
        mutate={_mutateFollows}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    width: '100%',
  },
})
