import t from '../../utils/locale'
import React, { useState } from 'react'
import { ScrollView, useWindowDimensions, Image, Linking } from 'react-native'
import { useAppSelector } from '../../hooks/useStore'
import { selectIdentity, selectLoading } from '../../store/account'
import { View } from '../Themed'
import useColorScheme from '../../hooks/useColorScheme'
import Colors from '../../constants/Colors'
import NoIdentity from './NoIdentity'
import SettingItem from './SettingItem'
import LOGO_DARK from '../../assets/images/logo-in-dark.png'
import LOGO_LIGHT from '../../assets/images/logo-in-light.png'
import IdentityModal from '../Modals/IdentityModal'
import styles from './styles'
import { useNavigation } from '@react-navigation/core'
import { Feather } from '@expo/vector-icons'
import { PrivateKey } from '@textile/crypto'
import Avatar from './Avatar'
import Loading from '../LottieAnim/Default'

export default function Profile({}) {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()
  const navigation = useNavigation()
  const [identityModalVisible, setIdentityModalVisible] = useState(false)
  const [pubKey, setPubKey] = useState('')

  const identity = useAppSelector(selectIdentity)
  const loading = useAppSelector(selectLoading)

  React.useEffect(() => {
    try {
      const id = PrivateKey.fromString(identity)
      setPubKey(id.public.toString())
    } catch (error) {}
  }, [identity])

  if (loading) {
    return <Loading />
  }
  if (!identity) {
    return <NoIdentity />
  }
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
        height: '100%',
      }}
      contentContainerStyle={{ alignItems: 'center' }}
      horizontal={false}
      alwaysBounceVertical
    >
      <Avatar size={50} value={pubKey} />
      <View
        style={{
          flexDirection: 'column',
          width: window.width,
          backgroundColor: Colors[colorScheme].contentBackground,
        }}
      >
        <SettingItem
          icon="key"
          label={t('key')}
          onPress={() => {
            setIdentityModalVisible(true)
          }}
        />
        {/* <SettingItem icon="heart" label={t('follow')} onPress={() => {}} /> */}
        <SettingItem
          icon="monitor"
          label={t('display mode')}
          extra={
            <Feather
              name={colorScheme === 'light' ? 'sun' : 'moon'}
              size={18}
              color="#999"
            />
          }
          hideChevron
          onPress={() => {}}
        />
        <SettingItem
          icon="settings"
          label={t('settings')}
          onPress={() => {
            navigation.navigate('SettingScreen')
          }}
          hideBorderBottom
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 10,
          width: window.width,
          backgroundColor: Colors[colorScheme].contentBackground,
        }}
      >
        <SettingItem
          icon="mail"
          label={t('help and feedback')}
          onPress={() => {
            Linking.openURL('mailto:chezhe@hey.com').catch(console.log)
          }}
        />
        {/* <SettingItem
          icon="coffee"
          label={t('buy me a cup of coffee')}
          onPress={() => navigation.navigate('DonateScreen')}
        /> */}

        <SettingItem
          icon="info"
          label={t('about')}
          onPress={() => navigation.navigate('AboutArkScreen')}
          hideBorderBottom
        />
      </View>

      <Image
        source={colorScheme === 'light' ? LOGO_LIGHT : LOGO_DARK}
        style={styles.logo}
      />

      <IdentityModal
        modalVisible={identityModalVisible}
        setModalVisible={setIdentityModalVisible}
        identity={identity}
        onConfirm={() => setIdentityModalVisible(false)}
        pubKey={pubKey}
      />
    </ScrollView>
  )
}
