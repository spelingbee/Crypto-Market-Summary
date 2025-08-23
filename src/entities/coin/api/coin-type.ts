// id - will be used as key in the map, id is pair -> primary code, its a bit confusing, but ill keep it for now
export interface Coin {
    id: string,
    pair: {
        "primary": string,
        "secondary": string
    }
    price: {
        "last": string,
        "bestBid": string,
        "bestOffer": string,
        "change": {
            "direction": "Up" | "Down",
            "percent": string,
            "amount": string
        }
    }
    volume: {
        "primary": string,
        "secondary": string
    }

    priceHistory: string[]
}
export interface CoinConfig {
    code: string,
    sortOrder: number,
    ticker: string,
    type:  "Primary" | "Secondary",
    decimalsPlaces: number,
    iconUrl: string
}
