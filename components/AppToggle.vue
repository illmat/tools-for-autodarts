<template>
  <div
    class="relative flex overflow-hidden rounded-md bg-[var(--chakra-colors-whiteAlpha-200)]"
    :class="{
      'h-6': props.size === 'xs',
      'h-8': props.size === 'sm',
      'h-10': props.size === 'md',
    }"
  >
    <button
      @click="setToOn"
      :class="twMerge(
        'flex h-full items-center justify-center text-[var(--chakra-colors-whiteAlpha-900)] transition-colors',
        props.size === 'xs' ? 'px-3 text-xs font-medium'
        : props.size === 'sm' ? 'px-4 text-sm font-semibold' : 'px-4 font-semibold',
        props.modelValue
          ? 'bg-[var(--chakra-colors-whiteAlpha-300)]'
          : 'enabled:hover:bg-[var(--chakra-colors-whiteAlpha-200)]',
      )"
    >
      On
    </button>
    <button
      @click="setToOff"
      :class="twMerge(
        'flex h-full items-center justify-center text-[var(--chakra-colors-whiteAlpha-900)] transition-colors',
        props.size === 'xs' ? 'px-3 text-xs font-medium'
        : props.size === 'sm' ? 'px-4 text-sm font-semibold' : 'px-4 font-semibold',
        !props.modelValue
          ? 'bg-[var(--chakra-colors-whiteAlpha-300)]'
          : 'enabled:hover:bg-[var(--chakra-colors-whiteAlpha-200)]',
      )"
    >
      Off
    </button>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from "tailwind-merge";

// Define props with defaults
const props = withDefaults(defineProps<{
  modelValue: boolean;
  size?: "xs" | "sm" | "md";
}>(), {
  size: "md",
});

const emit = defineEmits([ "update:modelValue" ]);

function setToOn() {
  if (!props.modelValue) {
    emit("update:modelValue", true);
  }
}

function setToOff() {
  if (props.modelValue) {
    emit("update:modelValue", false);
  }
}
</script>
