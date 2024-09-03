import Phaser from 'phaser';
import { Paddle } from '../entities/Paddle';
import { Ball } from '../entities/Ball';
import { Brick } from '../entities/Brick';
import { WallBrick } from '../entities/WallBrick';
import { Bomb } from '../entities/Bomb'; 
import { BombScene } from '../entities/BombScene';

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.balls = null; // Grupo de pelotas
    this.paddle = null;
    this.wall = null;
    this.bombs = null; // Grupo de bombas
    this.blockCount = 0;
    this.victoryCount = 0;
    this.maxBalls = 3; // Máximo de pelotas permitidas
    this.score = 0; // Puntaje inicial
    this.scoreText = null; // Texto de puntaje
  }

  create() {
    // Inicializa el grupo de bombas
    this.bombs = this.add.group({
      classType: Bomb,
      runChildUpdate: true
    });

    // Crear el grupo de pelotas y añadir la pelota inicial
    this.balls = this.add.group({
      classType: Ball,
      runChildUpdate: true
    });

    let initialBall = this.balls.get(400, 300, 10, 0xffffff, 1);
    initialBall.setSpeed(200); // Velocidad inicial de la pelota
    this.physics.add.collider(initialBall, this.paddle);
    initialBall.on('touchfloor', () => this.handleBallTouchFloor(initialBall)); // Añadir evento al tocar el suelo

    this.paddle = new Paddle(this, 400, 550, 300, 20, 0xffffff, 1);
    this.wall = new WallBrick(this);

    // Añadir colisión entre la paleta y las pelotas
    this.physics.add.collider(this.paddle, this.balls);

    // Añadir colisión entre las pelotas y los ladrillos
    this.physics.add.collider(
      this.balls,
      this.wall,
      (ball, brick) => {
        brick.hit();

        if (brick.isBallCreator) {
          this.duplicateBall(ball);
        }

        if (brick.isBombCreator) {
          this.createBombFromBrick(brick); // Crea una bomba cuando un ladrillo creador de bombas es golpeado
        }

        this.blockCount--;
        this.updateScore(); // Actualiza el puntaje

        if (this.blockCount <= 0) {
          this.victoryCount++;
          this.restartGame();
        }
      },
      null,
      this
    );

    // Evento para detectar cuando una pelota toca el borde inferior del mundo
    this.physics.world.on('worldbounds', (body, up, down) => {
      if (down) {
        // Verifica si el objeto es una pelota y toca el borde inferior
        const ball = body.gameObject;
        if (this.balls.contains(ball)) {
          this.handleBallTouchFloor(ball);
        }
      }
    });

    // Configuración del texto de puntaje
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff'
    });
  }

  update() {
    this.paddle.update();
    this.balls.getChildren().forEach(ball => ball.update()); // Actualiza las pelotas
    this.bombs.getChildren().forEach(bomb => bomb.update()); // Actualiza las bombas
  }

  createNewBall() {
    // Solo crea una nueva pelota si el número total de pelotas es menor que el máximo permitido
    if (this.balls.getLength() < this.maxBalls) {
      let newBall = this.balls.get(400, 300, 10, 0xffffff, 1);
      newBall.setSpeed(200);
      this.physics.add.collider(newBall, this.paddle);
      newBall.on('touchfloor', () => this.handleBallTouchFloor(newBall));
    }
  }

  duplicateBall(originalBall) {
    // Solo duplica la pelota si el número total de pelotas es menor que el máximo permitido
    if (this.balls.getLength() < this.maxBalls) {
      let newBall = this.balls.get(originalBall.x, originalBall.y, 10, 0xffffff, 1);
      newBall.setSpeed(originalBall.body.velocity.x); // Mantén la misma dirección
      this.physics.add.collider(newBall, this.paddle);
      newBall.on('touchfloor', () => this.handleBallTouchFloor(newBall));
    }
  }

  handleBallTouchFloor(ball) {
    if (ball) {
      this.balls.remove(ball, true, true); // Elimina la pelota del grupo y destruye el objeto
    }

    if (this.balls.getLength() === 0) {
      this.handleGameOver(); // Si no quedan pelotas, activa el Game Over
    }
  }

  handleGameOver() {
    this.scene.start("GameOver", { victoryCount: this.victoryCount });
  }

  updateScore() {
    this.score += 10; // Incrementa el puntaje por cada bloque roto
    this.scoreText.setText(`Score: ${this.score}`); // Actualiza el texto de puntaje
  }

  restartGame() {
    this.balls.getChildren().forEach(ball => {
      ball.reset();
      ball.setSpeed(200 + (0.1 * this.victoryCount * 200)); // Ajustar velocidad en función de las victorias
    });
    this.wall.reset(); // Resetea los bloques
    this.blockCount = this.wall.getBrickCount();
    this.score = 0; // Reinicia el puntaje
    this.updateScore(); // Actualiza el texto de puntaje
  }

  createBombFromBrick(brick) {
    // Llama a la función para crear una bomba desde el ladrillo
    this.scene.launch('BombScene'); // Asegúrate de iniciar la escena de bombas
    this.scene.get('BombScene').createBomb(brick.x, brick.y); // Crea la bomba en la posición del ladrillo
  }
}
