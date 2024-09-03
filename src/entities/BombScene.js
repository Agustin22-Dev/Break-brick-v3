import Phaser from 'phaser';
import { Bomb } from './Bomb'; // Importa la clase Bomb

export class BombScene extends Phaser.Scene {
  constructor() {
    super('BombScene');
  }

  create() {
    // Crear un grupo de bombas vacío
    this.bombs = this.add.group({
      classType: Bomb,
      runChildUpdate: true
    });

    // Configurar la colisión entre bombas y la paleta
    this.physics.add.collider(this.bombs, this.paddle, () => {
      this.handleGameOver(); // Maneja la derrota cuando una bomba toca la paleta
    });
  }

  createBomb(x, y) {
    const bomb = this.bombs.get(x, y); // Crear una nueva bomba en la posición dada

    if (bomb) {
      bomb.setActive(true).setVisible(true);
      bomb.body.setGravityY(300); // Configura la gravedad para que la bomba caiga

      // Configura la colisión de la bomba con la paleta
      this.physics.add.collider(bomb, this.paddle, () => {
        this.handleGameOver(); // Maneja la derrota cuando una bomba toca la paleta
      });
    }
  }

  handleGameOver() {
    this.scene.start("GameOver"); // Cambia a la escena de Game Over
  }
}

