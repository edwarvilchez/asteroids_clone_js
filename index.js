/**
 * @file Juego de nave espacial simple con HTML5 Canvas.
 * @author [edwar "eddiemonster" vilchez]
 */

// Obtiene el elemento canvas y su contexto de dibujo 2D.
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Ajusta el tamaño del canvas al tamaño de la ventana.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Clase para representar al jugador.
class Player {
    /**
     * Crea una nueva instancia de Player.
     * @param {Object} options - Opciones de configuración del jugador.
     * @param {Object} options.position - Posición inicial del jugador.
     * @param {Object} options.velocity - Velocidad inicial del jugador.
     */
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    /**
     * Dibuja al jugador en el canvas.
     */
    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);

        // Dibujar la nave del jugador (triángulo)
        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();

        ctx.strokeStyle = 'white';
        ctx.stroke();

        // Dibujar el centro de la nave (círculo rojo)
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    /**
     * Actualiza la posición del jugador.
     */
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    /**
     * Obtiene los vértices del triángulo que representa al jugador.
     * @returns {Array} Array de objetos con las coordenadas x e y de cada vértice.
     */
    getVertices() {
        // Calcula los vértices del triángulo rotado
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        return [
            { x: this.position.x + cos * 30, y: this.position.y + sin * 30 },
            { x: this.position.x - cos * 10 - sin * 10, y: this.position.y - sin * 10 + cos * 10 },
            { x: this.position.x - cos * 10 + sin * 10, y: this.position.y - sin * 10 - cos * 10 }
        ];
    }
}

// Clase para representar un asteroide.
class Asteroid {
    /**
     * Crea una nueva instancia de Asteroid.
     * @param {Object} options - Opciones de configuración del asteroide.
     * @param {Object} options.position - Posición inicial del asteroide.
     * @param {Object} options.velocity - Velocidad inicial del asteroide.
     * @param {number} options.radius - Radio del asteroide.
     */
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    /**
     * Dibuja el asteroide en el canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /**
     * Actualiza la posición del asteroide.
     */
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Clase para representar un proyectil.
class Projectile {
    /**
     * Crea una nueva instancia de Projectile.
     * @param {Object} options - Opciones de configuración del proyectil.
     * @param {Object} options.position - Posición inicial del proyectil.
     * @param {Object} options.velocity - Velocidad inicial del proyectil.
     */
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    /**
     * Dibuja el proyectil en el canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    /**
     * Actualiza la posición del proyectil.
     */
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Crea una nueva instancia del jugador.
const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },
});

// Objeto para almacenar las teclas presionadas.
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false }
};

// Constantes del juego.
const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.97;
const PROJECTILE_SPEED = 3;
const projectiles = [];
const asteroids = [];

// Variables para el contador de puntos, niveles y velocidad
let puntos = 0;
let nivel = 1;
let umbralPuntos = 1000;
let velocidadAsteroides = 1; // Velocidad inicial de los asteroide

// Crea asteroides a intervalos regulares.
const intervalId = window.setInterval(() => {
    const radius = 50 * Math.random() + 10;
    let x, y;
    let vx, vy;

    const side = Math.floor(Math.random() * 4);
    switch (side) {
        case 0: // Izquierda
            x = 0 - radius;
            y = Math.random() * canvas.height;
            vx = 1;
            vy = 0;
            break;
        case 1: // Abajo
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
            vx = 0;
            vy = -1;
            break;
        case 2: // Derecha
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            vx = -1;
            vy = 0;
            break;
        case 3: // Arriba
            x = Math.random() * canvas.width;
            y = 0 - radius;
            vx = 0;
            vy = 1;
            break;
    }

    asteroids.push(new Asteroid({
        position: { x, y },
        velocity: { x: vx * velocidadAsteroides, y: vy * velocidadAsteroides }, // Aplicar velocidad
        radius
    }));
}, 3000);

