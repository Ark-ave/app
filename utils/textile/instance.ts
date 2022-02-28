import {
  PrivateKey,
  Identity,
  Client,
  ThreadID,
  QueryJSON,
  Where,
  UserAuth,
} from '@textile/hub'
import axios from 'axios'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { PAGE_SIZE } from '../constants'
import { ArkBookmarkSchema, ArkFolderSchema, ArkFollowSchema } from './schemas'
import { ArkBookmark, ArkFolder, ArkFollow } from '../../types'

const ARK_COLLECTION = 'ARKCOLLECTION'
const ARK_BOOKMARK = 'ARKBOOKMARK'
const ARK_FOLLOW = 'ARKFOLLOW'

class Singleton {
  private static instance: Singleton
  private client: Client
  private credentials: UserAuth
  private identity: Identity
  private threadNameIdDic: any = {}

  private constructor() {}

  public async initFromCache() {
    if (this.identity) {
      return
    }
    const localCredentials = await AsyncStorage.getItem('credentials')
    if (localCredentials) {
      try {
        const credentials = JSON.parse(localCredentials)
        if (new Date(credentials.msg).getTime() > Date.now()) {
          this.credentials = credentials
        }
      } catch (error) {}
    }

    const localThreadNameIdDic = await AsyncStorage.getItem('threadNameIdDic')
    if (localThreadNameIdDic) {
      try {
        this.threadNameIdDic = JSON.parse(localThreadNameIdDic)
      } catch (error) {}
    }

    const identity = await AsyncStorage.getItem('identity')
    if (identity) {
      this.identity = PrivateKey.fromString(identity)
      this.initClient(this.identity)
    }
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }

