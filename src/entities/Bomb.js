import Phaser from 'phaser';

export class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null); // Usamos `null` porque no estamos usando un sprite de imagen

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Establecer dimensiones del bloque de la bomba
    this.setSize(50, 50); // Ajusta el tamaño según sea necesario
    this.setTint(0xff0000); // Color rojo

    this.setGravityY(300); // Configura la gravedad para la bomba
  }

  update() {
    // Lógica de actualización para la bomba si es necesario
  }
}
