import mitt, { Emitter } from "mitt";

export type BoardGameEvent = { minesFlagged: number; wrongFlags: number };

type Events = {
  timeTick: number;
  won: BoardGameEvent;
  lost: BoardGameEvent;
  gameOver: { won: boolean; score: number };
};

export class BaseEventClass {
  protected emitter: Emitter<Events>;

  constructor() {
    this.emitter = mitt<Events>();
  }

  // Method to add event listeners
  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    this.emitter.on(event, handler);
  }

  // Method to remove event listeners
  off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    this.emitter.off(event, handler);
  }

  // Method to emit events
  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.emitter.emit(event, payload);
  }

  // Reset method to clear all listeners and reinitialize
  reset() {
    // Clear all existing listeners
    this.emitter.all.clear();

    // Reinitialize the emitter
    this.emitter = mitt<Events>();
  }
}
