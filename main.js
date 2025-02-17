class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('ship', 'obj/nave.png'); // Usa a imagem enviada
        this.load.image('bullet', 'obj/bala.png'); // Você pode substituir por outra imagem de tiro
    }

    create() {
        this.ship = this.physics.add.sprite(100, 300, 'ship');
        this.ship.setScale(0.1); // Diminui o tamanho da nave
        this.ship.setCollideWorldBounds(true);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject) {
                body.gameObject.setActive(false);
                body.gameObject.setVisible(false);
            }
        });

        this.bullets.children.each((bullet) => {
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', (body) => {
                if (body.gameObject === bullet) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            });
        }, this);
    }

    update() {
        this.ship.setVelocity(0);
        
        if (this.keyW.isDown && !this.keyS.isDown && !this.keyA.isDown && !this.keyD.isDown) {
            this.ship.setVelocityY(-200);
            this.ship.setAngle(0); // Rotaciona a nave para cima
        } else if (this.keyS.isDown && !this.keyW.isDown && !this.keyA.isDown && !this.keyD.isDown) {
            this.ship.setVelocityY(200);
            this.ship.setAngle(180); // Rotaciona a nave para baixo
        } else if (this.keyA.isDown && !this.keyW.isDown && !this.keyS.isDown && !this.keyD.isDown) {
            this.ship.setVelocityX(-200);
            this.ship.setAngle(-90); // Rotaciona a nave para a esquerda
        } else if (this.keyD.isDown && !this.keyW.isDown && !this.keyS.isDown && !this.keyA.isDown) {
            this.ship.setVelocityX(200);
            this.ship.setAngle(90); // Rotaciona a nave para a direita
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            console.log(`Nave está no ângulo: ${this.ship.angle}`);
            this.shootBullet();
        }
    }

    shootBullet() {
        let bullet = this.bullets.get(this.ship.x, this.ship.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setScale(0.03); // Diminui o tamanho da bala
            bullet.body.onWorldBounds = true;
            bullet.body.setCollideWorldBounds(true);

            switch (this.ship.angle) {
                case -90:
                    bullet.setVelocityX(-300); // Bala para a esquerda
                    bullet.setPosition(this.ship.x - 20, this.ship.y); // Ajusta a posição da bala para a esquerda
                    break;
                case 90:
                    bullet.setVelocityX(300); // Bala para a direita
                    bullet.setPosition(this.ship.x + 20, this.ship.y); // Ajusta a posição da bala para a direita
                    break;
                case 0:
                    bullet.setVelocityY(-300); // Bala para cima
                    bullet.setPosition(this.ship.x, this.ship.y - 20); // Ajusta a posição da bala para cima
                    break;
                case 180:
                    bullet.setVelocityY(300); // Bala para baixo
                    bullet.setPosition(this.ship.x, this.ship.y + 20); // Ajusta a posição da bala para baixo
                    break;
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: MainScene
};

const game = new Phaser.Game(config);
