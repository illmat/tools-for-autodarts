<template>
  <template v-if="!$attrs['data-feature-index']">
    <!-- Settings Panel -->
    <div
      v-if="config"
      class="adt-container min-h-56"
    >
      <div class="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 class="mb-1 flex flex-col items-start gap-2 font-bold uppercase sm:flex-row sm:items-center sm:justify-between">
            <span>Settings - Animations</span>
          </h3>
          <div class="space-y-3 text-white/70">
            <p>Configure the animations for the game. Click the plus button to add a new animation.</p>

            <!-- Animation Settings -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-white">Delay (seconds)</label>
                <AppInput
                  @update:model-value="val => config!.animations.delayStart = Number(val)"
                  v-if="config"
                  :model-value="String(config.animations.delayStart || 1)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="1"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-white">Duration (seconds)</label>
                <AppInput
                  @update:model-value="val => config!.animations.duration = Number(val)"
                  v-if="config"
                  :model-value="String(config.animations.duration || 5)"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="5"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-white">Object Fit</label>
                <AppSelect
                  @update:model-value="val => config!.animations.objectFit = val as 'cover' | 'contain'"
                  v-if="config"
                  :model-value="config.animations.objectFit || 'cover'"
                  :options="[
                    { value: 'cover', label: 'Cover' },
                    { value: 'contain', label: 'Contain' },
                  ]"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-white">View Mode</label>
                <AppSelect
                  @update:model-value="val => config!.animations.viewMode = val as 'full-page' | 'board-only'"
                  v-if="config"
                  :model-value="config.animations.viewMode || 'board-only'"
                  :options="[
                    { value: 'full-page', label: 'Full Page' },
                    { value: 'board-only', label: 'Board Only' },
                  ]"
                />
              </div>
            </div>

            <div class="mt-2 flex items-center gap-2 text-sm">
              <span class="icon-[pixelarticons--drag-and-drop] text-white/60" />
              <p>Drag and drop animations to change their order</p>
            </div>

            <div
              ref="animationsContainer"
              :key="containerKey"
              class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <div
                @click="openAddAnimationModal"
                v-if="allowAdd"
                class="add-animation-button flex aspect-video cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-white/30 bg-transparent p-4 transition-colors hover:bg-white/10"
              >
                <div class="flex flex-col items-center">
                  <span class="icon-[pixelarticons--plus] mb-1 text-xl" />
                  <span>Add Animation</span>
                </div>
              </div>

              <!-- Display existing animations -->
              <div
                v-for="(animation, index) in config.animations.data"
                :key="index"
                :data-id="index"
                class="group relative aspect-video overflow-hidden rounded-md border border-white/30 bg-black/30"
                :class="{
                  'opacity-50': !animation.enabled,
                }"
              >
                <!-- Main content -->
                <img :src="animation.url" class="size-full object-cover">

                <!-- Drag handle overlay -->
                <div class="absolute inset-0 flex h-12 cursor-move items-center justify-center bg-gradient-to-b from-black/100 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <span class="icon-[pixelarticons--drag-and-drop] text-lg text-white/70" />
                </div>

                <!-- Disabled overlay -->
                <div v-if="!animation.enabled" class="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span class="icon-[pixelarticons--close-circle] text-2xl text-white/70" />
                </div>

                <!-- Toggle button -->
                <div class="absolute left-2 top-2 z-20">
                  <AppToggle
                    @update:model-value="toggleAnimationEnabled(index)"
                    :model-value="animation.enabled"
                    size="sm"
                  />
                </div>

                <!-- Edit button -->
                <div class="absolute right-2 top-2 z-20">
                  <button
                    @click.stop="editAnimation(index)"
                    class="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <span class="icon-[pixelarticons--edit] text-sm" />
                  </button>
                </div>

                <!-- Info section -->
                <div class="absolute inset-x-0 bottom-0 cursor-move bg-black/70 p-2 text-xs">
                  <div class="truncate font-mono uppercase">
                    {{ Array.isArray(animation.triggers) ? animation.triggers.join(', ') : '' }}
                  </div>
                  <div class="mt-1 flex justify-end">
                    <button
                      @click.stop="removeAnimation(index)"
                      class="text-red-500 hover:text-red-400"
                    >
                      <span class="icon-[pixelarticons--trash] text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Animation Modal (Add/Edit) -->
    <AppModal
      @close="closeAnimationModal"
      :show="showAnimationModal"
      :title="isEditMode ? 'Edit Animation' : 'Add Animation'"
    >
      <div class="space-y-4">
        <div>
          <label for="animation-url" class="mb-1 block text-sm font-medium text-white">Animation URL (GIF)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-white/60">
              <span class="icon-[pixelarticons--link]" />
            </span>
            <AppInput
              id="animation-url"
              v-model="newAnimation.url"
              type="url"
              placeholder="https://example.com/animation.gif"
              class="pl-9"
            />
          </div>
        </div>

        <hr class="border-white/20">

        <div>
          <label for="animation-text" class="mb-1 flex items-center justify-between text-sm font-medium text-white">
            <span>Triggers <span class="text-xs text-white/60">(one per line)</span></span>
            <a
              href="https://github.com/creazy231/tools-for-autodarts?tab=readme-ov-file#-animations"
              target="_blank"
              class="text-blue-400 hover:text-blue-300"
            >
              View supported triggers
            </a>
          </label>
          <AppTextarea
            id="animation-text"
            v-model="lowercaseText"
            :placeholder="textareaPlaceholder"
            monospace
            :rows="6"
            :max-rows="10"
          />
        </div>
      </div>

      <template #footer>
        <AppButton @click="closeAnimationModal">
          Cancel
        </AppButton>
        <AppButton @click="saveAnimation" type="success">
          Save
        </AppButton>
      </template>
    </AppModal>
  </template>

  <template v-else>
    <!-- Feature Card -->
    <div
      v-if="config"
      class="adt-container h-56 transition-transform hover:-translate-y-0.5"
    >
      <div class="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 class="mb-1 flex items-center font-bold uppercase">
            Animations
            <span class="icon-[material-symbols--settings-alert-outline-rounded] ml-2 size-5" />
          </h3>
          <p class="w-2/3 text-white/70">
            Displays animations for special events like 180s, bulls, busts, and leg wins during gameplay.
          </p>
        </div>
        <div class="flex">
          <div @click="$emit('toggle', 'animations')" class="absolute inset-y-0 left-12 right-0 cursor-pointer" />
          <AppToggle
            @update:model-value="toggleFeature"
            v-model="config.animations.enabled"
          />
        </div>
      </div>
      <div class="gradient-mask-left absolute inset-y-0 right-0 w-2/3">
        <img :src="imageUrl" alt="Animations" class="size-full object-cover">
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import Sortable from "sortablejs";
import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import AppToggle from "../AppToggle.vue";
import AppModal from "../AppModal.vue";
import AppTextarea from "../AppTextarea.vue";
import AppInput from "../AppInput.vue";
import AppSelect from "../AppSelect.vue";
import AppButton from "../AppButton.vue";
import { AutodartsToolsConfig, type IAnimation, type IConfig } from "@/utils/storage";
import { useNotification } from "@/composables/useNotification";

