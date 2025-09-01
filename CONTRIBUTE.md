# Contribution Guidelines

Welcome to the Phaser Ping-Pong Game codebase! This document outlines important architectural decisions and best practices for contributing, with a focus on the object pooling system.

---

## Object Pooling

### Why Object Pooling?

Object pooling is used in this project to optimize performance and memory usage for frequently created and destroyed game objects, such as visual effects. Instead of creating and destroying objects every time, we reuse inactive ones from a pool.

### Where is it used?

- **Rectangle Burst Effect:**
  When the ball hits a paddle, a burst of rectangles is shown using a pooled set of Phaser rectangle objects.
- **File:**
  - `ObjectPool.js` (utility)
  - `scenes/GameScene.js` (usage example)

### How to Use the ObjectPool

1. **Import the Pool:**
   ```js
   import ObjectPool from '../ObjectPool.js';
