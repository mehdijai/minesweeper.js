<script setup lang="ts">
import { TGameMode, GameModes } from "../core/gameModes";
import { computed, reactive, ref } from "vue";
import PlayBoardPlaceholder from "../components/PlayBoardPlaceholder.vue";

const emits = defineEmits<{
  (e: "start", mode: TGameMode): void;
}>();

const selectedMode = ref<TGameMode>("beginner");
const modes = reactive<TGameMode[]>([
  "starter",
  "beginner",
  "intermediate",
  "expert",
]);

const GameMode = computed(() => GameModes[selectedMode.value]);

function start() {
  emits("start", selectedMode.value);
}
</script>

<template>
  <header class="header">
    <fieldset>
      <select name="mode" id="mode" v-model="selectedMode">
        <template v-for="mode in modes" :key="mode">
          <option
            style="font-family: inherit, 'Inter', sans-serif; font-weight: 500"
            :value="mode"
          >
            {{ mode }}
          </option>
        </template>
      </select>
    </fieldset>
    <div class="counter">
      <div class="stat">
        <span>➡️</span>
        <span>{{ GameMode.size.width.toString().padStart(2, "0") }}</span>
      </div>
      <div class="stat">
        <span>⬇️</span>
        <span>{{ GameMode.size.height.toString().padStart(2, "0") }}</span>
      </div>
    </div>
    <button @click="start">▶️</button>
  </header>
  <PlayBoardPlaceholder
    :width="GameMode.size.width"
    :height="GameMode.size.height"
  />
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  button {
    background-color: rgb(45, 222, 124);
    aspect-ratio: 1;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 1px solid rgb(222, 222, 222);

    &:hover {
      background-color: rgb(28, 169, 58);
    }
  }
  fieldset {
    border: none;
    display: flex;
    select {
      height: 100%;
      background-color: white;
      border: 1px solid rgb(222, 222, 222);
      border-radius: 5px;
      padding: 5px;
      font-family: "Kode Mono", sans-serif;
      font-optical-sizing: auto;
      font-weight: 600;
      font-style: normal;
      cursor: pointer;
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