const emit = defineEmits([ "toggle", "settingChange" ]);
const { notification, showNotification, hideNotification } = useNotification();
useStorage("adt:active-settings", "animations");
const config = ref<IConfig>();
const imageUrl = browser.runtime.getURL("/images/animations.png");
const showAnimationModal = ref(false);
const isEditMode = ref(false);
const newAnimation = ref({
  url: "",
  text: "",
});
const allowAdd = ref(false);
const editingIndex = ref<number | null>(null);
const animationsContainer = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const currentDragIndex = ref<number | null>(null);
const containerKey = ref(0);
let sortableInstance: Sortable | null = null;

// Computed property for lowercase text handling
const lowercaseText = computed({
  get: () => newAnimation.value.text,
  set: (val: string) => {
    newAnimation.value.text = val.toLowerCase();
  },
});

const textareaPlaceholder = `0
180
triple 20
double bull
bull
bust
checkout
high score
ton
ton 40
ton 80
hat-trick
whitewash
nine dart
`;

onMounted(async () => {
  config.value = await AutodartsToolsConfig.getValue();
  await nextTick();
  initSortable();
  await nextTick();
  allowAdd.value = true;
});

watch(config, async (_, oldValue) => {
  if (!oldValue) return;

  await AutodartsToolsConfig.setValue(toRaw(config.value!));
  emit("settingChange");
  console.log("Animations setting changed");
}, { deep: true });

