import { defineStore } from 'pinia';
import {ref, reactive} from 'vue';
import { type Coin, type CoinConfig, fetchCoinConfig, fetchCoinMarket } from '../entities/coin/api';
import { poll } from '../shared/services/realtime/polling';
import { useLocalErrors } from '../shared/composables';
import {logger} from "../shared/services/logger.ts";

export const useCoinsStore = defineStore('coins', () => {
    const coinsData = reactive<Map<string, Coin>>(new Map());
    const coinConfigs = ref<Map<string, CoinConfig>>(new Map());
    const {
        currentError,
        executeWithErrorHandling: executeCoinsWithErrorHandling,
        isLoading: isCoinsLoading,
        hasError: hasCoinsError,
        setError: setCoinsError,
        clearError: clearCoinsError,
    } = useLocalErrors();
    // need to add error showing in ui because without config site wont work
    const {
        executeWithErrorHandling: executeConfigsWithErrorHandling,
    } = useLocalErrors();

    const loadCoinConfigs = async () => {
        const result = await executeConfigsWithErrorHandling(
            () => fetchCoinConfig(),
            'Failed to load coin configuration'
        );

        if (result) {
            coinConfigs.value = new Map(result.map(item => [item.code, item]));
        }
    };



    let isCurrentlyFetching = false;

    const fetchWithLoadingState = async () => {
        if (isCurrentlyFetching) {
            return [];
        }

        try {
            isCurrentlyFetching = true;

            if (hasCoinsError.value) {
                clearCoinsError();
            }
            isCoinsLoading.value = true;

            const result = fetchCoinMarket()
            return result;
        } finally {
            isCoinsLoading.value = false;
            isCurrentlyFetching = false;
        }
    };
    let poller: ReturnType<typeof poll> | null = null;

    const hasChanges = (old: Coin, new_: Coin) => {
        // can be updated by plugin
        return old.price.last !== new_.price.last
    }

    const updateCoinData = (newData: Coin[]) => {
        const newIds = new Set();

        newData.forEach(item => {
            newIds.add(item.id);
            const existing = coinsData.get(item.id);

            if (!existing) {
                coinsData.set(item.id, item);
            } else if (hasChanges(existing, item)) {
                logger.debug('Updating coin data:', item.id, existing, item);
                Object.assign(existing, item);
            }
        });

        coinsData.forEach((_, id) => {
            if (!newIds.has(id)) {
                coinsData.delete(id);
            }
        });
    }

    const fetchInitialData = async () => {
        const marketData = await executeCoinsWithErrorHandling(fetchCoinMarket, "Failed to fetch coin data");
        if (marketData) {
            updateCoinData(marketData);
        }
        await loadCoinConfigs()
    };

    const startPolling = () => {
        if (poller) {
            poller.restart();
            return;
        }


        poller = poll(
            fetchWithLoadingState,
            updateCoinData,
            {
                intervalMs: 5000,
                maxRetries: 5,
                onError: (error) => {
                    setCoinsError(error, 'Failed to update coin data');
                }
            }
        );
    };

    const stopPolling = () => {
        poller?.stop();
    };

    const retry = () => {
        clearCoinsError();
        startPolling();
    }

    return {
        // State
        coinsData,
        coinConfigs,
        currentError,
        isCoinsLoading,
        hasCoinsError,
        fetchInitialData,
        startPolling,
        stopPolling,
        retry
    };
});
