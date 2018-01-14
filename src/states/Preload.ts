export class Preload extends Phaser.State {
  private preloadBar: Phaser.Sprite;

  public preload() {
    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('platform', 'images/platform.png');
    this.load.image('goal', 'images/goal.png');
    this.load.image('slime', 'images/slime.png');
    this.load.spritesheet('player', 'images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fly', 'images/fly_spritesheet.png', 35, 18, 2, 1, 2);
    this.load.image('arrowButton', 'images/arrowButton.png');
    this.load.image('actionButton', 'images/actionButton.png');

    this.load.image('gameTiles', 'images/tiles_spritesheet.png');
    this.load.tilemap('level1', 'levels/demo-level.json', null, Phaser.Tilemap.TILED_JSON);
  }

  public create() {
    this.state.start('Game');
  }
}
