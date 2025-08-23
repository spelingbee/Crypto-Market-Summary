<script setup lang="ts">
import {ref} from "vue";

interface SearchWithIconProps {
  id?: string;
}
const props = defineProps<SearchWithIconProps>()
const modelValue = defineModel()

const uid = ref(props.id)
if (!props.id) {
  uid.value = Math.random().toString(36).slice(2)
}
</script>

<template>
  <div class="search-container">
    <div class="search">
      <label :for="uid" class="search-label">
        <slot name="icon"></slot>
      </label>
      <input
          :id="uid"
          v-model="modelValue"
          class="search-input"
          type="text"
      />
    </div>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 8px;
  outline: none;
  border-radius: 7px;
  padding: 8px 12px;
  margin: 8px;
  background: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 200px;
}

.search-input {
  border: 0;
  background: none;
  outline: none;
  font-family: Inter, Roboto, system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.search-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>