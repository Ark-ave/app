import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { ArkFollowMutate, ArkFollow } from '../../types'
import { Heading, Text } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

export default function Follow({
  follow,
  mutate,
}: {
  follow: ArkFollow
  mutate?: ArkFollowMutate
}) {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  return (
    <Pressable
      onPress={() => {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FollowDetail',
            params: {
              follow,
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
        <Heading>{follow.alias}</Heading>
        <Text style={styles.desc}>{follow.pubkey}</Text>
        <Pressable
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'CreateFollow',
                params: {
                  follow,
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
