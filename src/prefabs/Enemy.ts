export default class Enemy extends Phaser.Sprite {
  private tilemap: Phaser.Tilemap;

  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    key: string,
    velocity: number | undefined,
    tilemap: Phaser.Tilemap,
  ) {
    super(game, x, y, key);

    this.tilemap = tilemap;
    this.anchor.setTo(0.5);

    if (velocity === undefined) {
      velocity = (40 + Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1);
    }

    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1, 0);
    this.body.velocity.x = velocity;
  }

  public update() {
    let direction: number;

    if (this.body.velocity.x > 0) {
      this.scale.setTo(-1, 1);
      direction = 1;
    } else {
      this.scale.setTo(1, 1);
      direction = -1;
    }

    const nextX = this.x + direction * (Math.abs(this.width) / 2 + 1);
    const nextY = this.bottom + 1;

    const nextTile = this.tilemap.getTileWorldXY(nextX, nextY,
      this.tilemap.tileWidth, this.tilemap.tileHeight, 'collisionLayer');

    if (!nextTile && this.body.blocked.down) {
      this.body.velocity.x *= -1;
    }
  }
}
