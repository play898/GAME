import Phaser from 'phaser';

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setOrigin(0.5);
        this.setFrame(0);
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.isDown(Phaser.Input.Keyboard.LEFT)) {
            this.x -= 5;
        } else if (Phaser.Input.Keyboard.isDown(Phaser.Input.Keyboard.RIGHT)) {
            this.x += 5;
        }
        if (Phaser.Input.Keyboard.isDown(Phaser.Input.Keyboard.SPACE)) {
            const bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
            bullet.setActive(true);
            bullet.setVisible(true);
        }
    }

    draw() {
        this(scene.game.scale.context).clear();
        scene.game.draw(this);
    }
}

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setOrigin(0.5);
        this.setFrame(1);
    }

    update(time, delta) {
        this.y += 5;
        if (this.y > this.scene.game.canvas.height) {
            this.x = Phaser.Math.FloatBetween(0, this.scene.game.canvas.width);
            this.y = 0;
        }
    }

    draw() {
        this(scene.game.scale.context).clear();
        scene.game.draw(this);
    }
}

class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setOrigin(0.5);
        this.setFrame(2);
    }

    update(time, delta) {
        this.y -= 10;
        if (this.y < 0) {
            this.destroy();
        }
    }

    draw() {
        this(scene.game.scale.context).clear();
        scene.game.draw(this);
    }
}

class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game', width: 800, height: 600 });
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create() {
        const player = this.add.sprite(400, 300, 'player').setOrigin(0.5);
        player.body = this.physics.add.collider(player);

        for (let i = 0; i < 10; i++) {
            const enemy = this.add.sprite(Phaser.Math.FloatBetween(0, this.canvas.width), 0, 'enemy');
            enemy.body = this.physics.add.collider(enemy, player);
            enemy.setOrigin(0.5);
        }

        this.input.keyboard.on('down', (keyboard) => {
            if (keyboard.isDown(Phaser.Input.Keyboard.LEFT)) {
                player.x -= 5;
            } else if (keyboard.isDown(Phaser.Input.Keyboard.RIGHT)) {
                player.x += 5;
            }
            if (keyboard.isDown(Phaser.Input.Keyboard.SPACE)) {
                const bullet = this.physics.add.sprite(player.x, player.y, 'bullet');
                bullet.setActive(true);
                bullet.setVisible(true);
            }
        });
    }

    update(time, delta) {
        for (let i = 0; i < this.children.list.length; i++) {
            this.children.list[i].update(time, delta);
        }
    }
}

const game = new Game();
game.scene.add('game', game);

Phaser.start({
    type: Phaser.CANVAS,
    parent: 'game',
    scaleMode: Phaser.Scale.FIT,
    autoCenter: true
});