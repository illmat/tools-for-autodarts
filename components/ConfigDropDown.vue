<template>
  <div class="relative inline-block text-left">
    <button @click="toggleDropdown" class="inline-flex w-full items-center justify-center rounded-md border border-white/10 bg-white/5 outline-none">
      {{ text }}

      <span v-if="icon" :class="`${icon} text-lg`" />
    </button>
    <div v-if="isOpen" class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <div @click="selectItem(item)" v-for="item in items" :key="JSON.stringify(item)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref } from "vue";

defineProps<{
  text?: string;
  icon?: string;
  items: readonly(T)[] | T[];
}>();

const emit = defineEmits<{
  "select": [item: T];
}>();

const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectItem(item: T) {
  emit("select", item);
  isOpen.value = false;
}
</script>
