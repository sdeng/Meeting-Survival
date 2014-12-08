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
    }, {
        name: 'hodor',
        position: [512, 465]
    }
];
var sentence_fragments = {
    subjects: ['We', 'The company', 'Our organization', 'You', 'The competition', 'People'],
    verbs: ['will strive towards', 'obtained buy-in from', 'must monetize', 'shall synergize with', 'will strategize', 'might evangelize', 'tackled low hanging fruit', 'will follow up with', 'circle back on', 'hit the ground running with regards to', 'indeed escalate', 'reached out to', 'shall think out side of the box about', 'must innovate', 'ramped up', 'mustn\'t boil the ocean for', 'tried to circle the wagons of', 'must not', 'shall not', 'should not', 'really dropped the ball on'],
    objects: ['customer segments', 'business units', 'key performance metrics', 'stakeholders', 'return on investment', 'common painpoints', 'value-add', 'the long pole in the tent'],
    endings: ['.', '!', ', as it were.', ', if you will.', ' with all hands on deck.', ' solutions.', ', but let\'s take this offline.', ', but table that for now.', '. Is that on your radar?', ' in the weeds']
}
var dialog_style = {
    font: 'bold 10pt arial',
    fill: '#888',
    wordWrap: true,
    wordWrapWidth: '400'
};
var COLD = 0;
var HOT = 1;
var map,
    background_layer,
    foreground_layer,
    whiteboard_layer,
    dialog,
    burritos,
    coffee,
    coffee_steam,
    business_loop,
    fart,
    fart_timer,
    fart_delay,
    fart_duration,
    fart_sensitive_group,
    attention_span,
    attention_threshold,
    snowman_melted,
    robot_shorted,
    sheep,
    player,
    quorum,
    quorum_indicator,
    thermometer,
    temperature,
    melt_timer,
    sheep_collision_group,
    player_collision_group;

function render_map() {
    map = game.add.tilemap('map');
    map.addTilesetImage('office-tiles', 'office-tiles', 960, 640);

    background_layer = map.createLayer('Background');
    foreground_layer = map.createLayer('Foreground');
    whiteboard_layer = map.createLayer('Whiteboard');
    map.setCollisionBetween(1, 100000, true, 'Foreground');
    background_layer.resizeWorld();
    foreground_layer.resizeWorld();
    whiteboard_layer.resizeWorld();
}

function render_npcs() {
    var name,
        x,
        y,
        npc;
    var name_tag_style = {
        font: 'sans serif',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 5
    };

    for (var i=1; i<npc_data.length; i++) {
        name = npc_data[i].name;
        x = npc_data[i].position[0];
        y = npc_data[i].position[1];
        npc = game.add.sprite(x, y, name);
        game.physics.enable(npc, Phaser.Physics.ARCADE);
        npc.label = game.add.text(x, y+30, name, name_tag_style);
        npc.animations.add('idle');
        npc.animations.play('idle', 1, true);
        npcs.push(npc);
    }

    fart_sensitive_group = game.add.group();
    fart_sensitive_group.add(npcs[0]);
    fart_sensitive_group.add(npcs[1]);
    fart_sensitive_group.add(npcs[2]);
    fart_sensitive_group.add(npcs[6]);
    fart_sensitive_group.add(npcs[9]);
}

function render_player() {
    player = game.add.sprite(npc_data[0].position[0], npc_data[0].position[1], npc_data[0].name);
    player.animations.add('idle');
    player.animations.play('idle', 1, true);
    game.physics.arcade.enable(player, false);
    player.body.collideWorldBounds = true;
}

function render_burritos() {
    fart_delay = 3000;
    fart_duration = 0;
    burritos = [];

    for (var i=0; i<4; i++) {
        var burrito = game.add.button(0, 420 + (i * 40), 'burrito', eat_burrito, this);
        game.physics.arcade.enable(burrito, false);
        burritos.push(burrito);
    }
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
    game.physics.arcade.enable(coffee, false);

    coffee_steam = game.add.emitter(491, 367, 1000);
    coffee_steam.makeParticles('coffee-steam', 0, 1000, true, true);
    coffee_steam.setXSpeed(0, 0.1);
    coffee_steam.setYSpeed(0, 0);
    coffee_steam.setRotation(0, 10);
    coffee_steam.setAlpha(1, 0, 10000, Phaser.Easing.Quintic.Out);
    coffee_steam.setScale(0.1, 1, 0.1, 0.2, 0);
    coffee_steam.gravity = -5;
    coffee_steam.start(false, 4000, 5);
}

