export interface Support {
  type: number
  description: string
}

export interface Seller {
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
  supports: [Support]
  avatar: string
  pics: [string]
  infos: [string]
  id?: number
}

export interface SellerResponse {
  status: number
  data: {
    errno: number
    data: Seller
  }
}

export interface FoodRating {
  username: string
  rateTime: number
  rateType: number
  text: string
  avatar: string
}

export interface Food {
  name: string
  price: number
  oldPrice: string
  description: string
  sellCount: number
  rating: number
  info: string
  ratings: [FoodRating]
  icon: string
  image: string
  count: number
}

export interface Good {
  name: string
  type: number
  foods: [Food]
}

export interface GoodsResponse {
  status: number
  data: {
    errno: number
    data: [Good]
  }
}

export interface Rating {
  username: string
  rateTime: number
  deliveryTime: number
  score: number
  rateType: number
  text: string
  avatar: string
  recommend: [string]
}

export interface RatingResponse {
  status: number
  data: {
    errno: number
    data: [Rating]
  }
}
