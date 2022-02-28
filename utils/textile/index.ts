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
import { ArkBookmark, ArkFolder } from '../../types'
import { ArkBookmarkSchema, ArkFolderSchema } from './schemas'

let client: Client

const ARK_COLLECTION = 'ARKCOLLECTION'
const ARK_BOOKMARK = 'ARKBOOKMARK'

export const getThreadName = (identity: string | PrivateKey) => {
  if (typeof identity === 'string') {
    identity = PrivateKey.fromString(identity)
  }
  return identity.public.toString()
}

export const initClient = async (id: Identity): Promise<Client> => {
  const credentials = await getCredentials()
  client = Client.withUserAuth(credentials)
  await client.getToken(id)
  const name = getThreadName(id.toString())
  try {
    await client.getThread(name)
  } catch (error) {
    await createDB(name)
  }
  return client
}

export const createDB = async (name: string): Promise<ThreadID> => {
  const threadId = await client.newDB(undefined, name)
  await client.newCollection(threadId, {
    name: ARK_COLLECTION,
    schema: ArkFolderSchema,
  })
  await client.newCollection(threadId, {
    name: ARK_BOOKMARK,
    schema: ArkBookmarkSchema,
  })
  return threadId
}

export const getThreadId = async (identityStr: string): Promise<ThreadID> => {
  const ctId = getThreadName(identityStr)
  const thread = await client.getThread(ctId)
  return ThreadID.fromString(thread.id)
}

export const listUserFolders = async (
  identityStr: string,
  codition: QueryJSON = {}
) => {
  return await findCollectionEntity(identityStr, codition)
}

export const listUserBookmarks = async (
  identityStr: string,
  codition: QueryJSON = {}
) => {
  return await findBookmarkEntity(identityStr, codition)
}

export const createCollection = async (
  identityStr: string,
  folder: ArkFolder
): Promise<string[]> => {
  const threadId = await getThreadId(identityStr)
  return await client.create(threadId, ARK_COLLECTION, [folder])
}

export const updateCollection = async (
  identityStr: string,
  folder: ArkFolder
) => {
  const threadId = await getThreadId(identityStr)
  return await client.save(threadId, ARK_COLLECTION, [folder])
}

export const deleteCollection = async (
  identityStr: string,
  collectionId: string
) => {
  const threadId = await getThreadId(identityStr)
  const query = new Where('collectionId').eq(collectionId)
  return await client.delete(threadId, ARK_COLLECTION, [collectionId])
}

export const createBookmark = async (
  identityStr: string,
  bookmark: ArkBookmark
): Promise<string[]> => {
  const threadId = await getThreadId(identityStr)
  return await client.create(threadId, ARK_BOOKMARK, [bookmark])
}

export const deleteBookmarks = async (identityStr: string, ids: string[]) => {
  const threadId = await getThreadId(identityStr)
  return await client.delete(threadId, ARK_BOOKMARK, ids)
}

export const updateBookmark = async (
  identityStr: string,
  bookmark: ArkBookmark
) => {
  const threadId = await getThreadId(identityStr)
  return await client.save(threadId, ARK_BOOKMARK, [bookmark])
}

export const findCollectionEntity = async (
  identityStr: string,
  codition: QueryJSON = {}
): Promise<any[]> => {
  const threadId = await getThreadId(identityStr)
  return await client.find(threadId, ARK_COLLECTION, codition)
}

export const findBookmarkEntity = async (
  identityStr: string,
  condition: QueryJSON = {}
): Promise<any[]> => {
  const threadId = await getThreadId(identityStr)
  return await client.find(threadId, ARK_BOOKMARK, condition)
}

export async function createIdentity(): Promise<PrivateKey> {
  return await PrivateKey.fromRandom()
}

export function createIdentityFromString(str: string) {
  return PrivateKey.fromString(str)
}

export async function getCredentials(): Promise<UserAuth> {
  const result = await axios.post('https://ark.chezhe.dev/api/auth/credentials')
  return result.data
}
