import * as WebBrowser from 'expo-web-browser'
import { createElement } from 'react'
import { Text, View } from 'react-native'
import _ from 'lodash'
import ZoomImage from './ZoomImage'
import { ArkBookmark } from '../../types'
import { getBookmarkHost } from '../../utils/bookmark'

const openUrl = (url: string, feed: ArkBookmark | undefined) => {
  let _url = url
  if (!url.startsWith('https://') && feed) {
    _url = `${getBookmarkHost(feed.type)}${url}`
  }
  WebBrowser.openBrowserAsync(_url).catch((error) =>
    console.warn('An error occurred: ', error)
  )
}

export default (styles: any, feed: ArkBookmark | undefined) => {
  return {
    autolink: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.link,
            onPress: _.noop,
          },
          output(node.content, state)
        )
      },
    },
    blockQuote: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        const blockBar = createElement(View, {
          key: `blockBar-${state.key}`,
          style: [styles.blockQuoteSectionBar, styles.blockQuoteBar],
        })
        const blockText = createElement(
          Text,
          {
            key: `blockQuoteText-${state.key}`,
            style: styles.blockQuoteText,
          },
          output(node.content, state)
        )
        return createElement(
          View,
          {
            key: `blockQuote-${state.key}`,
            style: [styles.blockQuoteSection, styles.blockQuote],
          },
          [blockBar, blockText]
        )
      },
    },
    br: {
      react: (node: any, output: any, state: any) => {
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.br,
          },
          '\n\n'
        )
      },
    },
    codeBlock: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.codeBlock,
          },
          null
        )
      },
    },
    del: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.del,
          },
          output(node.content, state)
        )
      },
    },
    em: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.em,
          },
          output(node.content, state)
        )
      },
    },
    heading: {
      react: (node: any, output: any, parentState: any) => {
        const state = { ...parentState }
        state.withinText = true
        const stylesToApply = [styles.heading, styles['heading' + node.level]]
        state.stylesToApply = stylesToApply
        return createElement(
          Text,
          {
            key: state.key,
            style: stylesToApply,
          },
          output(node.content, state)
        )
      },
    },
    hr: {
      react: (node: any, output: any, state: any) => {
        return createElement(View, { key: state.key, style: styles.hr })
      },
    },
    image: {
      react: (node: any, output: any, state: any) => {
        // return <ZoomImage
        return createElement(ZoomImage, {
          key: node.target,
          source: { uri: node.target },
          style: node.target.match(/youtu|vimeo/) ? styles.video : styles.image,
        })
      },
    },
    inlineCode: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.inlineCode,
          },
          node.content
        )
      },
    },
    link: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            style: node.target.match(/@/) ? styles.mailTo : styles.link,
            key: state.key,
            onPress: () => openUrl(node.target, feed),
          },
          output(node.content, state)
        )
      },
    },
    list: {
      react: (node: any, output: any, state: any) => {
        const items = _.map(node.items, (item, i) => {
          let bullet
          if (node.ordered) {
            bullet = createElement(
              Text,
              { key: state.key, style: styles.listItemNumber },
              i + 1 + '. '
            )
          } else {
            bullet = createElement(
              Text,
              { key: state.key, style: styles.listItemBullet },
              styles.listItemBulletType
                ? `${styles.listItemBulletType} `
                : '\u2022 '
            )
          }
          const listItemText = createElement(
            Text,
            { key: state.key + 1, style: styles.listItemText },
            output(item, state)
          )
          return createElement(
            View,
            {
              key: i,
              style: styles.listItem,
            },
            [bullet, listItemText]
          )
        })
        return createElement(
          View,
          { key: state.key, style: styles.list },
          items
        )
      },
    },
    newline: {
      react: (node: any, output: any, state: any) => {
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.newline,
          },
          '\n'
        )
      },
    },
    paragraph: {
      react: (node: any, output: any, state: any) => {
        return createElement(
          View,
          {
            key: `paragraph-${Math.random()}`,
            style: styles.paragraph,
          },
          output(node.content, state)
        )
      },
    },
    strong: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.strong,
          },
          output(node.content, state)
        )
      },
    },
    table: {
      react: (node: any, output: any, state: any) => {
        const headers = _.map(node.header, (content, i) => {
          return createElement(
            Text,
            {
              style: styles.tableHeaderCell,
              key: i,
            },
            output(content, state)
          )
        })

        const header = createElement(
          View,
          { style: styles.tableHeader },
          headers
        )

        const rows = _.map(node.cells, (row, r) => {
          const cells = _.map(row, (content, c) => {
            return createElement(
              View,
              {
                key: c,
                style: styles.tableRowCell,
              },
              output(content, state)
            )
          })
          const rowStyles = [styles.tableRow]
          node.cells.length - 1 === r
            ? rowStyles.push(styles.tableRowLast)
            : null
          return createElement(View, { key: r, style: rowStyles }, cells)
        })

        return createElement(View, { key: state.key, style: styles.table }, [
          header,
          rows,
        ])
      },
    },
    text: {
      react: (node: any, output: any, parentState: any) => {
        if (!node.content.trim()) {
          return null
        }
        const state = { ...parentState }
        // Breaking words up in order to allow for text reflowing in flexbox
        // let words = node.content.split(' ')
        const textStyles = [styles.text]
        !state.withinText
          ? textStyles.push(styles.plainText)
          : textStyles.push(state.withinTextStyle)
        state.stylesToApply ? textStyles.push(state.stylesToApply) : null

        return createElement(
          Text,
          {
            key: node.content,
            style: textStyles,
          },
          node.content
        )
      },
    },
    u: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        state.withinTextStyle = styles.link
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.u,
          },
          output(node.content, state)
        )
      },
    },
    url: {
      react: (node: any, output: any, state: any) => {
        state.withinText = true
        state.withinTextStyle = styles.link
        return createElement(
          Text,
          {
            key: state.key,
            style: styles.link,
            onPress: () => openUrl(node.target, feed),
          },
          output(node.content, state)
        )
      },
    },
  }
}