    return Singleton.instance
  }

  public getIdentity(): Identity | null {
    if (this.identity) return this.identity
    return null
  }

  public reset() {
    this.client = null
    this.credentials = {}
    this.identity = null
  }

  public getPubkey(): string {
    const identity = this.identity
    if (!identity) return ''
    return identity.public.toString()
  }

  public async initClient(id: Identity) {
    if (this.client) return this.client

    const credentials = await this.getCredentials()
    this.client = Client.withUserAuth(credentials)

    await this.client.getToken(id)

    const name = id.public.toString()
    try {
      await this.client.getThread(name)
    } catch (error) {
      await this.createDB(name)
    }
    await this.checkFollowCollection(name)

    return this.client
  }

  public async checkFollowCollection(name: string) {
    const threadId = await this.getThreadId(name)
    try {
      await this.client.getCollectionInfo(threadId, ARK_FOLLOW)
    } catch (error) {
      await this.client.newCollection(threadId, {
        name: ARK_FOLLOW,
        schema: ArkFollowSchema,
      })
    }
  }

  public async createDB(name: string) {
    const threadId = await this.client.newDB(undefined, name)
    await this.client.newCollection(threadId, {
      name: ARK_COLLECTION,
      schema: ArkFolderSchema,
    })
    await this.client.newCollection(threadId, {
      name: ARK_BOOKMARK,
      schema: ArkBookmarkSchema,
    })
    await this.client.newCollection(threadId, {
      name: ARK_FOLLOW,
      schema: ArkFollowSchema,
    })
    this.threadNameIdDic[name] = threadId
    return threadId
  }

  public async getCredentials(): Promise<UserAuth> {
    if (this.credentials) return this.credentials

    const result = await axios.post(
      'https://ark.chezhe.dev/api/auth/credentials'
    )

    this.credentials = result.data
    await AsyncStorage.setItem('credentials', JSON.stringify(this.credentials))
    return result.data
  }

  public async getThreadId(name: string): Promise<ThreadID> {
    if (!this.threadNameIdDic[name]) {
      const thread = await this.client.getThread(name)
      this.threadNameIdDic[name] = thread.id
      await AsyncStorage.setItem(
        'threadNameIdDic',
        JSON.stringify(this.threadNameIdDic)
      )
    }
    return ThreadID.fromString(this.threadNameIdDic[name])
  }

  public async createFollow(follow: ArkFollow): Promise<ArkFollow> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    const ids = await this.client.create(threadId, ARK_FOLLOW, [follow])
    return { ...follow, _id: ids[0] }
  }

  public async updateFollow(follow: ArkFollow): Promise<void> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.save(threadId, ARK_FOLLOW, [follow])
  }

  public async queryMyFollows() {
    if (!this.identity) {
      return []
    }
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    const condition = { sort: { fieldPath: '_id', desc: true } }
    return await this.client.find(threadId, ARK_FOLLOW, condition)
  }

  public async deleteFollow(ids: string[]) {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.delete(threadId, ARK_FOLLOW, ids)
  }

  public async createFolder(folder: ArkFolder): Promise<ArkFolder> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    const ids = await this.client.create(threadId, ARK_COLLECTION, [folder])
    return { ...folder, _id: ids[0] }
  }

  public async updateFolder(folder: ArkFolder): Promise<void> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.save(threadId, ARK_COLLECTION, [folder])
  }

  public async deleteFolder(folderId: string) {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    const query = new Where('collectionId').eq(folderId)
    const result = await this.findBookmarkEntity(pubkey, query)
    const ids = result.map((t) => t._id)
    try {
      await this.deleteBookmarks(ids)
    } catch (error) {
      await Promise.all(
        _.chunk(ids, 100).map((c) => {
          return this.deleteBookmarks(c)
        })
      )
    }
    return await this.client.delete(threadId, ARK_COLLECTION, [folderId])
  }

  public async queryMyFolders() {
    if (!this.identity) {
      return []
    }
    const pubkey = this.identity.public.toString()
    return await this.queryFolders(pubkey)
  }

  public async queryFolderByID(pubkey: string, folderId: string) {
    if (!folderId) {
      return null
    }
    const threadId = await this.getThreadId(pubkey)
    return await this.client.findByID(threadId, ARK_COLLECTION, folderId)
  }

  public async queryFolders(pubkey: string, folderId?: string) {
    const threadId = await this.getThreadId(pubkey)
    const condition = { sort: { fieldPath: '_id', desc: true } }
    return await this.client.find(threadId, ARK_COLLECTION, condition)
  }

  public async createBookmark(bookmark: ArkBookmark): Promise<ArkBookmark> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    const ids = await this.client.create(threadId, ARK_BOOKMARK, [bookmark])
    return { ...bookmark, _id: ids[0] }
  }

  public async createBookmarks(bookmarks: ArkBookmark[]): Promise<string[]> {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.create(threadId, ARK_BOOKMARK, bookmarks)
  }

  public async deleteBookmarks(ids: string[]) {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.delete(threadId, ARK_BOOKMARK, ids)
  }

  public async updateBookmark(bookmark: ArkBookmark) {
    const pubkey = this.identity.public.toString()
    const threadId = await this.getThreadId(pubkey)
    return await this.client.save(threadId, ARK_BOOKMARK, [bookmark])
  }

  public async queryBookmarkById(pubkey: string, bookmarkId: string) {
    const threadId = await this.getThreadId(pubkey)
    return await this.client.findByID(threadId, ARK_BOOKMARK, bookmarkId)
  }

  public async queryMyBookmarks(page: number) {
    if (!this.identity) {
      return []
    }
    const pubkey = this.identity.public.toString()
    return this.queryBookmarks(pubkey, page)
  }

  public async queryBookmarks(pubkey: string, page = 1) {
    const threadId = await this.getThreadId(pubkey)
    const condition = {
      sort: { fieldPath: '_id', desc: true },
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }
    return await this.client.find(threadId, ARK_BOOKMARK, condition)
  }

  public async queryBookmarksByFolder(
    pubkey: string,
    folderId: string,
    page = 1
  ) {
    const threadId = await this.getThreadId(pubkey)
    const condition = new Where('collectionId')
      .eq(folderId)
      .orderByIDDesc()
      .skipNum((page - 1) * PAGE_SIZE)
      .limitTo(PAGE_SIZE)

    const result = await this.client.find(threadId, ARK_BOOKMARK, condition)
    return result
  }

  public async findBookmarkEntity(
    pubkey: string,
    condition: QueryJSON = {}
  ): Promise<any[]> {
    const threadId = await this.getThreadId(pubkey)
    return await this.client.find(threadId, ARK_BOOKMARK, condition)
  }
}

export default Singleton
