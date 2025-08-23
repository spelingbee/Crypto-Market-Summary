import type {Coin, CoinConfig} from "./coin-type.ts";
import {mapCoinConfig, mapCoinMarket} from "./coin.mapper.ts";
import {type CoinConfigDto, CoinConfigSchema, type CoinMarketDto, CoinMarketSchema} from "./dto/coin.schema.ts";
import {fetchData} from "../../../shared/api";

export const fetchCoinConfig = () => fetchData<CoinConfigDto, CoinConfigDto, CoinConfig>(
    '/currency',
    CoinConfigSchema.array(),
    mapCoinConfig
);

export const fetchCoinMarket = () => fetchData<CoinMarketDto, CoinMarketDto, Coin>(
    '/market',
    CoinMarketSchema.array(),
    mapCoinMarket
);