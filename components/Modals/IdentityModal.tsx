import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Modal, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import Button from '../Button'
import { View, Text, Heading } from '../Themed'
import * as Clipboard from 'expo-clipboard'
import t from '../../utils/locale'

export default function IdentityModal({
  modalVisible,
  setModalVisible,
  identity,
  onConfirm,
  pubKey,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  identity: string
  onConfirm: () => void
  pubKey: string
}) {
  if (!identity) {
    return null
  }
  const colorScheme = useColorScheme()
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="formSheet"
    >
      <View style={styles.centeredView}>
        <View style={styles.collectionsWrap}>
          <Feather name="alert-triangle" size={40} color="red" />
          <Heading>{t('private key')}</Heading>
          <View
            style={[
              styles.keyWrap,
              {
                backgroundColor: Colors[colorScheme].contentBackground,
              },
            ]}
          >
            <Text>{identity}</Text>

            <Feather
              name="copy"
              size={32}
              color={Colors[colorScheme].tint}
              style={{ marginLeft: 20 }}
              onPress={() => {
                Clipboard.setString(identity)
                Toast.show({
                  type: 'success',
                  text1: t('copied'),
                  visibilityTime: 3000,
                })
              }}
            />
          </View>
          <Heading>{t('public key')}</Heading>
          <View
            style={[
              styles.keyWrap,
              {
                backgroundColor: Colors[colorScheme].contentBackground,
              },
            ]}
          >
            <Text>{pubKey}</Text>

            <Feather
              name="copy"
              size={32}
              color={Colors[colorScheme].tint}
              style={{ marginLeft: 20 }}
              onPress={() => {
                Clipboard.setString(pubKey)
                Toast.show({
                  type: 'success',
                  text1: t('copied'),
                  visibilityTime: 3000,
                })
              }}
            />
          </View>

          <Text
            style={{
              marginBottom: 10,
              fontFamily: 'NotoSansSC',
            }}
          >
            {t('private key tip')}
          </Text>
          <Text
            style={{
              marginBottom: 20,
              fontFamily: 'NotoSansSC',
            }}
          >
            {t('public key tip')}
          </Text>

          <Button
            label={t('confirm')}
            full
            style={{ width: '100%' }}
            primary
            onPress={async () => {
              setModalVisible(false)
              try {
                await onConfirm()
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: (error as any).message,
                })
              }
            }}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
  },
  collectionsWrap: {
    width: '96%',
    paddingBottom: 30,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  keyWrap: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
  },
})