/**
 * Detecta colisiones entre dos círculos.
 * @param {Object} circle1 - Primer círculo.
 * @param {Object} circle2 - Segundo círculo.
 * @returns {boolean} True si hay colisión, False en caso contrario.
 */
function circleCollision(circle1, circle2) {
    const dx = circle2.position.x - circle1.position.x;
    const dy = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= circle1.radius + circle2.radius;
}

/**
 * Detecta colisiones entre un círculo y un triángulo.
 * @param {Object} circle - Círculo.
 * @param {Array} triangle - Array de vértices del triángulo.
 * @returns {boolean} True si hay colisión, False en caso contrario.
 */
function circleTriangleCollision(circle, triangle) {
    for (let i = 0; i < 3; i++) {
        let start = triangle[i];
        let end = triangle[(i + 1) % 3];

        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        let dot = ((circle.position.x - start.x) * dx + (circle.position.y - start.y) * dy) / Math.pow(length, 2);

        let closestX = start.x + dot * dx;
        let closestY = start.y + dot * dy;

        if (!isPointOnLineSegment(closestX, closestY, start, end)) {
            closestX = closestX < start.x ? start.x : end.x;
            closestY = closestY < start.y ? start.y : end.y;
        }

        dx = closestX - circle.position.x;
        dy = closestY - circle.position.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= circle.radius) {
            return true;
        }
    }

    return false;
}

/**
 * Verifica si un punto está en un segmento de línea.
 * @param {number} x - Coordenada x del punto.
 * @param {number} y - Coordenada y del punto.
 * @param {Object} start - Punto inicial del segmento.
 * @param {Object} end - Punto final del segmento.
 * @returns {boolean} True si el punto está en el segmento, False en caso contrario.
 */
function isPointOnLineSegment(x, y, start, end) {
    return (
        x >= Math.min(start.x, end.x) &&
        x <= Math.max(start.x, end.x) &&
        y >= Math.min(start.y, end.y) &&
        y <= Math.max(start.y, end.y)
    );
}

/**
 * Verifica si un objeto está fuera de los límites del canvas.
 * @param {Object} object - Objeto a verificar.
 * @param {number} radius - Radio del objeto.
 * @returns {boolean} True si el objeto está fuera de los límites, False en caso contrario.
 */
function isOutOfBounds(object, radius) {
    return object.position.x + radius < 0 ||
        object.position.x - radius > canvas.width ||
        object.position.y + radius < 0 ||
        object.position.y - radius > canvas.height;
}

/**
 * Función de animación principal del juego.
 */
function animate() {
    const animationId = window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        // Eliminar proyectiles fuera de pantalla
        if (isOutOfBounds(projectile, projectile.radius)) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });

    // Eliminar asteroides fuera de pantalla y verificar colisiones
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        try {
            if (circleTriangleCollision(asteroid, player.getVertices())) {
                console.log("Player destroyed");
                window.cancelAnimationFrame(animationId);
                clearInterval(intervalId);
                alert("¡Juego terminado!"); // Mostrar una alerta al jugador
                return;
            }
        } catch (error) {
            console.error("Error en la detección de colisiones:", error);
        }

        if (isOutOfBounds(asteroid, asteroid.radius)) {
            asteroids.splice(i, 1);
        }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j];
            if (circleCollision(asteroid, projectile)) {
                asteroids.splice(i, 1);
                projectiles.splice(j, 1);
                break;
            }
        }
    }

    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else if (keys.s.pressed) {
        player.velocity.x = -Math.cos(player.rotation) * SPEED * FRICTION;
        player.velocity.y = -Math.sin(player.rotation) * SPEED * FRICTION;
    } else {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }

    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
    else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

// Inicia la animación.
animate();

// Maneja los eventos de teclado.
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break;
        case 'KeyA':
            keys.a.pressed = true;
            break;
        case 'KeyD':
            keys.d.pressed = true;
            break;
        case 'KeyS':
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
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false;
            break;
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
        case 'KeyS':
            keys.s.pressed = false;
            break;
    }
});