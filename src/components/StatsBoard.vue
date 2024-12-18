<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "../store/game.store";
import { storeToRefs } from "pinia";

const emits = defineEmits<{
  (e: "reset"): void;
}>();

function resetGame() {
  emits("reset");
}

const gameStore = useGameStore();
const { highestScore, timeTick } = storeToRefs(gameStore);

defineProps<{
  minesCount: number;
  flagCount: number;
}>();

const timeElapsed = computed(() => timeTick.value.toString().padStart(3, "0"));
</script>

<template>
  <header class="header">
    <div class="counter">
      <div class="stat">
        <span>🚩</span>
        <span>{{
          Math.max(0, minesCount - flagCount)
            .toString()
            .padStart(3, "0")
        }}</span>
      </div>
      <div class="stat">
        <span>⏱️</span>
        <span>{{ timeElapsed }}</span>
      </div>
      <div class="stat">
        <span>🏆</span>
        <span>{{ highestScore.toString().padStart(3, "0") }}</span>
      </div>
    </div>
    <button @click="resetGame">🏳️</button>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  button {
    background-color: white;
    aspect-ratio: 1;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 1px solid rgb(222, 222, 222);

    &:hover {
      background-color: rgb(61, 61, 61);
    }
  }
  .counter {
    font-family: "Kode Mono", serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 1rem;

    display: flex;
    gap: 10px;

    .stat {
      background-color: white;
      border: 1px solid rgb(222, 222, 222);
      border-radius: 5px;
      min-width: max-content;
      display: flex;
      overflow: hidden;
      span:first-child {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border-inline-end: 1px solid #e0e0e0;
      }
      span:not(:first-child) {
        padding: 5px 8px;
        display: block;
        color: rgb(255, 252, 75);
        background-color: #1e1e1e;
      }
    }
  }
}
</style>
