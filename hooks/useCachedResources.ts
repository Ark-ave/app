import { Feather } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()

        // Load fonts
        await Font.loadAsync({
          ...Feather.font,
          NotoSerifSC: require('../assets/fonts/NotoSerifSC-Regular.otf'),
          'NotoSerifSC-Bold': require('../assets/fonts/NotoSerifSC-Bold.otf'),
          NotoSansSC: require('../assets/fonts/NotoSansSC-Regular.otf'),
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
