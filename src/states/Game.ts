import Enemy from '../prefabs/Enemy';

export class Game extends Phaser.State {
  private actionButton: Phaser.Button;
  private backgroundLayer: Phaser.TilemapLayer;
  private collisionLayer: Phaser.TilemapLayer;
  private currentLevel: string;
  private cursors: Phaser.CursorKeys;
  private enemies: Phaser.Group;
  private goal: Phaser.Sprite;
  private leftArrow: Phaser.Button;
  private map: Phaser.Tilemap;
  private player: Phaser.Sprite;
  private rightArrow: Phaser.Button;
  private readonly BOUNCING_SPEED = 150;
  private readonly JUMPING_SPEED = 500;
  private readonly RUNNING_SPEED = 180;

  public init(level: string) {
    this.currentLevel = level || 'level1';

    this.physics.arcade.gravity.y = 1000;
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  public create() {
    this.loadLevel();
    this.createOnScreenControls();
  }

  public update() {
    this.physics.arcade.collide(this.player, this.collisionLayer);
    this.physics.arcade.collide(this.enemies, this.collisionLayer);

    this.physics.arcade.collide(this.player, this.enemies, this.hitEnemy, undefined, this);

    this.physics.arcade.overlap(this.player, this.goal, this.changeLevel, undefined, this);

    (this.player.body as Phaser.Physics.Arcade.Body).velocity.x = 0;

    if (this.cursors.left.isDown || this.player.data.isMovingLeft) {
      (this.player.body as Phaser.Physics.Arcade.Body).velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    } else if (this.cursors.right.isDown || this.player.data.isMovingRight) {
      (this.player.body as Phaser.Physics.Arcade.Body).velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    if ((this.cursors.up.isDown || this.player.data.mustJump) &&
        (
          (this.player.body as Phaser.Physics.Arcade.Body).blocked.down ||
          (this.player.body as Phaser.Physics.Arcade.Body).touching.down
        )) {
      (this.player.body as Phaser.Physics.Arcade.Body).velocity.y = -this.JUMPING_SPEED;
      this.player.data.mustJump = false;
    }
  }

  private changeLevel(player: Phaser.Sprite, goal: Phaser.Sprite) {
    this.state.start('Game', true, false, (goal as any).nextLevel);
  }

  private createEnemies() {
    const enemyArr: any[] = this.findObjectsByType('enemy', this.map, 'objectsLayer');

    enemyArr.forEach((element: any) => {
      const enemy = new Enemy(this.game, element.x, element.y, 'slime', +element.properties.speed, this.map);
      this.enemies.add(enemy);
    });
  }

  private createOnScreenControls() {
    this.leftArrow = this.add.button(20, this.game.height - 60, 'arrowButton');
    this.rightArrow = this.add.button(110, this.game.height - 60, 'arrowButton');
    this.actionButton = this.add.button(this.game.width - 100, this.game.height - 60, 'actionButton');

    this.leftArrow.alpha = 0.5;
    this.rightArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;

    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    this.actionButton.events.onInputDown.add(() => {
      this.player.data.mustJump = true;
    }, this);

    this.actionButton.events.onInputUp.add(() => {
      this.player.data.mustJump = false;
    }, this);

    this.leftArrow.events.onInputDown.add(() => {
      this.player.data.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(() => {
      this.player.data.isMovingLeft = false;
    }, this);

    this.leftArrow.events.onInputOver.add(() => {
      this.player.data.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputOut.add(() => {
      this.player.data.isMovingLeft = false;
    }, this);

    this.rightArrow.events.onInputDown.add(() => {
      this.player.data.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputUp.add(() => {
      this.player.data.isMovingRight = false;
    }, this);

    this.rightArrow.events.onInputOver.add(() => {
      this.player.data.isMovingRight = true;
    }, this);

    this.rightArrow.events.onInputOut.add(() => {
      this.player.data.isMovingRight = false;
    }, this);
  }

  private findObjectsByType(targetType: string, tilemap: Phaser.Tilemap, layer: string) {
    const result: any[] = [];

    (tilemap.objects as any)[layer].forEach((element: any) => {
      if (element.properties.type === targetType) {
        element.y -= tilemap.tileHeight;
        result.push(element);
      }
    });

    return result;
  }

  private gameOver() {
    this.state.start('Game', true, false, this.currentLevel);
  }

  private hitEnemy(player: Phaser.Sprite, enemy: Phaser.Sprite) {
    if (enemy.body.touching.up) {
      enemy.kill();
      player.body.velocity.y = -this.BOUNCING_SPEED;
    } else {
      this.gameOver();
    }
  }

  private loadLevel() {
    this.map = this.add.tilemap(this.currentLevel);
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');

    this.world.sendToBack(this.backgroundLayer);

    this.map.setCollisionBetween(1, 160, true, 'collisionLayer');

    this.collisionLayer.resizeWorld();

    this.map.createFromObjects('objectsLayer', 148, 'goal');
    this.goal = this.world.getByName('goal');
    this.physics.arcade.enable(this.goal);
    (this.goal.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    this.map.createFromObjects('objectsLayer', 147, 'player');
    this.player = this.world.getByName('player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.enemies = this.add.group();
    this.createEnemies();
  }
}
