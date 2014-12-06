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
var sentence_fragments = {
    subjects: ['We', 'The company', 'Our organization', 'You', 'The competition', 'People'],
    verbs: ['will strive towards', 'obtained buy-in from', 'must monetize', 'shall synergize with', 'will strategize', 'might evangelize', 'tackled low hanging fruit', 'will follow up with', 'circle back on', 'hit the ground running with regards to', 'indeed escalate', 'reached out to', 'shall think out side of the box about', 'must innovate', 'ramped up', 'mustn\'t boil the ocean for', 'tried to circle the wagons of', 'must not', 'shall not', 'should not', 'dropped the ball, so'],
    objects: ['customer segments', 'business units', 'key performance metrics', 'stakeholders', 'return on investment', 'common painpoints', 'value-add', 'the long pole in the tent'],
    endings: ['.', '!', ', as it were.', ', if you will.', ' with all hands on deck.', ' solutions.', ', but let\'s take this offline.', ', but table that for now.', '. Is that on your radar?', ' in the weeds']
}
var map,
    background_layer,
    foreground_layer,
    whiteboard_layer,
    coffee_steam,
    player;

function generate_sentence() {
    var subject = sentence_fragments.subjects[Math.round(Math.random() * (sentence_fragments.subjects.length - 1))];
    var verb = sentence_fragments.verbs[Math.round(Math.random() * (sentence_fragments.verbs.length - 1))];
    var object = sentence_fragments.objects[Math.round(Math.random() * (sentence_fragments.objects.length - 1))];
    var ending = sentence_fragments.endings[Math.round(Math.random() * (sentence_fragments.endings.length - 1))];
    return subject+' '+verb+' '+object+ending;
}

function start_npc_dialog() {
    var dialog_style = {
        font: 'bold 10pt arial',
        fill: '#000',
        wordWrap: true,
        wordWrapWidth: '400'
    };
    var dialog = null;

    setInterval(function() {
        var sentence = generate_sentence();
        if (!!dialog) {game.world.remove(dialog);}
        dialog = game.add.text(400, 40, sentence, dialog_style);
    }, 5000);
}

function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('office-tiles', 'assets/office-tiles.png', 32, 32);
    game.load.image('coffee-tiles', 'assets/coffee.png', 32, 32);
    game.load.image('coffee-steam', 'assets/coffee-steam.png');

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
    map.addTilesetImage('coffee', 'coffee-tiles', 960, 640);

    background_layer = map.createLayer('Background');
    foreground_layer = map.createLayer('Foreground');
    whiteboard_layer = map.createLayer('Whiteboard');
    background_layer.resizeWorld();
    foreground_layer.resizeWorld();
    whiteboard_layer.resizeWorld();

    coffee_steam = game.add.emitter(491, 367, 1000);
    coffee_steam.makeParticles('coffee-steam');
    coffee_steam.setXSpeed(0, 0.1);
    coffee_steam.setYSpeed(0, 0);
    coffee_steam.setRotation(0, 10);
    coffee_steam.setAlpha(1, 0, 10000, Phaser.Easing.Quintic.Out);
    coffee_steam.setScale(0.1, 1, 0.1, 0.2, 0);
    coffee_steam.gravity = -5;
    coffee_steam.start(false, 4000, 5);

    var name_tag_style = {
        font: 'sans serif',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 5
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

    start_npc_dialog();
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
