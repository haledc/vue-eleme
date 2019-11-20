export interface ISupport {
  type: number
  description: string
}

export interface ISeller {
  name: string
  description: string
  deliveryTimer: number
  score: number
  serviceScore: number
  foodScore: number
  rankRate: number
  minPrice: number
  deliveryPrice: number
  ratingCount: number
  sellCount: number
  bulletin: string
  supports: ISupport[]
  avatar: string
  pics: string[]
  infos: string[]
  id?: number
}

export interface IFoodRating {
  username: string
  rateTime: number
  rateType: number
  text: string
  avatar: string
}

export interface IFood {
  name: string
  price: number
  oldPrice: string
  description: string
  sellCount: number
  rating: number
  info: string
  ratings: IFoodRating[]
  icon: string
  image: string
  count: number
}

export interface IGoods {
  name: string
  type: number
  foods: IFood[]
}

export interface IRatings {
  username: string
  rateTime: number
  deliveryTime: number
  score: number
  rateType: number
  text: string
  avatar: string
  recommend: string[]
}
