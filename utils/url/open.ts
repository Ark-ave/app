import * as WebBrowser from 'expo-web-browser'

export const openUrl = (url: string) => {
  WebBrowser.openBrowserAsync(url).catch((error) =>
    console.warn('An error occurred: ', error)
  )
}
