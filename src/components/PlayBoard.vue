<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { cn } from "../utils";
import { IBoard, MinesweeperBoard } from "../core/gameBoard";
import StatsBoard from "./StatsBoard.vue";
import { useGameStore } from "../store/game.store";
import { storeToRefs } from "pinia";
import { TGameMode, GameModes } from "../core/gameModes";
import { BoardGameEvent } from "../lib/eventSub";

const props = defineProps<{
  mode: TGameMode;
}>();

const emits = defineEmits<{
  (e: "reset"): void;
}>();

const gameStore = useGameStore();
const { initializeSession, startGame, endGame, setMode, reset } = gameStore;
const { currentSession, highestScore } = storeToRefs(gameStore);

const gameMode = computed(() => props.mode);

const _minesweeper = ref<MinesweeperBoard>(new MinesweeperBoard());
const _board = ref<IBoard>();
const minesCount = ref(0);

const isAllRevealed = ref(false);

function handleGameOver(won: boolean) {
  return (stats: BoardGameEvent) => {
    const score =
      currentSession.value?.finish(true, stats.minesFlagged, stats.wrongFlags)
        .rawScore ?? 0;

    if (won === true) {
      hasWon.value = true;
      if (score === highestScore.value) {
        isHightestScore.value = true;
      }
    } else {
      hasLost.value = true;
    }
  };
}

function mountGame() {
  initializeSession();
  const _gameMode = GameModes[gameMode.value];

  _minesweeper.value.buildBoard(_gameMode.size, _gameMode.mineRate);
  _minesweeper.value.fillMines();
  _minesweeper.value.fillMineIndexes();

  _board.value = _minesweeper.value.getBoard();
  minesCount.value = _minesweeper.value.getMinesCount();
  _minesweeper.value.on("won", handleGameOver(true));
  _minesweeper.value.on("lost", handleGameOver(false));
}

onBeforeMount(() => {
  setMode(gameMode.value);
  mountGame();
});

const started = computed(() => {
  return currentSession.value?.isRunning() ?? false;
});

function start() {
  startGame(minesCount.value);
}

function getCellContent(index: string) {
  const cell = _minesweeper.value.getCell(index)!;
  if (isAllRevealed.value === true) {
    return cell.isFlagged
      ? "🚩"
      : cell.isMine
      ? "💣"
      : cell.mineIndex === 0
      ? ""
      : cell.mineIndex;
  }
  if (cell.isFlagged) {
    return "🚩";
  } else if (cell.isRevealed) {
    return cell.mineIndex === 0 ? "" : cell.mineIndex;
  } else {
    return "";
  }
}

function selectCell(index: string) {
  _minesweeper.value.selectCell(index);
  isAllRevealed.value = _minesweeper.value.isAllRevealed();
}

const flagCount = ref(0);

function flagCell(index: string) {
  const isFlagged = _minesweeper.value.flagCell(index);
  if (isFlagged) {
    flagCount.value++;
  } else {
    flagCount.value--;
  }
}

const hasWon = ref(false);
const hasLost = ref(false);
const isHightestScore = ref(false);

function restart() {
  endGame();
  hasWon.value = false;
  hasLost.value = false;
  isHightestScore.value = false;
  flagCount.value = 0;
  isAllRevealed.value = false;
  _minesweeper.value.reset();
  _minesweeper.value = new MinesweeperBoard();
  mountGame();
}

function resetGame() {
  currentSession.value?.finish(false, 0, 0);
  reset();
  hasWon.value = false;
  hasLost.value = false;
  isHightestScore.value = false;
  flagCount.value = 0;
  isAllRevealed.value = false;
  _minesweeper.value.reset();
  emits("reset");
}
</script>

<template>
  <StatsBoard
    :minesCount="minesCount"
    :flag-count="flagCount"
    @reset="resetGame"
  />
  <div class="board" @contextmenu.prevent="">
    <div v-if="hasWon" class="board-overlay">
      <button @click="restart"><span>You won!</span> 😎</button>
    </div>
    <div v-if="hasLost" class="board-overlay">
      <button @click="restart"><span>You Lost!</span> 😵</button>
    </div>
    <div v-if="!started && !hasWon && !hasLost" class="board-overlay">
      <button @click="start"><span>Start</span> 🚀</button>
    </div>
    <template v-for="{ cells } in _board?.rows" :key="'y'">
      <div class="row">
        <template v-for="cell in cells" :key="'x' + cell.index">
          <div
            :class="
              cn(
                'cell',
                { revealed: cell.isRevealed },
                { flagged: cell.isFlagged },
                {
                  empty:
                    cell.mineIndex === 0 &&
                    cell.isMine === false &&
                    cell.isRevealed,
                }
              )
            "
            @click="selectCell(cell.index)"
            @contextmenu.prevent="flagCell(cell.index)"
          >
            {{ getCellContent(cell.index) }}
          </div>
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
