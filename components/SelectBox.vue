<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-300">{{ label }}</label>
    <select v-model="internalValue" class="mb-4 w-full rounded-md border border-white/10 bg-white/5 p-2 text-gray-300">
      <slot name="prepend" />
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
      <slot name="append" />
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: [ String, Number ],
    required: false,
  },
  options: {
    type: Array as () => string[] | number[] | readonly string[] | readonly number[],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const emits = defineEmits([ "update:modelValue" ]);

const { modelValue } = toRefs(props);
const internalValue = ref(modelValue?.value);

watch(internalValue, (newValue) => {
  emits("update:modelValue", newValue);
});

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});
</script>
