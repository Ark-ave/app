import _ from 'lodash'
import parse from 'url-parse'

export const cleanString = (str: string) => {
  return _.trim(_.trim(str), '\n')
}

export const ellipsis = (
  str: string,
  leftLen: number,
  rightLen: number
): string => {
  const len = str.length
  const left = str.substr(0, leftLen)
  const right = str.substr(len - rightLen, len)
  return `${left}...${right}`
}

export const getHost = (uri: string): string => {
  const result = parse(uri, true)
  return result.host
}
