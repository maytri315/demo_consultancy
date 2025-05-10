// Mobile Menu Toggle (unchanged)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Form Submission Placeholder (unchanged)
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We’ll contact you shortly. (Demo - add backend logic.)');
});

// Animation Observer (unchanged)
const animatedElements = document.querySelectorAll('.animate-fade, .animate-slide');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.3 });

animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Enhanced 3D Globe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const globeContainer = document.getElementById('globe-container');
globeContainer.appendChild(renderer.domElement);

// Globe Geometry and Texture
const isMobile = window.innerWidth <= 768;
const globeRadius = isMobile ? 8 : 10;
const geometry = new THREE.SphereGeometry(globeRadius, isMobile ? 32 : 64, isMobile ? 32 : 64);

// Load Earth Texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 10,
    specular: 0x333333,
    transparent: true,
    opacity: 0.9
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Add Atmosphere (Glow Effect)
const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.05, 32, 32);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x1e2a44,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

// Camera Position
camera.position.z = isMobile ? 18 : 20;

// Mouse/Touch Interaction
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

globeContainer.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.5;
});

// Touch Support for Mobile
globeContainer.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.5;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth Rotation
    globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05;
    globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.05;
    atmosphere.rotation.y = globe.rotation.y;
    atmosphere.rotation.x = globe.rotation.x;

    // Subtle Auto-Rotation
    globe.rotation.y += isMobile ? 0.001 : 0.002;
    atmosphere.rotation.y += isMobile ? 0.001 : 0.002;

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});