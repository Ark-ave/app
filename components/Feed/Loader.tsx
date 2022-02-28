import React from 'react'
import LottieAnim from '../LottieAnim'

class Loader extends React.Component {
  render() {
    return (
      <LottieAnim
        style={{
          width: 300,
          height: 300,
        }}
        source={require('../../assets/lottie/loading-url-content.json')}
      />
    )
  }
}

export default Loader
