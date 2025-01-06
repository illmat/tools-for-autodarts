<template>
  <button @click="handleClick" class="flex h-full flex-nowrap items-center justify-center rounded-md border border-white/10 bg-white/5 outline-none">
    <span v-if="icon" :class="`${icon} text-lg`" />
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  text?: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  emit("click");
}
</script>
