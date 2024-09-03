// Brick.js
import Phaser from 'phaser';

export class Brick extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, alpha, isBallCreator = false) {
    super(scene, x, y, width, height, color, alpha);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.isBallCreator = isBallCreator; // Marca el ladrillo como creador de pelotas
  }

  hit() {
    this.setAlpha(0.5); // Ejemplo: cambiar la transparencia del ladrillo al ser golpeado
    this.body.setEnable(false); // Desactiva la física para que el ladrillo no se pueda mover
  }
}

