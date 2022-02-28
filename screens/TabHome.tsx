import { useMyBookmarks, useMyFolders } from '../hooks/useTextile'
import * as React from 'react'
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'

import { Text, View } from '../components/Themed'
import { ArkBookmark, RootTabScreenProps, ArkFolder } from '../types'
import t from '../utils/locale'
import { Feather } from '@expo/vector-icons'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import MyBookmarks from '../components/MyBookmarks'
import MyFolders from '../components/MyFolders'
import { useSWRConfig } from 'swr'

export default function TabHome({ navigation }: RootTabScreenProps<'TabHome'>) {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()
  const { mutate: refetch } = useSWRConfig()
  const [page, setPage] = React.useState(1)
  const [index, setIndex] = React.useState(0)
  const [refreshing, setRefreshing] = React.useState(false)
  const [routes] = React.useState([
    { key: 'bookmarks', title: t('bookmarks') },
    { key: 'folders', title: t('folders') },
  ])
  const {
    bookmarks,
    isLoading,
    error,
    mutate: mutateBookmarks,
  } = useMyBookmarks(page)
  const {
    folders,
    isLoading: isLoadingFolder,
    error: folderError,
    mutate: mutateFolders,
  } = useMyFolders()

  const _mutateBookmarks = (action: string, bm: ArkBookmark) => {
    switch (action) {
      case 'create':
        mutateBookmarks([bm, ...(bookmarks || [])])
        break
      case 'update':
        mutateBookmarks(bookmarks?.map((t: any) => (t._id === bm._id ? bm : t)))
        break
      case 'delete':
        mutateBookmarks(bookmarks?.filter((t: any) => t._id !== bm._id))
      default:
        break
    }
  }

  const _mutateFolders = (action: string, folder: ArkFolder) => {
    switch (action) {
      case 'update':
        mutateFolders(
          folders.map((t: ArkFolder) => {
            if (t._id === folder._id) {
              return folder
            }
            return t
          })
        )
        break
      case 'create':
        mutateFolders([folder, ...folders])
        break
      case 'delete':
        mutateFolders(folders.filter((t: ArkFolder) => t._id !== folder._id))
        break
      default:
        break
    }
  }

  const renderScene = SceneMap({
    bookmarks: () => {
      return (
        <MyBookmarks
          isLoading={isLoading}
          bookmarks={bookmarks as ArkBookmark[]}
          folders={folders}
          error={error}
          page={page}
          setPage={setPage}
          mutate={_mutateBookmarks}
          refreshing={refreshing}
          refetch={async () => {
            try {
              setPage(1)
              setRefreshing(true)
              await refetch(`/api/my-bookmarks?page=1`)
              setRefreshing(false)
            } catch (error) {
              setRefreshing(false)
            }
          }}
        />
      )
    },
    folders: () => {
      return (
        <MyFolders
          isLoading={isLoadingFolder}
          folders={folders as ArkFolder[]}
          mutate={_mutateFolders}
          error={folderError}
        />
      )
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => {
          const {
            navigationState: { routes },
          } = props
          return (
            <View style={styles.header}>
              <View style={styles.tabRouteWrap}>
                {routes.map((route, idx) => {
                  const isActive = idx === index
                  return (
                    <Text
                      key={route.key}
                      style={{
                        fontSize: isActive ? 30 : 28,
                        fontFamily: 'NotoSerifSC-Bold',
                        marginRight: 20,
                        opacity: isActive ? 1 : 0.7,
                      }}
                      onPress={() => setIndex(idx)}
                    >
                      {route.title}
                    </Text>
                  )
                })}
              </View>
              <Pressable
                onPress={() => {
                  navigation.navigate(
                    index === 0 ? 'AddBookmarkScreen' : 'CreateFolder',
                    {
                      mutate: index === 0 ? _mutateBookmarks : _mutateFolders,
                    }
                  )
                }}
              >
                <Feather
                  name={index === 0 ? 'plus-circle' : 'folder-plus'}
                  size={24}
                  color={Colors[colorScheme].tint}
                />
              </Pressable>
            </View>
          )
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: window.width }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    width: '100%',
  },
  tabRouteWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
})
