import * as React from 'react'
import { Feather } from '@expo/vector-icons'
import { Text } from '../components/Themed'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RootTabParamList, RootTabScreenProps } from '../types'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { _updateLoading } from '../store/account'
import TabFollow from '../screens/TabFollow'
import TabHome from '../screens/TabHome'
import TabProfile from '../screens/TabProfile'

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="TabHome"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabHome"
        component={TabHome}
        options={({ navigation }: RootTabScreenProps<'TabHome'>) => ({
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="hash" color={color} />,
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="TabFollow"
        component={TabFollow}
        options={({ navigation }: RootTabScreenProps<'TabFollow'>) => ({
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="TabProfile"
        component={TabProfile}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  )
}

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name']
  color: string
}) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />
}

export function TabScreenTitle({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 24,
        fontWeight: '700',
        paddingLeft: 20,
        lineHeight: 32,
        fontFamily: 'NotoSerifSC-Bold',
      }}
    >
      {label}
    </Text>
  )
}
