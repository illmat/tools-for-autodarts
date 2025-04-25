<template>
  <div class="fixed bottom-6 right-6 w-64 rounded-lg border border-gray-300 bg-black p-4 shadow-lg">
    <div v-if="!hasActiveTraining">
      <SelectBox v-if="trainingNames.length" v-model="selectedTraining" label="Trainings" :options="trainingNames" />

      <p v-else>
        No trainings configured yet
      </p>
    </div>
    <div v-else>
      <h2 class="text-lg font-semibold text-gray-800">
        Training: {{ trainingName }}
      </h2>
      <p class="text-sm text-gray-600">
        Fortschritt: {{ currentGame }}/{{ totalGames }} Spiele
      </p>
      <p class="text-sm text-gray-600">
        Laufzeit: {{ elapsedTime }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ITrainingsStore } from "@/utils/trainingStorage";
import { AutodartsToolsTrainingsConfig } from "@/utils/trainingStorage";
import SelectBox from "@/components/SelectBox.vue";

const hasActiveTraining = ref(false);
const trainingName = ref("Fußball Drills");
const selectedTraining = ref("");
const totalGames = ref(5);
const currentGame = ref(2);
const trainingsConfig = ref<ITrainingsStore>();

// Startzeit speichern
const startTime = ref(Date.now());

// Berechnung der vergangenen Zeit
const elapsedTime = computed(() => {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime.value) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${minutes}m ${seconds}s`;
});

const trainingNames = computed(() => {
  return trainingsConfig.value?.trainings.map(d => d.name) || [];
});

onMounted(async () => {
  trainingsConfig.value = await AutodartsToolsTrainingsConfig.getValue();
});

// Funktion zum Aktualisieren des Fortschritts
function updateProgress(game: number) {
  if (game <= totalGames.value) {
    currentGame.value = game;
  }
}
</script>
