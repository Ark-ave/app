import dayjs from 'dayjs'
import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { ArkFolder, ArkFolderMutate } from '../../types'
import { Heading, Text } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import t from '../../utils/locale'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Singleton from '../../utils/textile/instance'

export default function Folder({
  folder,
  mutate,
}: {
  folder: ArkFolder
  mutate?: ArkFolderMutate
}) {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  return (
    <Pressable
      onPress={() => {
        const instance = Singleton.getInstance()
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FolderDetail',
            params: {
              folder,
              pubkey: instance.getPubkey(),
              mutate,
            },
          })
        )
      }}
    >
      <View
        style={[
          styles.collectionWrap,
          { backgroundColor: Colors[colorScheme].contentBackground },
        ]}
      >
        <Heading>{folder.title}</Heading>
        <Text style={styles.desc}>{folder.description}</Text>
        <Text style={styles.pubTime}>
          {`${t('created at')} ${dayjs(folder.createdAt).format('YYYY/MM/DD')}`}
        </Text>
        <Pressable
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'CreateFolder',
                params: {
                  folder,
                  mutate,
                },
              })
            )
          }}
          style={styles.edit}
        >
          <Feather name="edit-3" size={18} color={Colors[colorScheme].tint} />
        </Pressable>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  collectionWrap: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  edit: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'NotoSansSC',
  },
  desc: {
    color: '#999',
    fontSize: 16,
    marginVertical: 4,
    fontFamily: 'NotoSansSC',
  },
  pubTime: {
    color: '#999',
    fontSize: 12,
    // marginTop: 10,
    fontFamily: 'NotoSansSC',
  },
  metabar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: 'transparent',
  },
  fromLink: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
})
