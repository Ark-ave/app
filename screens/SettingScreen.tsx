import React from 'react'
import { ScrollView, useWindowDimensions, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View } from '../components/Themed'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import SettingItem from '../components/Profile/SettingItem'
import t from '../utils/locale'
import { useAppDispatch } from '../hooks/useStore'
import {
  loadAllBookmark,
  loadAllCollection,
  newIdentity,
} from '../store/account'
import { useNavigation } from '@react-navigation/core'
import Toast from 'react-native-toast-message'
import Singleton from '../utils/textile/instance'

export default function SettingScreen() {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
      contentContainerStyle={{ alignItems: 'center' }}
      horizontal={false}
      alwaysBounceVertical
    >
      <View
        style={{
          flexDirection: 'column',
          width: window.width,
          backgroundColor: Colors[colorScheme].contentBackground,
        }}
      >
        <SettingItem
          icon="log-out"
          label={t('signout')}
          hideBorderBottom
          hideChevron
          style={{ justifyContent: 'center' }}
          onPress={async () => {
            try {
              await AsyncStorage.setItem('identity', '')
              dispatch(newIdentity(''))

              const instance = Singleton.getInstance()
              instance.reset()

              navigation.goBack()
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: (error as any).message,
              })
            }
          }}
        />
      </View>
    </ScrollView>
  )
}
