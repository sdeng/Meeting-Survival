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
var dialog_style = {
    font: 'bold 10pt arial',
    fill: '#000',
    wordWrap: true,
    wordWrapWidth: '400'
};
var map,
    background_layer,
    foreground_layer,
    whiteboard_layer,
    dialog,
    coffee,
    coffee_steam,
    attention_span,
    attention_bar,
    sheep,
    player,
    sheep_collision_group,
    player_collision_group;

function render_map() {
    map = game.add.tilemap('map');
    map.addTilesetImage('office-tiles', 'office-tiles', 960, 640);

    background_layer = map.createLayer('Background');
    foreground_layer = map.createLayer('Foreground');
    whiteboard_layer = map.createLayer('Whiteboard');
    background_layer.resizeWorld();
    foreground_layer.resizeWorld();
    whiteboard_layer.resizeWorld();
}

function render_npcs() {
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
}

function render_player() {
    player = game.add.sprite(npc_data[0].position[0], npc_data[0].position[1], npc_data[0].name);
    player.anchor.set(0.5);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
}

function generate_sentence() {
    var subject = sentence_fragments.subjects[Math.round(Math.random() * (sentence_fragments.subjects.length - 1))];
    var verb = sentence_fragments.verbs[Math.round(Math.random() * (sentence_fragments.verbs.length - 1))];
    var object = sentence_fragments.objects[Math.round(Math.random() * (sentence_fragments.objects.length - 1))];
    var ending = sentence_fragments.endings[Math.round(Math.random() * (sentence_fragments.endings.length - 1))];
    return subject+' '+verb+' '+object+ending;
}

function business_speak() {
    var sentence = generate_sentence();
    if (!!dialog) {game.world.remove(dialog);}
    dialog = game.add.text(400, 40, sentence, dialog_style);

    zone_out();
}

function zone_out() {
    if (attention_span == 0) {return;}
    attention_span--;
}

function render_coffee() {
    coffee = game.add.button(480, 352, 'coffee', drink_coffee, this);
    coffee_steam = game.add.emitter(491, 367, 1000);
    coffee_steam.makeParticles('coffee-steam');
    coffee_steam.setXSpeed(0, 0.1);
    coffee_steam.setYSpeed(0, 0);
    coffee_steam.setRotation(0, 10);
    coffee_steam.setAlpha(1, 0, 10000, Phaser.Easing.Quintic.Out);
    coffee_steam.setScale(0.1, 1, 0.1, 0.2, 0);
    coffee_steam.gravity = -5;
    coffee_steam.start(false, 4000, 5);
}

function drink_coffee() {
    if (attention_span == 10) { return; }
    attention_span++;
}

function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('office-tiles', 'assets/office-tiles.png', 32, 32);
    game.load.image('coffee', 'assets/coffee.png');
    game.load.image('coffee-steam', 'assets/coffee-steam.png');
    game.load.image('sheep', 'assets/sheep.png');

    for (var i=0; i<npc_data.length; i++) {
        var name = npc_data[i].name;
        game.load.image(name, 'assets/'+name+'.png', 32, 32);
    }
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignvertically = true;
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 1;

    render_map();
    render_npcs();
    render_player();
    render_coffee();

    attention_span = 10;
    game.add.text(10, 50, 'Attention Span', {
        font: 'bold 10pt arial',
        fill: '#f00',
        stroke: '#fff',
        strokeThickness: 5
    });
    game.time.events.loop(2000, business_speak, this);

    player_collision_group = game.physics.p2.createCollisionGroup();
    sheep_collision_group = game.physics.p2.createCollisionGroup();
    sheep = game.add.group();
    sheep.enableBody = true;
    sheep.physicsBodyType = Phaser.Physics.P2JS;
}

function update_attention_bar() {
    if (!!attention_bar) {
        game.world.remove(attention_bar);
    }
    attention_bar = game.add.graphics(10, 83);
    attention_bar.lineStyle(30, 0xff0000, 0.75);
    attention_bar.moveTo(0, 0);
    attention_bar.lineTo(attention_span * 30, 0);
}

function update_sheep() {
    var attention_deficit = 10 - attention_span;
    var num_sheep = attention_deficit;

    if (num_sheep > sheep.length) {
        var a_sheep = sheep.create(game.world.randomX, game.world.randomY, 'sheep');
        a_sheep.body.setRectangle(50, 50);
        a_sheep.body.setCollisionGroup(sheep_collision_group);
        a_sheep.body.collides([sheep_collision_group]);
        a_sheep.scale.x = 2.5;
        a_sheep.scale.y = 2.5;
        a_sheep.body.velocity.x = Math.random() * 2000;
        a_sheep.body.velocity.y = Math.random() * 2000;
    } else if (num_sheep < sheep.length) {
        var a_sheep = sheep.removeChildAt(0);
        game.world.remove(a_sheep);
    }
}

function update() {
    update_attention_bar();
    update_sheep();

    /*
    var distance_to_move = game.physics.arcade.distanceToPointer(player, game.input.activePointer);
    if (distance_to_move > 12) {
        game.physics.arcade.moveToPointer(player, 300);
    } else {
        player.body.velocity.set(0);
    }
    */
}
