import * as React from 'react'
import { View } from '../Themed'
import LottieAnim from './index'

export default function Loading() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <LottieAnim
        style={{
          width: 300,
          height: 300,
        }}
        source={require('../../assets/lottie/loading.json')}
      />
    </View>
  )
}
