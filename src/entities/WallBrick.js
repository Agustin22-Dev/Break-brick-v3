// WallBrick.js
import Phaser from 'phaser';
import { Brick } from './Brick';

export class WallBrick extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    this.createWall();
  }

  createWall() {
    this.clear(true, true); // Limpia cualquier objeto existente en el grupo

    this.blockCount = 0;

    // Ejemplo de cómo agregar ladrillos a la pared
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        let brick = new Brick(this.scene, j * 60 + 50, i * 30 + 50, 50, 20, 0x00ff00, 1, Math.random() < 0.2);
        this.add(brick);
        this.blockCount++;
      }
    }

    this.updateBrickCount();
  }

  updateBrickCount() {
    this.blockCount = this.getLength();
  }

  reset() {
    this.createWall(); // Vuelve a crear los bloques
  }

  getBrickCount() {
    return this.blockCount;
  }
}

