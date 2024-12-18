import { IBoardSize } from "./gameBoard";

export type TGameMode = "beginner" | "intermediate" | "expert";

export interface GameMode {
  size: IBoardSize;
  mineRate: number;
  difficultyMultiplier: number;
}
export const GameModes: Record<TGameMode, GameMode> = {
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
