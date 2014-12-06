var game = new Phaser.Game(960, 960, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var npcs = [];
var npc_data = [
    {
        name: 'player',
        position: [530, 355]
    }, {
        name: 'ceo',
        position: [320, 145]
    }, {
        name: 'analyst',
        position: [320, 210]
    }, {
        name: 'marketing',
        position: [320, 275]
    }, {
        name: 'snowman',
        position: [320, 338]
    }, {
        name: 'scientist',
        position: [320, 400]
    }, {
        name: 'neckbeard',
        position: [320, 465]
    }, {
        name: 'designer',
        position: [513, 145]
    }, {
        name: 'robot',
        position: [512, 210]
    }, {
        name: 'horse',
        position: [512, 400]
    }, {
        name: 'manager',
        position: [370, 70]
    }
];
var map,
    background_layer,
    player;

function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('office-tiles', 'assets/office-tiles.png', 32, 32);

    for (var i=0; i<npc_data.length; i++) {
        var name = npc_data[i].name;
        game.load.image(name, 'assets/'+name+'.png', 32, 32);
    }
}


function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignvertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.skipQuadTree = false;

    map = game.add.tilemap('map');
    map.addTilesetImage('office-tiles', 'office-tiles', 960, 640);

    background_layer = map.createLayer('Background');
    background_layer.resizeWorld();

    var name_tag_style = {
        font: 'sans serif',
        fill: '#fff'
    };

    for (var i=1; i<npc_data.length; i++) {
        var name = npc_data[i].name;
        var x = npc_data[i].position[0];
        var y = npc_data[i].position[1];
        var npc = game.add.sprite(x, y, name);
        game.add.text(x, y+30, name, name_tag_style);
        game.physics.arcade.enable(npc);
        npc.body.collideWorldBounds = true;
        npcs.push(npc);
    }

    player = game.add.sprite(npc_data[0].position[0], npc_data[0].position[1], npc_data[0].name);
    player.anchor.set(0.5);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
}

function update() {
    /*
    var distance_to_move = game.physics.arcade.distanceToPointer(player, game.input.activePointer);
    if (distance_to_move > 12) {
        game.physics.arcade.moveToPointer(player, 300);
    } else {
        player.body.velocity.set(0);
    }
    */
}
