import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 500; // Set camera position

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById('3d-container').appendChild(renderer.domElement);

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// OrbitControls allow the camera to move around the scene
const controls = new OrbitControls(camera, renderer.domElement);

// Instantiate a loader for the textures
const textureLoader = new TextureLoader();

// Load the textures
const textures = {
    Bevel_baseColor: textureLoader.load('../Rubik/textures/Bevel_baseColor.png'),
    Bevel_metallicRoughness: textureLoader.load('../Rubik/textures/Bevel_metallicRoughness.png'),
    Bevel_normal: textureLoader.load('../Rubik/textures/Bevel_normal.png'),
    Blue_baseColor: textureLoader.load('../Rubik/textures/Blue_baseColor.png'),
    GradientPastel_baseColor: textureLoader.load('../Rubik/textures/GradientPastel_baseColor.png'),
    Green_baseColor: textureLoader.load('../Rubik/textures/Green_baseColor.png'),
    Green_metallicRoughness: textureLoader.load('../Rubik/textures/Green_metallicRoughness.png'),
    material_baseColor: textureLoader.load('../Rubik/textures/material_baseColor.png'),
    Orange_baseColor: textureLoader.load('../Rubik/textures/Orange_baseColor.png'),
    White_baseColor: textureLoader.load('../Rubik/textures/White_baseColor.png'),
    Yellow_baseColor: textureLoader.load('../Rubik/textures/Yellow_baseColor.png')
};

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    '../Rubik/scene.gltf',
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;

        // Apply textures to materials if necessary
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.material.map) {
                    child.material.map = textures[child.material.map.name];
                }
                if (child.material.metalnessMap) {
                    child.material.metalnessMap = textures[child.material.metalnessMap.name];
                }
                if (child.material.normalMap) {
                    child.material.normalMap = textures[child.material.normalMap.name];
                }
            }
        });

        scene.add(object);
    },
    function (xhr) {
        // While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // If there is an error, log it
        console.error('An error happened while loading the GLTF file', error);
    }
);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

// Start the 3D rendering
animate();
