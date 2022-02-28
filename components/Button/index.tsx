import React, { useState, useRef } from 'react'
import { Pressable, View, StyleSheet } from 'react-native'
import { Text } from '../Themed'

interface Props {
  onPress: () => void
  primary?: boolean
  label: string
  disabled?: boolean
  full?: boolean
  style?: object
  danger?: boolean
}

export default function Button({
  primary,
  label,
  onPress,
  disabled,
  full,
  style,
  danger,
}: Props) {
  return (
    <Pressable style={style} onPress={onPress}>
      <View
        style={[
          styles.button,
          primary && styles.primaryButton,
          disabled && styles.disabled,
          full && styles.full,
          danger && styles.danger,
        ]}
      >
        <Text
          style={[
            styles.text,
            primary && styles.primaryText,
            danger && styles.dangerText,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 160,
    paddingVertical: 10,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  primaryButton: {
    backgroundColor: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  disabled: {
    opacity: 0.4,
  },
  full: {
    width: '100%',
  },
  dangerText: {
    color: 'red',
  },
  danger: {
    backgroundColor: '#eee',
  },
})
