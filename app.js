let scene;
let camera;
let renderer;
let airplane;

function toggleMenu() {
    const menuItems = document.querySelector('.menu-items');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.menu-close-icon');
    
    menuItems.classList.toggle('show');
    
    // Mostrar/ocultar íconos según el estado del menú
    if (menuItems.classList.contains('show')) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }
  
  function main() {
    const canvas = document.querySelector('#c');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Crear la geometría de la Tierra
    const earthgeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const earthmaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: new THREE.TextureLoader().load('images/earthmap5.webp'),
        bumpMap: new THREE.TextureLoader().load('images/earthbump.jpg'),
        bumpScale: 0.3,
    });

    const earthmesh = new THREE.Mesh(earthgeometry, earthmaterial);
    scene.add(earthmesh);

    // Luz ambiental
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    // Luz puntual
    const pointerlight = new THREE.PointLight(0xffffff, 0.9);
    pointerlight.position.set(5, 3, 5);
    scene.add(pointerlight);

    // Nubes
    const cloudgeometry = new THREE.SphereGeometry(0.63, 32, 32);
    const cloudmaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('images/earthCloud.webp'),
        transparent: true
    });

    const cloudmesh = new THREE.Mesh(cloudgeometry, cloudmaterial);
    scene.add(cloudmesh);

    // Crear el avión
    const airplaneGeometry = new THREE.PlaneGeometry(0.1, 0.1);
    const airplaneTexture = new THREE.TextureLoader().load('images/avion2.svg');
    const airplaneMaterial = new THREE.MeshBasicMaterial({ map: airplaneTexture, transparent: true });
    airplane = new THREE.Mesh(airplaneGeometry, airplaneMaterial);
    scene.add(airplane);

    // Animación
    const animate = () => {
        requestAnimationFrame(animate);
        earthmesh.rotation.y -= 0.0015;
        cloudmesh.rotation.y += 0.0015;

        // Animar el avión en la curva de infinito
        moveAirplaneInInfinity();

        render();
    }

    const render = () => {
        renderer.render(scene, camera);
    }

    animate();
}

// Función para mover el avión en una trayectoria de infinito y ajustar la rotación y el z-index
function moveAirplaneInInfinity() {
    const time = Date.now() * 0.001;  // Tiempo para la animación

    // Fórmula de lemniscata (infinito) para las coordenadas x e y
    const a = 0.8;  // Tamaño horizontal de la curva de infinito
    const x = a * Math.sin(time);
    const y = a * Math.sin(2 * time) / 2;

    airplane.position.set(x, y, 0);

    // Calcula la dirección del movimiento
    const dx = a * Math.cos(time);   // Derivada de la posición en x
    const dy = a * Math.cos(2 * time); // Derivada de la posición en y
    const targetRotationZ = Math.atan2(dy, dx);  // Calcula el ángulo para apuntar en la dirección del movimiento

    // Ajusta la rotación instantáneamente hacia la dirección de movimiento
    airplane.rotation.z = targetRotationZ;

    // Ajustar el z-index o renderOrder basado en la posición en Y
    if (y > 0) {
        airplane.renderOrder = 1;  // El avión está detrás del texto
        airplane.material.depthTest = true;  // Asegura que el avión pase detrás
    } else {
        airplane.renderOrder = 10; // El avión pasa delante del texto
        airplane.material.depthTest = false; // El avión no debe ser ocultado por otros objetos
    }
}

window.onload = main;
