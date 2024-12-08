const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// creamos la clase jugador
class Player{
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

 // dibujamos la nave en el lienzo y la rotamos
    draw(){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();

 // dibujamos la nave con un color blanco
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
    }
// movemos y rotamos la nave en el lienzo en funcion de las teclas presionadas en el juego
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// creamos la clase asteroid
class Asteroid {
    constructor({position, velocity, radius}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }// cierre del constructor
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }// cierre de la funcion draw
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }// cierre de la funcion update
}//cierre de la clase asteroid

// creamos la clase proyectil
class Projectile{
    constructor({ position, velocity, rotation }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }// dibujamos el proyectil en el lienzo
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//creamos el jugador y el lienzo
const player = new Player({
    position:{ x:canvas.width/2, y:canvas.height/2 },
    velocity:{ x:0, y:0 },
});

// dibujamos el jugador en el lienzo
const keys = {
   w:{
       pressed: false
   },
   a:{
       pressed: false
   },
   d:{
       pressed: false
   },
   s:{
       pressed: false
   }
}

// declaramos las variables de movimiento
const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const PROJECTILE_SPEED = 3;
const projectiles = []; // declaramos las variables de disparo
const asteroids = []; // declaramos las variables de asteroids


window.setInterval(() => {
    const index = Math.floor(Math.random() * 4);
    let x, y = 0;
    let vx, vy = 0;
    let radius = 50 * Math.random() + 10;
    switch (index) {
        case 0: // lado izquierdo de la  pantalla
            x = 0 - radius;
            y = Math.random() * canvas.height;
            vx = 1
            vy = 0
            break;
        case 1: // lado inferior de la pantalla
            x = Math.random() * canvas.width ;
            y = canvas.height + radius;
            vx = 0
            vy = -1
            break;
        case 2: // lado derecho de la pantalla
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            vx = -1
            vy = 0
            break;
            case 3: // lado superior de la pantalla
            x = Math.random() * canvas.width;
            y = 0 - radius;
            vx = 0
            vy = 1
            break;
    }
    asteroids.push(new Asteroid({
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: vx,
            y: vy
        },
        radius: radius
    }))
    //console.log(asteroids);
}, 3000)

// configuramos el loop de animacion
function animate() {
    window.requestAnimationFrame(animate);
    // dibujamos el lienzo
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // actualizamos la nave en el lienzo
    player.update();
    // projectiles.forEach((proyectil) => {});
    for(let i = projectiles.length - 1 ; i >= 0; i--){
        const projectile = projectiles[i];
        projectile.update(); // actualizamos el proyectil en el lienzo
        if(projectile.position.x + projectile.radius < 0
            || projectile.position.x - projectile.radius > canvas.width
            || projectile.position.y + projectile.radius < 0
            || projectile.position.y - projectile.radius > canvas.height
            || projectile.position.x + projectile.radius < 0){
            projectiles.splice(i, 1);
        }
    }

    // actualizamos los asteroids en el lienzo
    for(let i = asteroids.length - 1 ; i >= 0; i--){
        const asteroid = asteroids[i];
        asteroid.update(); // actualizamos el asteroid en el lienzo
        if(asteroid.position.x + asteroid.radius < 0
            || asteroid.position.x - asteroid.radius > canvas.width
            || asteroid.position.y + asteroid.radius < 0
            || asteroid.position.y - asteroid.radius > canvas.height
            || asteroid.position.x + asteroid.radius < 0){
            asteroids.splice(i, 1);
        }
}

// configuramos los controles de movimiento de la nave
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else if (!keys.w.pressed && keys.s.pressed) {
        // player.velocity.x = Math.cos(player.rotation) * -SPEED;
        player.velocity.x *= FRICTION;
        //player.velocity.y = Math.sin(player.rotation) * -SPEED;
        player.velocity.y *= FRICTION;
    }
    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
    else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

// invocamos la funcion de animacion
animate();

// agregamos los eventos de teclado
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            //console.log('presionamos W');
            keys.w.pressed = true;
            break;
        case 'KeyA':
            //console.log('presionamos A');
            keys.a.pressed = true;
            break;
        case 'KeyD':
            //console.log('presionamos D');
            keys.d.pressed = true;
            break;
        case 'KeyS':
            //console.log('presionamos S');
            keys.s.pressed = true;
            break;
        case 'Space':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + Math.cos(player.rotation) * 30,
                    y: player.position.y + Math.sin(player.rotation) * 30
                },
                velocity: {
                    x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y: Math.sin(player.rotation) * PROJECTILE_SPEED,
                },
            }));
    }
});
// agregamos los eventos de teclado
window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            // console.log('presionamos W');
            keys.w.pressed = false;
            break;
        case 'KeyA':
            //console.log('presionamos A');
            keys.a.pressed = false;
            break;
        case 'KeyD':
            //console.log('presionamos D');
            keys.d.pressed = false;
            break;
        case 'KeyS':
            // console.log('presionamos S');
            keys.s.pressed = false;
            break;
    }
    //console.log(event);
})