function render_thermometer() {
    thermometer = game.add.button(10, 350, 'thermometer', toggle_temperature, this);
    game.physics.arcade.enable(thermometer, false);
}


function render_hack() {
    hack = game.add.button(542, 195, 'hack', short_circuit_robot, this);
    game.physics.arcade.enable(hack, false);
}

function short_circuit_robot() {
    if (!!robot_shorted) {return;}

    var robot_short_circuiting = game.add.sprite(npcs[7].x, npcs[7].y, 'robot-short-circuiting');
    robot_short_circuiting.animations.add('death');
    robot_short_circuiting.play('death', 5, false);
    robot_shorted = true;
    game.world.remove(npcs[7].label);
    game.world.remove(npcs[7]);
    quorum--;
}

function toggle_temperature() {
    if (game.physics.arcade.distanceBetween(player, thermometer) > 40) {return;}

    if (temperature == COLD) {
        thermometer.setFrames(HOT, HOT, HOT, HOT);
        temperature = HOT;
        if (!!snowman_melted) {return;}
        melt_snowman();
    } else if (temperature == HOT) {
        thermometer.setFrames(COLD, COLD, COLD, COLD);
        temperature = COLD;
        if (!!snowman_melted) {return;}
        if (!!melt_timer) {
            melt_timer.destroy();
        }
    }
}

function melt_snowman() {
    melt_timer = game.time.create();
    melt_timer.add(5000, function() {
        var snowman_melting = game.add.sprite(npcs[3].x, npcs[3].y, 'snowman-melting');
        snowman_melted = true;
        snowman_melting.animations.add('death');
        snowman_melting.play('death', 1, false);
        game.world.remove(npcs[3].label);
        game.world.remove(npcs[3]);
        quorum--;
    }, this);
    melt_timer.start();
}

function drink_coffee() {
    if (game.physics.arcade.distanceBetween(player, coffee) > 40) {return;}
    attention_span = attention_threshold;
}

function fart_out() {
    if (!!fart) {
        fart.on = true;
        return;
    }

    var propagation_speed = 50;
    fart = game.add.emitter(20, 500, 10000);
    fart.makeParticles('fart');
    fart.setXSpeed(-1*propagation_speed, propagation_speed);
    fart.setYSpeed(-1*propagation_speed, propagation_speed);
    fart.setRotation(-10, 10);
    fart.setAlpha(0, 0.5, 3000, Phaser.Easing.Linear.None, true);
    fart.setScale(1, 1, 1, 1, 0, Phaser.Easing.Quintic.Out);
    fart.gravity = 0;
    fart.start(false, 4000, 20);
}

function hold_farts() {
    fart.on = false;
    fart_timer.destroy();
    fart_duration = 0;
}

function eat_burrito() {
    for (var i=0; i<burritos.length; i++) {
        if (game.physics.arcade.distanceBetween(player, burritos[i]) < 40) {
            var burrito_timer = game.time.create();
            burritos[i].visible = false;
            burrito_timer.add(5000, function() {burritos[i].visible = true;}, this);
            burrito_timer.start();

            if (!!fart_timer) {fart_timer.destroy();}
            fart_duration += 3000;
            fart_timer = game.time.create();
            fart_timer.add(fart_delay, fart_out, this);
            fart_timer.add(fart_delay + fart_duration, hold_farts, this);
            fart_timer.start();
            return;
        }
    }
}

