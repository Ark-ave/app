import React from 'react'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { View, Text } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import styles from './styles'

interface Props {
  label: string
  icon: string
  onPress: () => void
  extra?: any
  hideChevron?: boolean
  hideBorderBottom?: boolean
  style?: any
}

export default function SettingItem({
  label,
  icon,
  onPress,
  extra,
  hideChevron,
  hideBorderBottom,
  style,
}: Props) {
  const colorScheme = useColorScheme()

  return (
    <Pressable onPress={onPress} style={{ opacity: 0.9 }}>
      <View
        style={[
          styles.settingItem,
          {
            backgroundColor: Colors[colorScheme].contentBackground,
            borderBottomColor: Colors[colorScheme].seprator,
          },
          { borderBottomWidth: hideBorderBottom ? 0 : 1 },
          style,
        ]}
      >
        <View style={styles.betweenWrap}>
          <Feather
            name={icon as any}
            color={Colors[colorScheme].tint}
            size={20}
          />
          <Text style={styles.settingText}>{label}</Text>
        </View>

        {(extra || !hideChevron) && (
          <View style={styles.betweenWrap}>
            {extra}
            {!hideChevron && (
              <Feather
                name="chevron-right"
                size={16}
                color={Colors[colorScheme].tint}
                style={{ marginLeft: 10 }}
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  )
}
