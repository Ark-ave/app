import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { View, Text } from '../components/Themed'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import Markdown from '../components/Markdown'
import { openUrl } from '../utils/url/open'
import t from '../utils/locale'

export default function AboutArkScreen() {
  const colorScheme = useColorScheme()
  const window = useWindowDimensions()

  const style = {
    text: {
      fontFamily: 'NotoSansSC',
      fontSize: 16,
      color: Colors[colorScheme].text,
    },
  }
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
      contentContainerStyle={{ alignItems: 'center' }}
      horizontal={false}
      alwaysBounceVertical
    >
      <View
        style={{
          flexDirection: 'column',
          width: window.width,
          backgroundColor: Colors[colorScheme].contentBackground,
          paddingHorizontal: 20,
          paddingBottom: 50,
        }}
      >
        <Markdown
          content={`
          ## [方舟](https://ark.chezhe.dev)
          `}
          style={style}
        />

        <Markdown
          content={`
          \n ### 「方舟」可以做什么？
          \n 1.分类**保存**和**编辑**收藏的豆瓣广播、日记、小组帖子、书影音评论、微博或公众号文章；
          \n 2.为收藏条目**添加备注**；
          \n 3.支持 Chrome 插件和 APP 端添加书签
          \n 4.通过**公钥**关注他人；
          \n 5.在 Web 端对收藏的文章进行编辑；
          `}
          style={style}
        />

        <Markdown
          content={`
          \n ### 数据存储在哪里？
          \n 数据被存储在 IPFS 上。
          `}
          style={style}
        />

        <Markdown
          content={`
          \n ### 路线图
          \n 1.支持：数据导出；
          \n ...
          `}
          style={style}
        />

        <Text
          style={{ color: '#008cd5', textAlign: 'center', marginTop: 20 }}
          onPress={() => openUrl('https://ark.chezhe.dev/about')}
        >
          {t('learn more')}
        </Text>
      </View>
    </ScrollView>
  )
}
