# Inversnake

![](https://user-images.githubusercontent.com/61217792/143797410-1a74a635-4019-46f5-88ee-57059128ebab.png)

## Overview
This game is a twist on the classic 'Snake Game'. In InverSnake, the player controls the apple, and must move it around to trap the hungry AI snake into a knot! With three difficulty levels, see how many times you can trap the snake, and how long you can survive. Try not to get eaten!\n\n\t - TaahaKhan.com

## Controls
- WASD or arrow keys for movement
- Spacebar to pause
- Secret debug mode

## Difficulty Levels
- **Easy:** Snake will move towards player, and is possible to tangle and kill. Speed will be slowed and constant
- **Hard:** Snake will move quickly in the direction to cut off and block the player, and is still possible to kill. Speed will increase each time the food is eaten
- **Impossible:** Snake will move quickly in the fastest perfect calculated route. It is unkillable, and will speed up more as the food is eaten.

![](https://user-images.githubusercontent.com/61217792/143797473-f4c08448-03a2-4c0c-ac36-b09368cca7c0.png)

## Algorithm Overviews
- **Easy:** Use a standard direct path movement algorithm, which picks one of the 3 moves at each step which minimizes the euclidean distance between the head and the food. It can easily be tricked with one-holes, corridors, and looping in on itself.
- **Hard:** Moves in one of the fastest paths towards the food, acts to cut off the food from the left, then the top to corner the food into the bottom-right. Can be tricked with corridors and confined spaces near walls.
- **Impossible:** Uses an advanced pathfinding algorithm based on the structure of a Hamiltonian cycle generated randomly using an Prim MST. The cycle is used as a basis for which the pathfinder makes shortcuts to decrease the steps to make in order to get to the food. It is impossible to kill in a run, and will always completely fill the board when allowed to run for long enough. It will not go directly towards the apple, but may take large or seemingly unintelligent detours to make certain that it will survive all situations.

## Technical facts
Was originally programmed in Python using the Turtle TKinter framework, but was then refactored and ported to HTML5.
Reprogrammed in JavaScript using the [p5.js](https://p5js.org/) framework for HTML5 canvas games.
Concept was made in 2019, but was only completely implemented in 2021.
