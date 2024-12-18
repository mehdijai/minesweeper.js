<script setup lang="ts">
import { ref } from "vue";
import GameStarter from "./components/GameStarter.vue";
import PlayBoard from "./components/PlayBoard.vue";
import { TGameMode } from "./core/gameModes";

const start = ref(false);
const selectedMode = ref<TGameMode>();

function startGame(mode: TGameMode) {
  start.value = true;
  selectedMode.value = mode;
}

function resetGame() {
  start.value = false;
  selectedMode.value = undefined;
}
</script>

<template>
  <main class="base">
    <template v-if="start && selectedMode !== undefined">
      <PlayBoard :mode="selectedMode" @reset="resetGame" />
    </template>
    <template v-else>
      <GameStarter @start="startGame" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.base {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}
</style>
