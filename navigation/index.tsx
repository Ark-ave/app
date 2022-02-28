import * as React from 'react'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { ColorSchemeName } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BookmarkDetail from '../screens/BookmarkDetail'
import AddBookmarkScreen from '../screens/AddBookmarkScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import FolderDetail from '../screens/FolderDetail'
import { RootStackParamList } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import CreateFolder from '../screens/CreateFolder'
import CreateFollow from '../screens/CreateFollow'
import t from '../utils/locale'
import { newIdentity, selectIdentity, _updateLoading } from '../store/account'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import SettingScreen from '../screens/SettingScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AboutArkScreen from '../screens/AboutArkScreen'
import DonateScreen from '../screens/DonateScreen'
import { BottomTabNavigator } from './Common'
import Toast from 'react-native-toast-message'
import SelectFolder from '../screens/SelectFolder'
import FollowDetail from '../screens/FollowDetail'

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  const dispatch = useAppDispatch()
  const identity = useAppSelector(selectIdentity)
  React.useEffect(() => {
    async function loadCacheData() {
      let id = identity
      try {
        if (!id) {
          dispatch(_updateLoading(true))
          id = (await AsyncStorage.getItem('identity')) || ''
          try {
            dispatch(newIdentity(id))
            dispatch(_updateLoading(false))
          } catch (error) {
            dispatch(_updateLoading(false))
          }
        }
      } catch (error) {
        dispatch(_updateLoading(false))
      }
    }
    !identity && loadCacheData()
  }, [identity])
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

// const ModalStack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!', headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="BookmarkDetail"
        component={BookmarkDetail}
        options={{ title: t('bookmark detail'), headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="FolderDetail"
        component={FolderDetail}
        options={{
          title: t('folder detail'),
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FollowDetail"
        component={FollowDetail}
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ title: t('settings'), headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="AddBookmarkScreen"
        component={AddBookmarkScreen}
        options={{ title: t('new bookmark'), headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="AboutArkScreen"
        component={AboutArkScreen}
        options={{ title: t('about ark'), headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name="DonateScreen"
        component={DonateScreen}
        options={{
          title: t('buy me a cup of coffee'),
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="CreateFolder"
          component={CreateFolder}
          options={{ title: t('new folder') }}
        />
        <Stack.Screen
          name="CreateFollow"
          component={CreateFollow}
          options={{ title: t('new follow') }}
        />
        <Stack.Screen
          name="SelectFolder"
          component={SelectFolder}
          options={{ title: t('new folder') }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}
