<script setup lang="ts">
import { cn } from "../utils";

defineProps<{
  width: number;
  height: number;
}>();
</script>

<template>
  <div class="board" @contextmenu.prevent>
    <template v-for="x in height" :key="'y' + x">
      <div class="row">
        <template v-for="y in width" :key="'x' + y">
          <div :class="cn('cell')" @contextmenu.prevent></div>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.board {
  max-width: fit-content;
  background-color: white;
  border: 1px solid rgb(222, 222, 222);
  border-radius: 5px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  .board-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(#484848, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      border: none;
      background: white;
      color: rgb(202, 55, 55);
      font-weight: 700;
      font-size: 1rem;
      font-family: inherit;
      padding: 5px 8px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
      text-transform: uppercase;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      &:hover {
        background-color: rgb(222, 222, 222);
      }
    }
  }
  .row {
    width: fit-content;
    display: flex;
    gap: 2px;
    .cell {
      border: 1px solid #e4e4e4;
      background-color: #f1f1f1;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border-radius: 2px;
      transition: 0.2s ease-in-out;
      cursor: pointer;
      font-weight: 700;
      user-select: none;
      color: #ad1515;
      &:hover {
        background-color: #bbb;
      }
      &.revealed {
        background-color: white;
        &:hover {
          background-color: white;
        }
      }
      &.flagged {
        background-color: #d62a1716;
        &:hover {
          background-color: #8b1a0e16;
        }
      }
      &.empty {
        background-color: #dad9d9;
        &:hover {
          background-color: #dad9d9;
        }
      }
    }
  }
}
</style>
