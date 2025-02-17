class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('ship', 'obj/nave.png'); // Verifique se o caminho está correto
        this.load.image('bullet', 'obj/bala.png'); // Verifique se o caminho está correto
        this.load.image('upButton', 'obj/up.png'); // Verifique se o caminho está correto
        this.load.image('leftButton', 'obj/left.png'); // Verifique se o caminho está correto
        this.load.image('downButton', 'obj/down.png'); // Verifique se o caminho está correto
        this.load.image('rightButton', 'obj/right.png'); // Verifique se o caminho está correto
        this.load.image('shootButton', 'obj/shoot.png'); // Verifique se o caminho está correto
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

        // Adicione botões de controle
        this.addButton(100, 480, 'upButton', () => this.moveShip('up')).setScale(0.1);
        this.addButton(50, 533, 'leftButton', () => this.moveShip('left')).setScale(0.1).setAngle(-90);
        this.addButton(100, 580, 'downButton', () => this.moveShip('down')).setScale(0.1).setAngle(180); // Deixe a imagem de cabeça para baixo
        this.addButton(150, 533, 'rightButton', () => this.moveShip('right')).setScale(0.1).setAngle(90);
        this.addButton(700, 550, 'shootButton', () => this.shootBullet()).setScale(0.1); // Botão para atirar

        // Adicione eventos para manter o movimento enquanto os botões estão pressionados
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            currentlyOver.forEach(button => {
                if (button.texture.key === 'upButton') this.isUpPressed = true;
                if (button.texture.key === 'leftButton') this.isLeftPressed = true;
                if (button.texture.key === 'downButton') this.isDownPressed = true;
                if (button.texture.key === 'rightButton') this.isRightPressed = true;
                if (button.texture.key === 'shootButton') this.isShootPressed = true;
            });
        });

        this.input.on('pointerup', (pointer, currentlyOver) => {
            currentlyOver.forEach(button => {
                if (button.texture.key === 'upButton') this.isUpPressed = false;
                if (button.texture.key === 'leftButton') this.isLeftPressed = false;
                if (button.texture.key === 'downButton') this.isDownPressed = false;
                if (button.texture.key === 'rightButton') this.isRightPressed = false;
                if (button.texture.key === 'shootButton') this.isShootPressed = false;
            });
        });
    }

    update() {
        this.ship.setVelocity(0);
        
        if (this.keyW.isDown || this.isUpPressed) {
            this.ship.setVelocityY(-200);
            this.ship.setAngle(0); // Rotaciona a nave para cima
        } else if (this.keyS.isDown || this.isDownPressed) {
            this.ship.setVelocityY(200);
            this.ship.setAngle(180); // Rotaciona a nave para baixo
        } else if (this.keyA.isDown || this.isLeftPressed) {
            this.ship.setVelocityX(-200);
            this.ship.setAngle(-90); // Rotaciona a nave para a esquerda
        } else if (this.keyD.isDown || this.isRightPressed) {
            this.ship.setVelocityX(200);
            this.ship.setAngle(90); // Rotaciona a nave para a direita
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.isShootPressed) {
            this.shootBullet();
        }
    }

    addButton(x, y, key, callback) {
        const button = this.add.sprite(x, y, key).setInteractive();
        button.on('pointerdown', callback);
        return button;
    }

    moveShip(direction) {
        switch (direction) {
            case 'up':
                this.ship.setVelocityY(-200);
                this.ship.setAngle(0); // Rotaciona a nave para cima
                break;
            case 'left':
                this.ship.setVelocityX(-200);
                this.ship.setAngle(-90); // Rotaciona a nave para a esquerda
                break;
            case 'down':
                this.ship.setVelocityY(200);
                this.ship.setAngle(180); // Rotaciona a nave para baixo
                break;
            case 'right':
                this.ship.setVelocityX(200);
                this.ship.setAngle(90); // Rotaciona a nave para a direita
                break;
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
                case -180:
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
