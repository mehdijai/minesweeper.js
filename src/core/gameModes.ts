import { IBoardSize } from "./gameBoard";

export type TGameMode = "starter" | "beginner" | "intermediate" | "expert";

export interface GameMode {
  size: IBoardSize;
  mineRate: number;
  difficultyMultiplier: number;
}
export const GameModes: Record<TGameMode, GameMode> = {
  starter: {
    size: { height: 5, width: 10 },
    mineRate: 0.1,
    difficultyMultiplier: 1,
  },
  beginner: {
    size: { height: 9, width: 9 },
    mineRate: 0.1,
    difficultyMultiplier: 1,
  },
  intermediate: {
    size: { height: 16, width: 16 },
    mineRate: 0.1,
    difficultyMultiplier: 1.5,
  },
  expert: {
    size: { height: 16, width: 30 },
    mineRate: 0.3,
    difficultyMultiplier: 2,
  },
};
