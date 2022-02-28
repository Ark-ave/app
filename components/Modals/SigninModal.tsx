import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import Button from '../Button'
import { View } from '../Themed'
import t from '../../utils/locale'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Singleton from '../../utils/textile/instance'
import { useNavigation } from '@react-navigation/core'
import { useAppDispatch } from '../../hooks/useStore'
import { newIdentity } from '../../store/account'

export default function SigninModal({
  modalVisible,
  setModalVisible,
  setLoadingModalVisible,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  setLoadingModalVisible: (visible: boolean) => void
}) {
  const [identity, setIdentity] = useState('')
  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <View style={styles.centeredView}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'position' : 'height'}
        >
          <View
            style={[
              styles.collectionsWrap,
              { backgroundColor: Colors[colorScheme].modalBodyBackground },
            ]}
          >
            <View
              style={{
                marginVertical: 20,
                flexDirection: 'column',
                alignItems: 'center',
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: 'transparent',
              }}
            >
              <TextInput
                value={identity}
                onChangeText={(text) => {
                  setIdentity(text)
                }}
                multiline
                numberOfLines={3}
                style={[
                  styles.idInput,
                  {
                    backgroundColor: Colors[colorScheme].contentBackground,
                    color: Colors[colorScheme].tint,
                  },
                ]}
                placeholder={t('input your key')}
              />
            </View>
            <View style={styles.buttonGroup}>
              <Button
                label={t('cancel')}
                onPress={() => setModalVisible(false)}
              />
              <Button
                label={t('confirm')}
                primary
                onPress={async () => {
                  if (!identity) {
                    return
                  }
                  try {
                    setModalVisible(false)
                    setLoadingModalVisible(true)
                    await AsyncStorage.setItem(
                      'identity',
                      identity,
                      async () => {
                        const instance = Singleton.getInstance()
                        await instance.initFromCache()
                        dispatch(newIdentity(identity))
                        setLoadingModalVisible(false)
                        navigation.goBack()
                      }
                    )
                  } catch (error) {
                    Toast.show({
                      type: 'error',
                      text1: (error as any).message,
                    })
                    setModalVisible(true)
                    setLoadingModalVisible(false)
                  }
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
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
  collectionsWrap: {
    width: '100%',
    paddingBottom: 30,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  idInput: {
    width: 350,
    height: 70,
    padding: 10,
    borderColor: '#999',
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'transparent',
  },
})
