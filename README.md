# Minesweeper.js

Minesweeper.JS game using TypeScript OOP and VueJS interactivity and Pinia State Management. The project is still in progress, there is still things to optimize and refactor.

## Demo

[https://minesweeper-js-one.vercel.app](Demo)

## Core

the core directory holds the classes for the core logic of Game Board interactions, Game Session handlers and Game mode settings.

## Start

The game starts with a simple interface to select the mode:

- Beginner => 9x9
- Intermediate => 16x16
- Expert => 30x16

## Score

The score is calculated in`gameSession.ts => _calculateMinesweeperScore` function. It's based on time, flagged mines and wrong flags. with a difficulty multiplier based on mode (configured in game mode file).

## State

the Pinia state manager handles the current session and persist the sessions in local storage to get the best score.
