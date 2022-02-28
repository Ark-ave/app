import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import Button from '../Button'
import { View } from '../Themed'
import t from '../../utils/locale'
import SigninModal from '../Modals/SigninModal'
import LoadingModal from '../Modals/LoadingModal'

export default function NoIdentity() {
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        label={t('signup')}
        onPress={() => {
          WebBrowser.openBrowserAsync('https://ark.chezhe.dev/signup').catch(
            (error) => console.warn('An error occurred: ', error)
          )
        }}
      />
      <Button
        label={t('signin')}
        style={{ marginTop: 10 }}
        primary
        onPress={() => {
          setSignModalVisible(true)
        }}
      />

      <SigninModal
        modalVisible={signModalVisible}
        setModalVisible={setSignModalVisible}
        setLoadingModalVisible={setLoadingModalVisible}
      />
      <LoadingModal
        modalVisible={loadingModalVisible}
        setModalVisible={setLoadingModalVisible}
      />
    </View>
  )
}