function preload() {
    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('office-tiles', 'assets/office-tiles.png', 32, 32);
    game.load.image('coffee', 'assets/coffee.png');
    game.load.image('coffee-steam', 'assets/coffee-steam.png');
    game.load.image('fart', 'assets/fart-cloud.png');
    game.load.image('sheep', 'assets/sheep.png');
    game.load.image('burrito', 'assets/burrito.png');
    game.load.image('hack', 'assets/hack.png');
    game.load.spritesheet('thermometer', 'assets/thermometer.png', 16, 16, 2);
    game.load.spritesheet('snowman-melting', 'assets/snowman-melting.png', 32, 32, 10);
    game.load.spritesheet('robot-short-circuiting', 'assets/robot-short-circuiting.png', 32, 32, 10);

    for (var i=0; i<npc_data.length; i++) {
        var name = npc_data[i].name;
        game.load.spritesheet(name, 'assets/'+name+'.png', 32, 32, 2);
    }
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignvertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.updateBoundsCollisionGroup();
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 1;

    render_map();
    render_npcs();
    render_player();
    render_coffee();
    render_burritos();
    render_thermometer();
    render_hack();

    quorum = 6;
    attention_threshold = 10000;
    attention_span = attention_threshold;
    snowman_melted = false;
    robot_shorted = false;
    temperature = COLD;
    business_loop = game.time.events.loop(1000, business_speak, this);

    // Sheep collisions
    sheep_collision_group = game.physics.p2.createCollisionGroup();
    sheep = game.add.group();
    sheep.enableBody = true;
    sheep.physicsBodyType = Phaser.Physics.P2JS;
}

function update_sheep() {
    var attention_deficit = attention_threshold - attention_span;
    var num_sheep = attention_deficit;

    if (num_sheep > sheep.countLiving()) {
        var a_sheep = sheep.create(game.world.randomX, game.world.randomY, 'sheep');
        a_sheep.alpha = 0.25;
        a_sheep.body.setCircle(10);
        a_sheep.body.setCollisionGroup(sheep_collision_group);
        a_sheep.body.collides([sheep_collision_group]);
        a_sheep.body.velocity.x = Math.random() * 200;
        a_sheep.body.velocity.y = Math.random() * 200;
    } else if (num_sheep < sheep.length) {
        sheep.removeChildAt(0);
    }
}

function update_player() {
    var mouse_x = game.input.mousePointer.x - 16;
    var mouse_y = game.input.mousePointer.y - 16;
    if (game.physics.arcade.distanceToXY(player, mouse_x, mouse_y) > 8) {
        game.physics.arcade.moveToXY(player, mouse_x, mouse_y, 300);
    } else {
        player.body.velocity.set(0);
    }

    game.physics.arcade.collide(player, foreground_layer);

    if (!!fart) {
        fart.emitX = player.x;
        fart.emitY = player.y;
    }
}

function update_quorum() {
    if (!!quorum_indicator) {game.world.remove(quorum_indicator);}

    if (quorum >= 0) {
        var count = 'Quorum +'+quorum;
    } else {
        var count = 'Quorum '+quorum;
    }
    quorum_indicator = game.add.text(800, 600, count);
}

function check_victory() {
    if (quorum >= 0) {return;}

    var congrats_timer = game.time.create();
    congrats_timer.add(1000, function() {
        game.paused = true;
        game.add.text(50, 200, 'Congrats!\nMEETING CANCELED!', {
            font: 'bold 58pt arial',
            fill: '#f88',
            stroke: '#000',
            strokeThickness: 16,
            wordWrap: true,
            wordWrapWidth: '900',
            align: 'center'
        });
    });
    congrats_timer.start();
}

function fart_death(fart, npc) {
    if (!!npc.destroyed) {return;}

    if (npc.label.text == 'manager') {
        business_loop.timer.stop();
        game.world.remove(dialog);
    }

    game.add.tween(npc).to({angle: 90}, 50, Phaser.Easing.Linear.None, true);
    npc.label.destroy();
    npc.destroyed = true;
    quorum--;
}

function update() {
    update_player();
    update_sheep();
    update_quorum();
    check_victory();

    if (!!fart) {
        game.physics.arcade.collide(fart, fart_sensitive_group, fart_death);
    }
}
