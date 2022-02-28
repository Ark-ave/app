import { t } from 'i18n-js'
import React from 'react'
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import { View, Text } from '../Themed'

interface Option {
  title: string
  onPress: () => void
}

export default function ActionSheetModal({
  modalVisible,
  setModalVisible,
  options,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  options: Option[]
}) {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <View style={styles.centeredView}>
        <View
          style={{
            backgroundColor: Colors[colorScheme].contentBackground,
            width: window.width,
            paddingBottom: 24,
          }}
        >
          {options.map((option, idx) => {
            return (
              <Pressable
                style={styles.optionWrap}
                key={idx}
                onPress={async () => {
                  await option.onPress()
                }}
              >
                <Text style={styles.optionTitle}>{option.title}</Text>
              </Pressable>
            )
          })}
          <Pressable
            style={[styles.optionWrap, { borderBottomWidth: 0 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.optionTitle, { color: 'red' }]}>
              {t('cancel')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  optionTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NotoSansSC',
    color: '#008cd5',
  },
  optionWrap: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: '#999',
  },
})
