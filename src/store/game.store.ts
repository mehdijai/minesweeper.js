import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GameSession, GameSessionData } from "../core/gameSession";
import { TGameMode } from "../core/gameModes";

export const useGameStore = defineStore(
  "minesweeper-core",
  () => {
    const sessions = ref<GameSessionData[]>([]);
    const currentSession = ref<GameSession | null>(null);
    const mode = ref<TGameMode>("beginner");
    const timeTick = ref(0);

    const isRunning = computed(
      () => currentSession.value?.isRunning() ?? false
    );

    function setMode(_mode: TGameMode) {
      if (isRunning.value === true) return;
      mode.value = _mode;
    }

    function reset() {
      timeTick.value = 0;
      currentSession.value?.reset();
      currentSession.value = null;
    }

    const highestScore = computed<number>(() => {
      if (sessions.value.length === 0) {
        return 0;
      }
      return Math.max(
        ...sessions.value.map((session) => session.score.rawScore)
      );
    });

    function endGame() {
      if (currentSession.value) {
        sessions.value.push(currentSession.value.getData());
        reset();
      }
    }

    function initializeSession() {
      currentSession.value = new GameSession(mode.value);
    }

    function startGame(minesCount: number) {
      currentSession.value?.start(minesCount);
      currentSession.value?.on("timeTick", (time: number) => {
        timeTick.value = time;
      });
    }

    return {
      sessions,
      currentSession,
      highestScore,
      timeTick,
      endGame,
      initializeSession,
      startGame,
      setMode,
      reset,
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: ["sessions", "highestScore"],
    },
  }
);
