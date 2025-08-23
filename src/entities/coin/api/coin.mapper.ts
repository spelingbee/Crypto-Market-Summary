import type {CoinConfigDto, CoinMarketDto} from './dto/coin.schema.ts'
import type {Coin, CoinConfig} from './coin-type'
import {createMapper} from "../../../shared/api";

export const mapCoinMarket = createMapper<CoinMarketDto, Coin>(
    'CoinMarket',
    (dto) => ({
        id: dto.pair.primary,
        pair: {
            primary: dto.pair.primary,
            secondary: dto.pair.secondary
        },
        price: dto.price,
        priceHistory: dto.priceHistory,
        volume: {
            primary: dto.volume.primary,
            secondary: dto.volume.secondary,
        },
    }),
    (dto) => !!dto && !!dto.pair && !!dto.volume
);

export const mapCoinConfig = createMapper<CoinConfigDto, CoinConfig>(
    'CoinConfig',
    (dto) => ({
        code: dto.code,
        type: dto.type,
        ticker: dto.ticker,
        sortOrder: dto.sort_order,
        decimalsPlaces: dto.decimals_places,
        iconUrl: 'data:image/svg+xml;base64,' + dto.icon,
    }),
    (dto) => !!dto
);