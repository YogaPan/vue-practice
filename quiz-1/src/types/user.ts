export enum FilterType {
  All = 1,
  Favorite = 2,
}

export enum DisplayMode {
  Card = 1,
  List = 2,
}

export interface User {
  name: {
    first: string
    last: string
  }
  email: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
  phone: string
  favoriteBy?: string[]
  favorite?: boolean
}

export interface UserResult {
  users: User[]
  firstUser: string
  lastUser: string
  hasNext: boolean
  hasPrev: boolean
  totalCount: number
}

export interface AllCounterResult {
  count: number
}

export interface FavoriteCounterResult {
  [uid: string]: number
}

export interface FavoriteDoc {
  favorites: string[]
}

export interface PageOption {
  filterType: FilterType
  pageIndex: number
  pageSize: number
  total: number
  users: User[]
}
