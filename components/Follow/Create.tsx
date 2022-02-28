import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { ArkFollow, ArkFollowMutate } from '../../types'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import Button from '../Button'
import { useNavigation, useRoute } from '@react-navigation/native'
import t from '../../utils/locale'
import LoadingModal from '../Modals/LoadingModal'
import {
  _createCollection,
  _updateCollection,
  _deleteCollection,
} from '../../store/account'
import Toast from 'react-native-toast-message'
import Singleton from '../../utils/textile/instance'

export default function Create() {
  const { params } = useRoute()
  const following = (params as any)?.follow as ArkFollow
  const mutate = (params as any)?.mutate as ArkFollowMutate
  const [modalVisible, setModalVisible] = useState(false)
  const [alias, setAlias] = useState(following?.alias ?? '')
  const [pubkey, setPubkey] = useState(following?.pubkey ?? '')
  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  useEffect(() => {
    if (following) {
      navigation.setOptions({ title: t('edit follow') })
    }
  }, [following])

  return (
    <View
      style={[
        styles.collectionWrap,
        { backgroundColor: Colors[colorScheme].contentBackground },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors[colorScheme].textInputBackground },
        ]}
        value={alias}
        placeholder={t('alias')}
        autoFocus={!following}
        onChangeText={(text) => setAlias(text)}
      />
      <TextInput
        style={[
          styles.input,
          styles.textarea,
          { backgroundColor: Colors[colorScheme].textInputBackground },
        ]}
        multiline
        numberOfLines={3}
        placeholder={t('public key')}
        value={pubkey}
        onChangeText={(text) => setPubkey(text)}
      />
      <Button
        label={t('confirm')}
        primary
        full
        style={{ marginTop: 10, width: '100%' }}
        onPress={async () => {
          const _alias = alias.trim()
          const _pubkey = pubkey.trim()
          if (!_alias || !_pubkey) {
            return Toast.show({
              type: 'error',
              text1: t('name cannot is empty'),
            })
          }
          setModalVisible(true)
          try {
            const instance = Singleton.getInstance()
            if (following) {
              const _follow = {
                ...following,
                alias: _alias,
                pubkey: _pubkey,
              }
              await instance.updateFollow(_follow)
              mutate && mutate('update', _follow)
            } else {
              const _follow = {
                alias: _alias,
                pubkey: _pubkey,
                createdAt: Date.now(),
              }
              const newFollow = await instance.createFollow(_follow)
              mutate && mutate('create', newFollow)
            }
            setModalVisible(false)
            navigation.goBack()
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: (error as any).message,
            })
            setModalVisible(false)
          }
        }}
      />
      <Button
        label={t('cancel')}
        full
        style={{ marginTop: 10, width: '100%' }}
        onPress={() => {
          navigation.goBack()
        }}
      />

      {!!following && (
        <Button
          label={t('delete')}
          full
          danger
          style={{ marginTop: 10, width: '100%' }}
          onPress={async () => {
            try {
              setModalVisible(true)
              const instance = Singleton.getInstance()
              await instance.deleteFollow([following._id!])
              mutate && mutate('delete', following)
              navigation.goBack()
              setModalVisible(false)
            } catch (error) {
              setModalVisible(false)
              Toast.show({
                type: 'error',
                text1: (error as any).message,
              })
            }
          }}
        />
      )}

      <LoadingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
    marginVertical: 20,
  },
  collectionWrap: {
    padding: 20,
    borderRadius: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 2,
    color: '#333',
    marginTop: 20,
    marginBottom: 0,
    borderColor: '#333',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  textarea: {
    height: 150,
  },
})
