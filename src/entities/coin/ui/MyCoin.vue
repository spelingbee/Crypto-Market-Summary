<script setup lang="ts">
import type {Coin, CoinConfig} from "../api";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

interface CoinProps {
  coinConfig?: CoinConfig
  coin: Coin
  grid: string
  chartLabels?: string[]
}
const props = withDefaults(defineProps<CoinProps>(), {
  chartLabels: () => ["1","2","3","4","5"]
})

const lastChange = computed(() => {
  if (+props.coin.price.change.amount === 0) {
    return '0.00'
  }
  if (props.coin.price.change.direction.toLowerCase() === 'up') {
    return `+ ${props.coin.price.change.amount}`
  }
  return `- ${props.coin.price.change.amount}`
})

const lastChangeClass = computed(() => {
  if (+props.coin.price.change.amount === 0) {
    return ''
  }
  return props.coin.price.change.direction.toLowerCase() === 'up' ? 'up' : 'down'
})

const priceExtremums = computed(() => {
  const sortedPrices = [...props.coin.priceHistory].sort((a, b) => parseFloat(b) - parseFloat(a))
  return {
    biggest: Number(sortedPrices[0]).toFixed(2),
    lowest: Number(sortedPrices[sortedPrices.length - 1]).toFixed(2)
  }
})

const getChartData = (data: string[], max = 5) => {
  const last = data.slice(-max)
  return last.map(price => parseFloat(price))
}

const getChartColor = (data: number[]) => {
  if (data.length < 2) {
    return "#4ade80"
  }
  return data[0] > data[data.length - 1] ? "#f87171" : "#4ade80"
}


const canvasEl = ref<HTMLCanvasElement | null>(null)
const chart = ref<Chart | null>(null)
const chartData = ref(getChartData(props.coin.priceHistory))
const chartDataColor = ref(getChartColor(chartData.value))

watch(
    () => props.coin.priceHistory,
    (newPrices) => {
      chartData.value = getChartData(newPrices)
      chartDataColor.value = getChartColor(chartData.value)
      if (chart.value) {
        chart.value.data.datasets[0].data = chartData.value
        chart.value.data.datasets[0].borderColor = chartDataColor.value
        chart.value.update()
      }
    }
)

onMounted(() => {
  if (canvasEl.value) {
    chart.value = new Chart(canvasEl.value, {
      type: 'line',
      data: {
        labels: props.chartLabels,
        datasets: [{
          data: chartData.value,
          borderWidth: 1,
          borderColor: chartDataColor.value
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            display: false,
            ticks: {
              display: false
            }
          },
          y: {
            display: false,
            ticks: {
              display: false
            }
          }
        },
        layout: {
          padding: 0
        },
        elements: {
          point: {
            radius: 2
          }
        },
        aspectRatio: 2
      }
    });
  }
})
onUnmounted(() => {
  chart.value?.destroy()
  chart.value = null
})
</script>

<template>
  <div class="my-coin">
    <div class="pair">
      <img class="my-coin__icon" :src="coinConfig?.iconUrl" alt="">
      <p>
        {{coin.pair.primary}}
        <span> / {{coin.pair.secondary}}</span>
      </p>
    </div>
    <div class="price">{{coin.price.last}}</div>
    <div class="change" :class="lastChangeClass">{{lastChange}}$</div>
    <div class="biggest-price">{{priceExtremums.biggest}}</div>
    <div class="lowest-price">{{priceExtremums.lowest}}</div>
    <div class="volume">{{Number(coin.volume.secondary).toFixed(2)}} <span>({{coin.pair.secondary}})</span></div>
    <div class="chart">
      <canvas ref="canvasEl" :id="coin.id" width="50px" height="50px"></canvas>
    </div>
  </div>
</template>

<style scoped>
.my-coin {
  display: grid;
  align-items: center;
  grid-template-columns: v-bind(grid);
  color: rgba(255,255,255,0.8);
  font-size: 15px;
  line-height: 24px;
}
.pair {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
}
.pair span {
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}
.my-coin__icon {
  width: 25px;
  height: 25px;
}

.change.up {
  color: #29cc6a;
}
.change.down {
  color: #ff4d4f;
}

.volume span {
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}

</style>