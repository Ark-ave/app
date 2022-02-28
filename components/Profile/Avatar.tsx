import React from 'react'
import { View, Text } from '../Themed'
import jdenticon from 'jdenticon'
import { SvgXml } from 'react-native-svg'
import { ellipsis } from '../../utils/parser'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import t from '../../utils/locale'

interface Props {
  size: number
  value: string
}

const Avatar = ({ size, value }: Props) => {
  const colorScheme = useColorScheme()
  const svg = jdenticon.toSvg(value, size, {
    hues: [360],
    lightness: {
      color: [0.0, 1.0],
      grayscale: [0.0, 1.0],
    },
    saturation: {
      color: 1.0,
      grayscale: 1.0,
    },
    backColor: '#fff',
  })

  return (
    <View
      style={[
        {
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}
    >
      <SvgXml xml={svg} />
      <View
        style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={{ marginRight: 10 }}>{ellipsis(value, 6, 8)}</Text>
        <Pressable
          onPress={() => {
            Clipboard.setString(value)
            Toast.show({
              type: 'success',
              text1: t('copied'),
              visibilityTime: 3000,
            })
          }}
        >
          <Feather name="copy" size={18} color={Colors[colorScheme].tint} />
        </Pressable>
      </View>
    </View>
  )
}

export default Avatar
