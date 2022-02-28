export const ArkFolderSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ArkFolder',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    createdAt: { type: 'number' },
    tags: { type: 'array' },
  },
}

export const ArkFollowSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ArkFollow',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    alias: { type: 'string' },
    pubkey: { type: 'string' },
    createdAt: { type: 'number' },
  },
}

export const ArkBookmarkSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ArkMark',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    user: { type: 'string' },
    origin: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    refer: { type: 'string' },
    type: { type: 'string' },
    createdAt: { type: 'number' },
    collectionId: { type: 'string' },
  },
}