function initSortable() {
  if (!animationsContainer.value) return;

  // Clean up any existing instance
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  // Create a new Sortable instance
  sortableInstance = Sortable.create(animationsContainer.value, {
    animation: 150,
    draggable: "[data-id]",
    filter: ".flex.h-32", // Don't make the "Add Animation" button draggable
    ghostClass: "bg-gray-700",
    handle: ".cursor-move", // Use the info section as the drag handle
    onEnd(evt) {
      isDragging.value = false;
      currentDragIndex.value = null;

      // Only update if the position actually changed
      if (evt.oldIndex !== evt.newIndex && config.value?.animations.data) {
        // Get the moved item
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        // Update the data array to match the DOM
        if (oldIndex !== undefined && newIndex !== undefined) {
          const movedItem = config.value.animations.data.splice(oldIndex - 1, 1)[0];

          config.value.animations.data.splice(newIndex - 1, 0, movedItem);

          // Update the container key to force re-render
          containerKey.value++;

          // Show notification
          showNotification("Animation order updated");

          // Re-initialize sortable after a short delay to ensure DOM is updated
          setTimeout(() => {
            initSortable();
          }, 50);
        }
      }
    },
  });
}

function toggleAnimationEnabled(index: number) {
  if (!config.value || !config.value.animations.data[index]) return;

  // Toggle the enabled state
  config.value.animations.data[index].enabled = !config.value.animations.data[index].enabled;
}

function editAnimation(index: number) {
  if (!config.value || !config.value.animations.data[index]) return;

  newAnimation.value = {
    url: config.value.animations.data[index].url || "",
    text: Array.isArray(config.value.animations.data[index].triggers)
      ? config.value.animations.data[index].triggers.join("\n")
      : "",
  };
  isEditMode.value = true;
  editingIndex.value = index;
  showAnimationModal.value = true;
}

function saveAnimation() {
  if (!config.value || !newAnimation.value.url || !newAnimation.value.text) {
    return;
  }

  // Convert text to array of triggers (split by newline and filter empty lines)
  const triggers = newAnimation.value.text
    .split("\n")
    .map(line => line.trim().toLowerCase())
    .filter(line => line.length > 0);

  // Create animation object
  const animation: IAnimation = {
    url: newAnimation.value.url.trim(),
    triggers: Array.isArray(triggers) ? triggers : [], // Ensure triggers is an array
    enabled: true, // New animations are enabled by default
  };

  if (isEditMode.value && editingIndex.value !== null) {
    // Update existing animation
    const existingAnimation = config.value.animations.data[editingIndex.value];
    animation.enabled = existingAnimation.enabled; // Preserve enabled state when editing
    config.value.animations.data[editingIndex.value] = animation;
  } else {
    // Add to animations data array
    config.value.animations.data.unshift(animation);
  }

  // Reset form and close modal
  newAnimation.value = { url: "", text: "" };
  showAnimationModal.value = false;
  editingIndex.value = null;
}

function closeAnimationModal() {
  newAnimation.value = { url: "", text: "" };
  showAnimationModal.value = false;
  editingIndex.value = null;
}

function removeAnimation(index: number) {
  if (config.value && config.value.animations.data) {
    config.value.animations.data.splice(index, 1);
    containerKey.value++; // Force re-render of the list
  }
}

function openAddAnimationModal() {
  newAnimation.value = { url: "", text: "" };
  isEditMode.value = false;
  editingIndex.value = null;
  showAnimationModal.value = true;
}

async function toggleFeature() {
  if (!config.value) return;

  // Toggle the feature
  const wasEnabled = config.value.animations.enabled;
  config.value.animations.enabled = !wasEnabled;

  // If we're enabling the feature, open settings
  if (!wasEnabled) {
    await nextTick();
    emit("toggle", "animations");
  }
}
</script>
