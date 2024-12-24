import { BaseEventClass } from "../lib/eventSub";

export interface ICell {
  index: string;
  x: number;
  y: number;
  mineIndex: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
}

export interface IBoard {
  width: number;
  height: number;
  rows: { index: number; cells: ICell[] }[];
}

export interface IBoardSize {
  width: number;
  height: number;
}

export class MinesweeperBoard extends BaseEventClass {
  private _board!: IBoard;
  private _size!: IBoardSize;
  private _mineProbability!: number;
  private _allRevealed = false;
  private _gameOver = false;
  private _gameStarted = false;
  private _won = false;
  // board
  buildBoard(size: IBoardSize, mineProbability: number): void {
    this._size = size;
    this._mineProbability = mineProbability;
    this._board = {
      width: this._size.width,
      height: this._size.height,
      rows: Array.from({ length: this._size.height }, (_, i) => ({
        index: i,
        cells: Array.from({ length: this._size.width }, (_, j) => ({
          index: `${i}-${j}`,
          x: i,
          y: j,
          mineIndex: 0,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
        })),
      })),
    };
  }
  getBoard(): IBoard {
    return this._board;
  }
  getCell(index: string): ICell | undefined {
    return this._board.rows
      .flatMap((row) => row.cells)
      .find((cell) => cell.index === index);
  }
  selectCell(index: string): void {
    if (this._gameOver) return;
    const cell = this.getCell(index);
    if (cell) {
      if (cell.isRevealed) return;
      if (cell.isFlagged) return;
      cell.isRevealed = true;
      if (cell.isMine) {
        this.gameOver(false);
      } else {
        this.revealNeighbors(cell.x, cell.y);
      }
    }
    if (this.hasFinished()) {
      this.gameOver(true);
    }
  }
  hasFinished(): boolean | null {
    if (this._gameOver === true) return null;
    let finished = true;

    this._board.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.isRevealed === false && cell.isFlagged === false) {
          finished = false;
        }
      });
    });

    return finished;
  }
  // Mines
  fillMines(): void {
    for (let i = 0; i < this._size.height; i++) {
      for (let j = 0; j < this._size.width; j++) {
        this._board.rows[i].cells[j] = {
          ...this._board.rows[i].cells[j],
          isMine: Math.random() < this._mineProbability ? true : false,
        };
      }
    }
  }
  fillMineIndexes(): void {
    for (let i = 0; i < this._size.height; i++) {
      for (let j = 0; j < this._size.width; j++) {
        if (this._board.rows[i].cells[j].isMine === true) {
          continue;
        }
        let count = 0;
        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (
              k < 0 ||
              k >= this._size.height ||
              l < 0 ||
              l >= this._size.width
            ) {
              continue;
            }
            if (this._board.rows[k].cells[l].isMine === true) {
              count++;
            }
          }
        }
        if (count > 0) {
          this._board.rows[i].cells[j].mineIndex = count;
        }
      }
    }
  }
  getMinesCount(): number {
    return this._board.rows.reduce((acc, row) => {
      return acc + row.cells.filter((cell) => cell.isMine).length;
    }, 0);
  }
  // Revealing
  revealAll(): void {
    this._allRevealed = true;
    this._board.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.isFlagged === false) cell.isRevealed = true;
      });
    });
  }
  isAllRevealed(): boolean {
    return this._allRevealed;
  }
  revealNeighbors(_x: number, _y: number): void {
    for (let x = _x - 1; x <= _x + 1; x++) {
      for (let y = _y - 1; y <= _y + 1; y++) {
        if (x < 0 || x >= this._size.height || y < 0 || y >= this._size.width) {
          continue;
        }
        const cell = this.getCell(`${x}-${y}`);
        if (
          cell &&
          cell.isRevealed === false &&
          cell.isMine === false &&
          cell.isFlagged === false
        ) {
          cell.isRevealed = true;
          if (cell.mineIndex === 0) {
            this.revealNeighbors(x, y);
          }
        }
      }
    }
  }
  // Flags
  flagCell(index: string): boolean | null {
    if (this._gameOver) return null;
    const cell = this.getCell(index);
    if (cell) {
      cell.isFlagged = !cell.isFlagged;
    }

    if (this.hasFinished()) {
      this.gameOver(true);
    }

    return cell?.isFlagged ?? false;
  }
  getFlagsCount(): number {
    return this._board.rows.reduce((acc, row) => {
      return acc + row.cells.filter((cell) => cell.isFlagged === true).length;
    }, 0);
  }
  getFlaggedMinesCount(): number {
    return this._board.rows.reduce((acc, row) => {
      return (
        acc +
        row.cells.filter(
          (cell) => cell.isFlagged === true && cell.isMine === true
        ).length
      );
    }, 0);
  }
  getWrongFlagsCount(): number {
    return this._board.rows.reduce((acc, row) => {
      return (
        acc +
        row.cells.filter(
          (cell) => cell.isFlagged === true && cell.isMine === false
        ).length
      );
    }, 0);
  }
  // Game Status
  gameOver(win: boolean): void {
    this._gameOver = true;

    this.revealAll();

    const result = {
      minesFlagged: this.getFlaggedMinesCount(),
      wrongFlags: this.getWrongFlagsCount(),
    };

    if (win) {
      this._won = true;
      this.emit("won", result);
    } else {
      this.emit("lost", result);
    }
  }
  hasLost(): boolean {
    return (
      this._gameOver === true &&
      this._gameStarted === true &&
      this._won === false
    );
  }
  hasWon(): boolean {
    return (
      this._gameOver === true &&
      this._gameStarted === true &&
      this._won === true
    );
  }
}
