import { z } from 'zod'

export const CoinConfigSchema = z.object({
    code: z.string(),
    sort_order: z.number(),
    ticker: z.string(),
    type: z.enum(['Primary', 'Secondary']),
    decimals_places: z.number(),
    icon: z.string(),
})

export type CoinConfigDto = z.infer<typeof CoinConfigSchema>

export const CoinMarketSchema = z.object({
    pair: z.object({
        primary: z.string(),
        secondary: z.string(),
    }),
    price: z.object({
        last: z.string(),
        bestBid: z.string(),
        bestOffer: z.string(),
        change: z.object({
            direction: z.enum(['Up', 'Down']),
            percent: z.string(),
            amount: z.string(),
        })
    }),
    volume: z.object({
        primary: z.string(),
        secondary: z.string(),
    }),
    priceHistory: z.array(z.string()),
})

export type CoinMarketDto = z.infer<typeof CoinMarketSchema>

