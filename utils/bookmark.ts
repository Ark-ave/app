import { ArkBookmark, BookmarkType } from '../types'
import { getHost } from './parser'

export const isArticle = (type: BookmarkType) => {
  return [
    BookmarkType.DOUBAN_NOTE,
    BookmarkType.DOUBAN_TOPIC,
    BookmarkType.WECHAT_ARTICLE,
    BookmarkType.DOUBAN_REVIEW,
    BookmarkType.OTHER,
  ].includes(type)
}

export const getBookmarkFrom = (feed: ArkBookmark) => {
  switch (feed.type) {
    case BookmarkType.DOUBAN_STATUS:
      return '豆瓣广播'
    case BookmarkType.DOUBAN_NOTE:
      return '豆瓣日记'
    case BookmarkType.DOUBAN_REVIEW:
      return '豆瓣评论'
    case BookmarkType.DOUBAN_RATE:
      return '豆瓣评价'
    case BookmarkType.DOUBAN_TOPIC:
      return '豆瓣小组'
    case BookmarkType.WECHAT_ARTICLE:
      return '微信公众号'
    case BookmarkType.WEIBO:
      return '微博'
    default:
      return getHost(feed.origin)
  }
}

export const getBookmarkHost = (bookmarkType: BookmarkType) => {
  switch (bookmarkType) {
    case BookmarkType.DOUBAN_STATUS:
    case BookmarkType.DOUBAN_NOTE:
    case BookmarkType.DOUBAN_TOPIC:
      return 'https://www.douban.com'
    case BookmarkType.WECHAT_ARTICLE:
      return 'https://mp.weixin.qq.com/s'
    case BookmarkType.WEIBO:
      return 'https://m.weibo.cn'
    default:
      return ''
  }
}
