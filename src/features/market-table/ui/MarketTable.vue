<script setup lang="ts">
import {ref, computed, type ComputedRef, onBeforeUnmount, watch} from "vue";
import {type Coin} from "../../../entities/coin/api";
import MyCoin from "../../../entities/coin/ui/MyCoin.vue";
import SearchWithIcon from "../../../shared/ui/SearchWithIcon.vue";
import MySkeleton from "../../../shared/ui/MySkeleton.vue";
import {debounce} from "../../../shared/services/debounce";
import {storeToRefs} from "pinia";
import {useCoinsStore} from "../../../store/CoinStore.ts";

const coinsStore = useCoinsStore();
const { hasCoinsError, isCoinsLoading, coinConfigs } = storeToRefs(coinsStore);
const coinsData = coinsStore.coinsData;

coinsStore.fetchInitialData().then(() => {
  updateSortOrder();
  coinsStore.startPolling();
});

const sortedIds = ref<string[]>([]);
const searchQuery = ref('');

const filteredIds = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  if (!searchLower) return sortedIds.value;

  return sortedIds.value.filter(id => {
    const item = coinsData.get(id);
    return item && item.id.toLowerCase().includes(searchLower);
  });
});

const displayData: ComputedRef<Coin[]> = computed(() => {
  return filteredIds.value
      .map(id => coinsData.get(id))
      .filter((item): item is Coin => !!item);
});


const debouncedSearch = debounce((value: string) => {
  searchQuery.value = value;
}, 300)

const updateSortOrder = () => {
  const allIds = Array.from(coinsData.keys());
  sortedIds.value = allIds.sort((a, b) => {
    const aIndex = coinConfigs.value.get(a)?.sortOrder || 0;
    const bIndex = coinConfigs.value.get(b)?.sortOrder || 0;
    return aIndex - bIndex;
  });
}
watch(() => coinsData, (value) => {
  console.log(value)
  updateSortOrder();
}, {deep: true})

onBeforeUnmount(() => {
  coinsStore.stopPolling();
});
const tableGrid = "1.5fr 1fr 1fr 1fr 1fr 1fr 1fr"
</script>

<template>
  <div class="container">
    <div class="background-round" id="background-round-1"></div>
    <div class="background-round"  id="background-round-2"></div>
    <div class="background-round"  id="background-round-3"></div>
    <div class="background-round"  id="background-round-4"></div>
    <div class="background-round"  id="background-round-5"></div>
    <div class="table">
      <SearchWithIcon class="table-search" :model-value="searchQuery" @update:model-value="debouncedSearch" id="search-input">
        <template #icon>
          <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 44H46.84L45.72 42.92C49.64 38.36 52 32.44 52 26C52 11.64 40.36 0 26 0C11.64 0 0 11.64 0 26C0 40.36 11.64 52 26 52C32.44 52 38.36 49.64 42.92 45.72L44 46.84V50L64 69.96L69.96 64L50 44ZM26 44C16.04 44 8 35.96 8 26C8 16.04 16.04 8 26 8C35.96 8 44 16.04 44 26C44 35.96 35.96 44 26 44Z" fill="white"></path>
          </svg>
        </template>
      </SearchWithIcon>
      <div class="table-header">
        <div>Trading Pairs</div>
        <div>Last Traded Price</div>
        <div>24h Change %</div>
        <div>24h High</div>
        <div>24h Low</div>
        <div>24h Trading Volume</div>
        <div>Charts</div>
      </div>
      <div class="table-body">
        <template v-if="isCoinsLoading">
          <div v-for="i in 20" :key="i" class="skeleton table-item">
            <div class="pair">
              <MySkeleton class="my-coin__icon" width="25px" height="25px" border-radius="50%"/>
              <MySkeleton class="my-coin__icon" width="75px" height="15px"/>
            </div>
            <MySkeleton class="price" width="75px" height="15px"></MySkeleton>
            <MySkeleton class="change" width="70px" height="15px"></MySkeleton>
            <MySkeleton class="biggest-price" width="65px" height="15px"></MySkeleton>
            <MySkeleton class="lowest-price" width="55px" height="15px"></MySkeleton>
            <MySkeleton class="volume" width="95px" height="15px"></MySkeleton>
            <MySkeleton class="charts" width="115px" height="15px"></MySkeleton>
          </div>
        </template>
        <template v-else-if="hasCoinsError">
          <div class="error-message">
            Failed to load coin data
            <button @click="coinsStore.retry()" class="retry-btn">Retry</button>
          </div>
        </template>
        <template v-else>
          <div class="table-item" v-for="coinData in displayData" :key="coinData.id">
            <MyCoin
                :coin="coinData"
                :coin-config="coinConfigs.get(coinData.id)"
                :key="coinData.id"
                :grid="tableGrid"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  overflow: hidden;
  width: fit-content;
  margin: 40px auto 0;
  border-radius: 10px;
}

.background-round {
  position: absolute;
  background: #d5781a;
  border-radius: 64px;
  z-index: -1;
}

#background-round-1 {
  top: 0;
  left: 100%;
  width: 100px;
  height: 400px;
  transform: rotate(45deg) translate(-150%, 50%);
}

#background-round-2 {
  top: 100%;
  left: 30%;
  width: 400px;
  height: 150px;
  transform: translate(30%, -100%);
}

#background-round-3 {
  top: 0;
  left: 0;
  width: 100px;
  height: 400px;
  transform: rotate(-45deg) translate(50%, 10%);
}

.error-message {
  padding: 20px;
  text-align: center;
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 8px;
  margin: 20px;
}

.retry-btn {
  margin-left: 10px;
  padding: 5px 15px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.table {
  background: rgba(14, 12, 12, 0.49);
  backdrop-filter: blur(140px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 80vw;
}

.table-search svg{
  width: 20px;
  height: 20px;
}

.table-search:focus {
  max-width: 200px;
}
.table-header {
  display: grid;
  grid-template-columns: v-bind(tableGrid);
  padding: 10px 20px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.6);
  background: linear-gradient(to right, rgba(82, 82, 82, 0.33), rgba(65, 65, 65, 0.35));
  margin-top: 15px;
  font-weight: 500;
}

.table-body {
  max-height: 80vh;
  overflow-y: auto;
}
.table-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 20px;
}

.pair {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-item.skeleton {
  display: grid;
  grid-template-columns: v-bind(tableGrid);
  align-items: center;
  padding: 10px 20px;
  gap: 40px;
  min-height: 40px;
}


</style>