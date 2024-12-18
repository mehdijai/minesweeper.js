import { ulid } from "ulid";
import { GameModes, TGameMode } from "./gameModes";
import { BaseEventClass } from "../lib/eventSub";

export interface IScore {
  rawScore: number;
  details: {
    baseScore: number;
    timePenalty: number;
    flagBonus: number;
    difficultyMultiplier: number;
  };
}
export interface GameSessionData {
  id: string;
  score: IScore;
  elapsedTime: number;
  date: Date;
  mode: TGameMode;
  mines: number;
  minesFlagged: number;
  won: boolean;
}

export class GameSession extends BaseEventClass {
  private _id: string;
  private _started: boolean = false;
  private _finished: boolean = false;
  private _score!: IScore;
  private _elapsedTime: number = 0;
  private _timer: number | null = null;
  private _mode: TGameMode;
  private _won: boolean = false;
  private _mines: number = 0;
  private _minesFlagged: number = 0;
  private _wrongFlags: number = 0;

  constructor(mode: TGameMode) {
    super();
    this._id = ulid();
    this._mode = mode;
  }

  start(mines: number): void {
    this._mines = mines;
    this._started = true;
    this._elapsedTime = 0;
    this._timer = null;
    this.emit("timeTick", 0);
    this._startTimer();
  }

  finish(won: boolean, minesFlagged: number, wrongFlags: number): IScore {
    this._finished = true;
    this._wrongFlags = wrongFlags;
    this._minesFlagged = minesFlagged;
    this._won = won;
    this._stopTimer();

    const score = this._calculateMinesweeperScore(
      GameModes[this._mode].difficultyMultiplier
    );

    this._score = score;

    return score;
  }

  isRunning(): boolean {
    return this._started === true && this._finished === false;
  }

  getData(): GameSessionData {
    return {
      id: this._id,
      score: this._score,
      elapsedTime: this._elapsedTime,
      date: new Date(),
      won: this._won,
      mode: this._mode,
      mines: this._mines,
      minesFlagged: this._minesFlagged,
    };
  }

  private _startTimer(): void {
    this._timer = setInterval(() => {
      this._elapsedTime++;
      this.emit("timeTick", this._elapsedTime);
    }, 1000);
  }

  private _stopTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  private _calculateMinesweeperScore(difficulty = 1): IScore {
    const BASE_SCORE = 1000;
    const TIME_PENALTY_FACTOR = 5;
    const WRONG_FLAG_PENALTY = 50;
    const CORRECT_FLAG_BONUS = 20;

    const timePenalty = Math.max(0, this._elapsedTime * TIME_PENALTY_FACTOR);

    const flagScore =
      this._minesFlagged * CORRECT_FLAG_BONUS -
      this._wrongFlags * WRONG_FLAG_PENALTY;

    let finalScore = Math.max(
      0,
      BASE_SCORE * difficulty - timePenalty + flagScore
    );

    return {
      rawScore: Math.round(finalScore),
      details: {
        baseScore: BASE_SCORE * difficulty,
        timePenalty,
        flagBonus: flagScore,
        difficultyMultiplier: difficulty,
      },
    };
  }
}
