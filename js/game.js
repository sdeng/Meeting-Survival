var game = new Phaser.Game(960, 960, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var human,
    map,
    background_layer;

function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('grass-tiles', 'assets/grass-tiles-2-small.png', 32, 32);
    game.load.image('human', 'assets/human.png', 32, 32);
    game.load.image('zombie', 'assets/zombie.png', 32, 32);
}


function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignvertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.skipQuadTree = false;

    map = game.add.tilemap('map');
    map.addTilesetImage('grass-tiles-2-small', 'grass-tiles', 960, 960);

    background_layer = map.createLayer('Background');
    background_layer.resizeWorld();

    zombies = game.add.group();
    zombies.enableBody = true;
    for (var i = 0; i < 50; i++) {
        var zombie = zombies.create(game.world.randomX, game.world.randomY, 'zombie');
        zombie.body.collideWorldBounds = true;
        zombie.body.bounce.set(1);
        zombie.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    human = game.add.sprite(game.world.centerX, game.world.centerY, 'human');
    human.anchor.set(0.5);
    game.physics.arcade.enable(human);
    human.body.collideWorldBounds = true;
    human.body.bounce.set(1);
}

function update() {
    game.physics.arcade.collide(human, zombies);

    var distance_to_move = game.physics.arcade.distanceToPointer(human, game.input.activePointer);
    if (distance_to_move > 12) {
        game.physics.arcade.moveToPointer(human, 300);
    } else {
        human.body.velocity.set(0);
    }
}
