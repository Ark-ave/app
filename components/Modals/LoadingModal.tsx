import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import LottieAnim from '../LottieAnim'

export default function LoadingModal({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}) {
  const colorScheme = useColorScheme()
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <View
        style={[
          styles.centeredView,
          { backgroundColor: Colors[colorScheme].modalBackground },
        ]}
      >
        <LottieAnim
          style={{
            width: 200,
            height: 200,
          }}
          source={require('../../assets/lottie/loading.json')}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
