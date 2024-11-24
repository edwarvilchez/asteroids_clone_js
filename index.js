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
    draw(){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();

        // dibujamos la nave
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
    }

    // mover la nave
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//creamos el jugador
const player = new Player({
    position:{ x:canvas.width/2, y:canvas.height/2 },
    velocity:{ x:0, y:0 },
});

// dibujamos el jugador en el lienzo
// player.draw();
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

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;

// configuramos el loop de animacion
function animate(){
    window.requestAnimationFrame(animate);

    // dibujamos el lienzo
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // console.log('animate');
    // configuramos los controles de movimiento de la nave
    player.update();
    player.velocity.x = 0;
    player.velocity.y = 0;
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    }
    else if (!keys.w.pressed && keys.s.pressed) {
        player.velocity.x = Math.cos(player.rotation) * -SPEED;
        player.velocity.y = Math.sin(player.rotation) * -SPEED;
    }
    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
    else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

animate();

// agregamos los eventos de teclado
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            console.log('presionamos W');
            keys.w.pressed = true;
            break;
        case 'KeyA':
            console.log('presionamos A');
            keys.a.pressed = true;
            break;
        case 'KeyD':
            console.log('presionamos D');
            keys.d.pressed = true;
            break;
        case 'KeyS':
            console.log('presionamos S');
            keys.s.pressed = true;
            break;
    }
    console.log(event);
});
window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            console.log('presionamos W');
            keys.w.pressed = false;
            break;
        case 'KeyA':
            console.log('presionamos A');
            keys.a.pressed = false;
            break;
        case 'KeyD':
            console.log('presionamos D');
            keys.d.pressed = false;
            break;
        case 'KeyS':
            console.log('presionamos S');
            keys.s.pressed = false;
            break;
    }
    console.log(event);
})


