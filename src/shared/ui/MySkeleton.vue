<script setup lang="ts">
import {computed} from "vue";

interface MySkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  animationDuration?: string
  animationDelay?: string
  animationDirection?: string
  animationIterationCount?: string
  animationFillMode?: string
  animationPlayState?: string
  animationTimingFunction?: string
}

const props = withDefaults(defineProps<MySkeletonProps>(), {
  width: '100%',
  height: '100%',
  borderRadius: '4px',
  animationDuration: '1s',
  animationDelay: '0s',
  animationDirection: 'alternate',
  animationIterationCount: 'infinite',
  animationFillMode: 'forwards',
  animationPlayState: 'running',
  animationTimingFunction: 'linear',
})

const style = computed(() => {
  return {
    width: props.width,
    height: props.height,
    borderRadius: props.borderRadius,
    animationDuration: props.animationDuration,
    animationDelay: props.animationDelay,
    animationDirection: props.animationDirection,
    animationIterationCount: props.animationIterationCount,
    animationFillMode: props.animationFillMode,
    animationPlayState: props.animationPlayState,
  }
})
</script>

<template>
  <div class="my-skeleton" :style="style">
    <slot></slot>
  </div>
</template>

<style scoped>
.my-skeleton {
  animation: skeleton-loading;
  color: transparent;
}


</style>