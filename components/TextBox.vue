<template>
  <div>
    <label class="mb-1 block text-xs font-medium text-gray-300">
      {{ label }}
    </label>
    <div class="mb-4">
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>
