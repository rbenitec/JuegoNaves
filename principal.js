var fondoJuego;
var nave;
var cursores;

var balas;
var tiempoBala = 0;
var botonDisparo;

var enemigos;
var sonidoDisparo;
var sonidoExplosion;
var texto;

// Definimos variables

var juego = new Phaser.Game(370, window.innerHeight, Phaser.CANVAS, 'bloque_juego');

var estadoPrincipal = {
    preload: function () {
        // Carga todos los recursos
        juego.load.image('fondo', 'img/space.png');
        juego.load.image('personaje', 'img/nave.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('enemigo', 'img/pajaro2.png');
        
        // Cargar los sonidos
        juego.load.audio('disparo', 'sonidos/disparo.mp3');
        juego.load.audio('explosion', 'sonidos/explosion.mp3');
    },

    create: function () {
        // Mostrar pantalla
        fondoJuego = juego.add.tileSprite(0, 0, 370, window.innerHeight, 'fondo');
        nave = juego.add.sprite(juego.width / 2, juego.height - 100, 'personaje'); // Subimos la nave
        nave.anchor.setTo(0.5);
        nave.scale.setTo(2, 2); // Agrandar la nave

        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 4; x++) {
                var enemigo = enemigos.create(x * 80, y * 40, 'enemigo'); // Agrandar espaciado de los enemigos
                enemigo.anchor.setTo(0.5);
                enemigo.scale.setTo(2, 2); // Agrandar los enemigos
            }
        }

        enemigos.x = 50;
        enemigos.y = 30;
        var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        // Añadir sonidos
        sonidoDisparo = juego.add.audio('disparo');
        sonidoExplosion = juego.add.audio('explosion');

        // Añadir texto
        texto = juego.add.text(juego.width / 2, juego.height - 20, "Roberto Junior Benitez Cruzado U17305100", { font: "20px Arial", fill: "#ffffff" });
        texto.anchor.setTo(0.5);
    },

    update: function () {
        // Animamos el fondo para el movimiento vertical
        fondoJuego.tilePosition.y += 2;

        // Animamos el juego
        if (cursores.right.isDown) {
            nave.position.x += 3;
        }
        else if (cursores.left.isDown) {
            nave.position.x -= 3;
        }
        else if (cursores.up.isDown) {
            nave.position.y -= 3;
        }
        else if (cursores.down.isDown) {
            nave.position.y += 3;
        }

        // Limitar la nave dentro de los límites laterales
        if (nave.x < nave.width / 2) {
            nave.x = nave.width / 2;
        } else if (nave.x > juego.width - nave.width / 2) {
            nave.x = juego.width - nave.width / 2;
        }
        
        // Limitar la nave dentro de los límites verticales
        if (nave.y < nave.height / 2) {
            nave.y = nave.height / 2;
        } else if (nave.y > juego.height - nave.height / 2) {
            nave.y = juego.height - nave.height / 2;
        }

        var bala;
        if (botonDisparo.isDown) {
            if (juego.time.now > tiempoBala) {
                bala = balas.getFirstExists(false);
            }
            if (bala) {
                bala.reset(nave.x, nave.y);
                bala.body.velocity.y = -300;
                tiempoBala = juego.time.now + 100;
                // Reproducir sonido de disparo
                sonidoDisparo.play();
            }
        }
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

function colision(bala, enemigo) {
    bala.kill();
    enemigo.kill();
    // Reproducir sonido de explosión
    sonidoExplosion.play();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');

// Centramos el canvas del juego en la pantalla
document.getElementById('bloque_juego').style.margin = '20 auto';
document.getElementById('bloque_juego').style.display = 'block';
document.getElementById('bloque_juego').style.height = '100vh';
 
