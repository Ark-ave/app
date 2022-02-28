import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { ArkFolder, ArkFolderMutate } from '../../types'
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
  const folder = (params as any)?.folder as ArkFolder
  const mutate = (params as any)?.mutate as ArkFolderMutate
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState(folder?.title ?? '')
  const [description, setDescription] = useState(folder?.description ?? '')
  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  useEffect(() => {
    if (folder) {
      navigation.setOptions({ title: t('edit folder') })
    }
  }, [folder])

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
        value={title}
        placeholder={t('name')}
        autoFocus={!folder}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={[
          styles.input,
          styles.textarea,
          { backgroundColor: Colors[colorScheme].textInputBackground },
        ]}
        multiline
        numberOfLines={3}
        placeholder={t('description')}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button
        label={t('confirm')}
        primary
        full
        style={{ marginTop: 10, width: '100%' }}
        onPress={async () => {
          const _title = title.trim()
          const _desc = description.trim()
          if (!_title) {
            return Toast.show({
              type: 'error',
              text1: t('name cannot is empty'),
            })
          }
          setModalVisible(true)
          try {
            const instance = Singleton.getInstance()
            if (folder) {
              const _folder = {
                ...folder,
                title: _title,
                description: _desc,
                tags: [],
              }
              await instance.updateFolder(_folder)
              mutate && mutate('update', _folder)
            } else {
              const _folder = {
                title: _title,
                description: _desc,
                createdAt: Date.now(),
                tags: [],
              }
              const newFolder = await instance.createFolder(_folder)
              mutate && mutate('create', newFolder)
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

      {!!folder && (
        <Button
          label={t('delete')}
          full
          danger
          style={{ marginTop: 10, width: '100%' }}
          onPress={async () => {
            try {
              setModalVisible(true)
              const instance = Singleton.getInstance()
              await instance.deleteFolder(folder._id!)
              mutate && mutate('delete', folder)
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
