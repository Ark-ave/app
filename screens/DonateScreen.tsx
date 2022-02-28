import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { View, Text, Heading } from '../components/Themed'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import t from '../utils/locale'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
import { Feather } from '@expo/vector-icons'

const BTC_ADDR = 'bc1qwlqm65al4gma5gd2lz649najpwvgvnrx60l2e8'
const ETH_ADDR = '0xd063D2c2529890f4156f536c5Ff47a2412d593aA'

export default function DonateScreen() {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()

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
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Text>{t('donate tip')}</Text>

        <Heading>BTC</Heading>
        <View style={styles.addressWrap}>
          <Text style={styles.addressText}>{BTC_ADDR}</Text>
          <Pressable
            style={styles.copyWrap}
            onPress={() => {
              Clipboard.setString(BTC_ADDR)
              Toast.show({
                type: 'success',
                text1: t('copied'),
                visibilityTime: 1000,
              })
            }}
          >
            <Feather name="copy" color="#666" size={18} />
          </Pressable>
        </View>

        <Heading>ETH</Heading>
        <View style={styles.addressWrap}>
          <Text style={styles.addressText}>{ETH_ADDR}</Text>
          <Pressable
            style={styles.copyWrap}
            onPress={() => {
              Clipboard.setString(ETH_ADDR)
              Toast.show({
                type: 'success',
                text1: t('copied'),
                visibilityTime: 1000,
              })
            }}
          >
            <Feather name="copy" color="#666" size={18} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  addressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  copyWrap: {
    padding: 10,
  },
  addressText: {
    maxWidth: 250,
  },
})
