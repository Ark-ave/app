import React from 'react'
import {
  Image,
  Pressable,
  useWindowDimensions,
  Modal,
  ScrollView,
} from 'react-native'

interface Props {
  source: { uri: string }
  style: object
}

export default function ZoomImage({ source, style }: Props) {
  const [modalVisible, setModalVisible] = React.useState(false)
  return (
    <Pressable
      onPress={() => {
        setModalVisible(true)
      }}
    >
      <Image
        source={source}
        style={[style, { marginBottom: 10, width: 300, height: 300 }]}
        resizeMode="cover"
      />
      {modalVisible && (
        <ZoomImageModal
          uri={source.uri}
          onClose={() => setModalVisible(false)}
        />
      )}
    </Pressable>
  )
}

function ZoomImageModal({
  uri,
  onClose,
}: {
  uri: string
  onClose: () => void
}) {
  const window = useWindowDimensions()
  const [height, setHeight] = React.useState(0)
  React.useEffect(() => {
    if (!height) {
      Image.getSize(uri, (width, height) => {
        setHeight((height * window.width) / width)
      })
    }
  }, [uri, height])
  const style = { width: '100%', height }
  return (
    <Modal
      animationType="fade"
      visible
      transparent
      presentationStyle="overFullScreen"
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          height: height > window.height ? undefined : '100%',
        }}
      >
        <Pressable onPress={onClose} style={style}>
          <Image source={{ uri }} style={style} />
        </Pressable>
      </ScrollView>
    </Modal>
  )
}
