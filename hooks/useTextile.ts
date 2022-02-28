import useSWR from 'swr'
import { PrivateKey } from '@textile/hub'
import client from '../utils/textile/instance'

export const useFolders = (pubkey: string): any => {
  const instance = client.getInstance()
  const { data, error } = useSWR(`/api/user/${pubkey}/folders`, () => {
    return instance.queryFolders(pubkey)
  })
  return {
    folders: data,
    isLoading: !error && !data,
    error,
  }
}

export const useMyFollows = (): any => {
  const instance = client.getInstance()
  const pubkey = instance.getPubkey()
  const { data, error, mutate } = useSWR(
    `/api/my-follows?pubkey=${pubkey}`,
    () => {
      return instance.queryMyFollows()
    }
  )
  return {
    follows: data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export const useMyFolders = (): any => {
  const instance = client.getInstance()
  const pubkey = instance.getPubkey()
  const { data, error, mutate } = useSWR(
    `/api/my-folders?pubkey=${pubkey}`,
    () => {
      return instance.queryMyFolders()
    }
  )
  return {
    folders: data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export const useFolderByID = (
  collectionId: string
): { folder: any; isLoading: boolean; error: any } => {
  const instance = client.getInstance()
  const pubkey = instance.getPubkey()
  const { data, error } = useSWR(
    `/api/user/${pubkey}/folder/${collectionId}`,
    () => {
      return instance.queryFolderByID(pubkey, collectionId)
    }
  )
  return {
    folder: data,
    isLoading: !error && !data,
    error,
  }
}

export const useMyBookmarks = (page = 1) => {
  const instance = client.getInstance()
  const { data, error, mutate } = useSWR(
    `/api/my-bookmarks?page=${page}`,
    () => {
      return instance.queryMyBookmarks(page)
    }
  )
  return {
    bookmarks: data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export const useBookmarkById = (pubkey: string, bookmarkId: string): any => {
  const instance = client.getInstance()
  const { data, error } = useSWR(
    `/api/user/${pubkey}/bookmark/${bookmarkId}`,
    () => {
      return instance.queryBookmarkById(pubkey, bookmarkId)
    }
  )
  return {
    bookmarks: data,
    isLoading: !error && !data,
    error,
  }
}

export const useBookmarks = (pubkey: string, page = 1): any => {
  const instance = client.getInstance()
  const { data, error } = useSWR(
    `/api/user/${pubkey}/bookmarks?page=${page}`,
    () => {
      return instance.queryBookmarks(pubkey, page)
    }
  )
  return {
    bookmarks: data,
    isLoading: !error && !data,
    error,
  }
}

export const useBookmarksByFolder = (
  pubkey: string,
  folderId: string,
  page: number
): any => {
  const instance = client.getInstance()
  const { data, error } = useSWR(
    `/api/user/${pubkey}/folder/${folderId}/bookmarks?page=${page}`,
    () => {
      return instance.queryBookmarksByFolder(pubkey, folderId, page)
    }
  )
  return {
    bookmarks: data,
    isLoading: !error && !data,
    error,
  }
}

export const useIdentity = () => {
  if (typeof localStorage !== 'undefined') {
    const id = localStorage.getItem('identity')
    if (!id) return null

    return PrivateKey.fromString(id)
  }
  return null
}
