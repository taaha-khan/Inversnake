# Inversnake

## Overview
This game is a twist on the classic 'Snake Game' where the player controls a snake to eat apples and grow. In Inversnake, the player is now the apple, and must run away and trick a hungry AI snake! Use the WASD keys to move around, and the spacebar to pause. Try not to get trapped! - TaahaKhan.com

## Controls
- WASD or arrow keys for movement
- Spacebar to pause
- Debug mode

## Difficulty Levels
- **Easy:** Snake will move towards player, and is possible to tangle and kill. Speed will be slowed and constant
- **Medium:** Snake will move quickly towards player, and is still possible to kill. Speed will increase each time the food is eaten
- **Impossible:** Snake will move quickly in the fastest perfect calculated route. It is unkillable, and will speed up more as the food is eaten.

## Algorithm Overviews
- **Easy and Medium:** Use a standard direct path movement algorithm, which picks one of the 3 moves at each step which minimizes the euclidean distance between the head and the food. It can easily be tricked with one-holes, corridors, and looping in on itself.
- **Impossible:** Uses an advanced pathfinding algorithm based on the structure of a Hamiltonian cycle generated randomly using an Prim MST. The cycle is used as a basis for which the pathfinder makes shortcuts to decrease the steps to make in order to get to the food. It is impossible to kill in a run, and will always completely fill the board when allowed to run for long enough. It will not go directly towards the apple, but may take large or seemingly unintelligent detours to make certain that it will survive all situations.

## Technical facts
Was originally programmed in Python using the Turtle TKinter framework, but was then refactored and ported to HTML5.
Reprogrammed in JavaScript using the [p5.js](https://p5js.org/) framework for HTML5 canvas games.
Concept was made in 2019, but was only completely implemented in 2021.
