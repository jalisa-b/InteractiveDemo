var demo = {};
demo.state1 = function() {};
demo.state1.prototype = {
  preload: function(){
    game.load.image('background', 'assets/brown background.png');
    game.load.image('ground', 'assets/brick landing platform.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('cat', 'assets/cat character running.png', 32, 42)
  },
  create: function(){
      console.log('state1');
      // add cursors
      cursors = game.input.keyboard.createCursorKeys();

      // add physics to game
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // background
      game.add.sprite(0, 0, 'background')

      // platforms group
      platforms = game.add.group();

      // enable physics for any object in this group
      platforms.enableBody = true;

      // create ground
      var ground = platforms.create(0, game.world.height - 64, 'ground');

      // scale to fit width of game
      ground.scale.setTo(2, 2);

      // stop from falling away when jumped on
      ground.body.immovable = true;

      // 2 ledges
      var ledge = platforms.create(400, 400, 'ground');

      ledge.body.immovable = true;

      ledge = platforms.create(-150, 250, 'ground');

      ledge.body.immovable = true;

      // the player and its settings
      player = game.add.sprite(32, game.world.height - 150, 'cat');

      // enable physics for player
      game.physics.arcade.enable(player);

      // player physics properties, gives bounce
      player.body.bounce.y = 0.2;
      player.body.gravity.y = 350;
      player.body.collideWorldBounds = true;

      // our two animations, walking left and right
      player.animations.add('left', [1, 2, 3, 4], 10, true);
      player.animations.add('right', [5, 6, 7, 8], 10, true);
    
      diamonds = game.add.group();

      diamonds.enableBody = true;

      // create 12 evenly spaced diamonds
      for (var i = 0; i < 10; i++) {

        // create diamond in diamonds groups
        var diamond  = diamonds.create(i * 70, 0, 'diamond');

        // gravity
        diamond.body.gravity.y = 400;

        // gives each diamond slightly different bounce value
        diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
      }

      // create score display
      scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });		
      },
  update: function(){
      // collide the player with platforms
      var hitPlatforms = game.physics.arcade.collide(player, platforms);
          
      // reset players velocity (movement)
      player.body.velocity.x = 0;

      if (cursors.left.isDown) {

        // move left
        player.body.velocity.x = -150;

        player.animations.play('left');
      }
      else if (cursors.right.isDown) {

        // move right
        player.body.velocity.x = 150;

        player.animations.play('right');
      }
      else {

        // stand still
        player.animations.stop();

        player.frame = 0;
      }

      // allow player to jump if they are touching the ground
      if (cursors.up.isDown && player.body.touching.down && hitPlatforms) {
        player.body.velocity.y = -350;
      }

      // check collision of diamonds and platforms
      game.physics.arcade.collide(diamonds, platforms)

      // check if player overlaps diamond
      game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

      // change scene
      if (score === 100) {
        game.state.start('state2');
      }
  }
}

var platforms;
var player;
var cursors;
var diamonds;
var score = 0;
var scoreText;

function collectDiamond(player, diamond) {

  // remove diamond from screen
  diamond.kill();

  // add and update score
  score += 10;
  scoreText.text = 'Score: ' + score;
}