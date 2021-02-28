var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('state1', demo.state1);
game.state.add('state2', demo.state2)
game.state.start('state1');