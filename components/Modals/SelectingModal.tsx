import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Modal, StyleSheet, Pressable } from 'react-native'
import { useAppSelector } from '../../hooks/useStore'
import { selectFolders } from '../../store/account'
import { ArkFolder } from '../../types'
import { View, Text } from '../Themed'
import t from '../../utils/locale'

export default function SelectingModal({
  modalVisible,
  setModalVisible,
  selectedCollection,
  setSelectedCollection,
}: {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  selectedCollection: ArkFolder | undefined
  setSelectedCollection: (ct: any) => void
}) {
  const folders = useAppSelector(selectFolders)
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        setModalVisible(false)
      }}
      onDismiss={() => {
        setModalVisible(false)
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.collectionsWrap}>
          {folders.map((ct, idx) => {
            const isSelected =
              selectedCollection &&
              ct.title === (selectedCollection as any).title
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  if (isSelected) {
                    setSelectedCollection(null)
                  } else {
                    setSelectedCollection(ct)
                  }
                  setModalVisible(false)
                }}
              >
                <View style={styles.ctTitleWrap}>
                  <Text style={styles.ctTitle}>{ct.title}</Text>
                  {isSelected && (
                    <Feather name="check" size={18} color="#666" />
                  )}
                </View>
              </Pressable>
            )
          })}
          <Pressable
            onPress={() => {
              setModalVisible(false)
            }}
          >
            <View
              style={[
                styles.ctTitleWrap,
                { borderBottomWidth: 0, justifyContent: 'center' },
              ]}
            >
              <Text style={[styles.ctTitle, { color: '#666' }]}>
                {t('cancel')}
              </Text>
            </View>
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
  collectionsWrap: {
    width: '100%',
    paddingBottom: 30,
  },
  ctTitleWrap: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: '#999',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NotoSansSC',
  },
})
