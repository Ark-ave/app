/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  AddBookmarkScreen: { mutate: any }
  NotFound: undefined
  BookmarkDetail: undefined
  CreateFolder: { mutate: any }
  CreateFollow: { mutate: any }
  FolderDetail: undefined
  FollowDetail: undefined
  SettingScreen: undefined
  AboutArkScreen: undefined
  DonateScreen: undefined
  ZoomImageScreen: undefined
  SelectFolder: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>

export type RootTabParamList = {
  TabHome: undefined
  TabFollow: undefined
  TabProfile: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export enum BookmarkType {
  DOUBAN_STATUS = 'douban.status',
  DOUBAN_TOPIC = 'douban.topic',
  DOUBAN_NOTE = 'douban.note',
  DOUBAN_REVIEW = 'douban.review',
  DOUBAN_RATE = 'douban.rate',
  WEIBO = 'weibo',
  WECHAT_ARTICLE = 'wechat.article',
  TWITTER = 'twitter',
  OTHER = 'other',
}

export type ArkBookmark = {
  origin: string
  comment: string
  type: BookmarkType
  createdAt: number
  collectionId?: string
  title: string
  refer: any
  pubtime: string
  user: string
  content?: string
  _id?: string
}

export type ArkFolder = {
  title: string
  description: string
  createdAt: number
  tags: string[]
  _id?: string
}

export type ArkFollow = {
  _id?: string
  alias: string
  pubkey: string
  createdAt: number
}

export type ArkFolderMutate = (action: string, folder: ArkFolder) => void

export type ArkFollowMutate = (action: string, folder: ArkFollow) => void
