import React, { useState, useEffect } from 'react'
import {
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { Text, View } from '../Themed'
import t from '../../utils/locale'
import Button from '../Button'
import LoadingModal from '../Modals/LoadingModal'
import { ArkBookmark, ArkFolder } from '../../types'
import { cleanString } from '../../utils/parser'
import { useAppSelector } from '../../hooks/useStore'
import {
  _createBookmark,
  selectIdentity,
  _updateBookmarks,
} from '../../store/account'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import Toast from 'react-native-toast-message'
import Singleton from '../../utils/textile/instance'

export default function BottomActions({
  feed,
  editable,
  defaultFolder,
  mutate,
}: {
  feed: ArkBookmark | null
  editable?: boolean
  defaultFolder?: ArkFolder
  mutate?: (action: string, bm: ArkBookmark) => void
}) {
  if (!feed) {
    return null
  }
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<ArkFolder | undefined>(
    defaultFolder
  )
  const [comment, setComment] = useState(feed.comment ?? '')

  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  useEffect(() => {
    if (!selectedFolder && defaultFolder) {
      setSelectedFolder(defaultFolder)
    }
  }, [defaultFolder])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.bottomWrap,
          {
            backgroundColor: Colors[colorScheme].modalBodyBackground,
            borderTopColor: Colors[colorScheme].tint,
            borderTopWidth: editable ? 0 : 1,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'SelectFolder',
                params: {
                  selectedFolder,
                  setSelectedFolder,
                },
              })
            )
          }}
        >
          <Text style={{ fontSize: 18, textDecorationLine: 'underline' }}>
            {!!selectedFolder
              ? (selectedFolder as any).title
              : t('select folder')}
          </Text>
        </Pressable>
        <TextInput
          multiline
          numberOfLines={4}
          style={[styles.commentWrap, { color: Colors[colorScheme].text }]}
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <View style={styles.buttonGroup}>
          <Button
            label={t('confirm')}
            full
            style={{ width: '100%' }}
            primary
            disabled={!feed}
            onPress={async () => {
              if (!feed) {
                return
              }

              const collectionId = selectedFolder
                ? (selectedFolder as any)._id
                : ''
              try {
                setModalVisible(true)
                const instance = Singleton.getInstance()
                if (editable) {
                  const _bookmark = {
                    ...(feed as any),
                    comment: cleanString(comment),
                    collectionId,
                  }
                  await instance.updateBookmark(_bookmark)
                  mutate && mutate('update', _bookmark)
                } else {
                  const _bookmark = {
                    ...(feed as any),
                    refer:
                      typeof feed.refer === 'object'
                        ? JSON.stringify(feed.refer)
                        : feed.refer,
                    comment: cleanString(comment),
                    createdAt: Date.now(),
                    collectionId,
                  }
                  const newBookmark = await instance.createBookmark(_bookmark)
                  mutate && mutate('create', newBookmark)
                }
                setModalVisible(false)
                navigation.goBack()
              } catch (error) {
                setModalVisible(false)
                Toast.show({
                  type: 'error',
                  text1: (error as any).message,
                })
              }
            }}
          />
        </View>
        <LoadingModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    paddingTop: 10,
    backgroundColor: 'transparent',
    width: '100%',
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
  },
  bottomWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 2,
  },
  commentWrap: {
    width: '100%',
    height: 70,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 0,
    borderColor: '#999',
    borderWidth: 2,
  },
})
