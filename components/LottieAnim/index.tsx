import React from 'react'
import LottieView from 'lottie-react-native'
import AnimatedLottieView from 'lottie-react-native'

interface Props {
  source: string
  style: any
}

class LottieAnim extends React.Component<Props, any> {
  animation: AnimatedLottieView | null = null

  componentDidMount() {
    this.animation && this.animation.play()
  }

  render() {
    return (
      <LottieView
        ref={(animation) => {
          this.animation = animation
        }}
        style={this.props.style}
        source={this.props.source}
      />
    )
  }
}

export default LottieAnim
