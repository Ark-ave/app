import React, { Component } from 'react'
import { View } from 'react-native'
import SimpleMarkdown from 'simple-markdown'
import _ from 'lodash'

import initialRules from './rules'
import initialStyles from './styles'
import { ArkBookmark } from '../../types'

interface Props {
  content: string
  feed?: ArkBookmark
  style?: any
}

type State = {
  styles: any
  children?: string
  rules?: Object
  whitelist?: []
  blacklist?: []
}

class Markdown extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      styles: initialStyles,
      rules: {},
      whitelist: [],
      blacklist: [],
    }
  }

  _renderContent = (content: string) => {
    try {
      const rules = _.merge(
        {},
        SimpleMarkdown.defaultRules,
        initialRules(
          { ...initialStyles, ...(this.props.style || {}) },
          this.props.feed
        )
      )
      const child = Array.isArray(content) ? content.join('') : content
      const blockSource = child + '\n\n'
      const tree = SimpleMarkdown.parserFor(rules)(blockSource, {
        inline: false,
      })
      const reactOutput = SimpleMarkdown.outputFor(rules, 'react')
      return reactOutput(tree)
    } catch (errors) {}
  }

  render() {
    return (
      <View style={[initialStyles.view, this.props.style]}>
        {this._renderContent(this.props.content)}
      </View>
    )
  }
}

export default Markdown

const markdownStyles = {
  heading1: {
    fontSize: 24,
    color: 'purple',
  },
  link: {
    color: 'pink',
  },
  mailTo: {
    color: 'orange',
  },
  text: {
    color: '#555555',
  },
}
