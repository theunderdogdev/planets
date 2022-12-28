import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import * as dat from "dat.gui";
let factor = 142984;

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const sunmap = textureLoader.load("/textures/sun.jpg");
const mercury = textureLoader.load("/textures/mercury.jpg");
const venus = textureLoader.load("/textures/venus.jpg");
const earth = textureLoader.load("/textures/earth.jpg");
const mars = textureLoader.load("/textures/mars.jpg");
const jupiter = textureLoader.load("/textures/jupiter.jpg");
const saturn = textureLoader.load("/textures/saturn.jpg");
const uranus = textureLoader.load("/textures/uranus.jpg");
const neptune = textureLoader.load("/textures/neptune.jpg");
const pluto = textureLoader.load("/textures/pluto.jpg");

let planets = [
  {
    name: "Mercury",
    radius: 4879,
    compr: 0.1,
    dist: 5,
    period: 0.241,
    textureMap: mercury,
  },
  {
    name: "Venus",
    radius: 12104,
    compr: 0.2,
    dist: 8.5,
    period: 0.615,
    textureMap: venus,
  },
  {
    name: "Earth",
    radius: 12756,
    compr: 0.3,
    dist: 10.25,
    period: 1,
    textureMap: earth,
  },
  {
    name: "Mars",
    radius: 6792,
    compr: 0.15,
    dist: 12.5,
    period: 1.88,
    textureMap: mars,
  },
  {
    name: "Jupiter",
    radius: 142984,
    compr: 2.5,
    dist: 17.5,
    period: 11.86,
    textureMap: jupiter,
  },
  {
    name: "Saturn",
    radius: 120536,
    compr: 2.1,
    dist: 25,
    period: 29.46,
    textureMap: saturn,
  },
  {
    name: "Uranus",
    radius: 51118,
    compr: 0.9,
    dist: 31,
    period: 84.01,
    textureMap: uranus,
  },
  {
    name: "Neptune",
    radius: 49528,
    compr: 0.8,
    dist: 35,
    period: 164.79,
    textureMap: neptune,
  },
  {
    name: "Pluto",
    radius: 2370,
    compr: 0.4,
    dist: 39,
    period: 248.59,
    textureMap: pluto,
  },
];

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
gui.add(pointLight, "intensity", 0, 1, 0.0001);
const solarSystem = new THREE.Group();
const sunGeom = new THREE.SphereBufferGeometry(3.5, 36, 36);
const sun = new THREE.Mesh(
  sunGeom,
  new THREE.MeshStandardMaterial({ map: sunmap, name: "Sun" })
);
// sun.material.transparent = true;
sun.material.roughness = 1;
solarSystem.add(sun);

for (let planet in planets) {
  const material = new THREE.MeshStandardMaterial({
    map: planets[planet].textureMap,
    name: planets[planet].name,
  });
  material.roughness = 0.7;

  const sphereGeom = new THREE.SphereBufferGeometry(
    planets[planet].compr,
    36,
    36
  );
  const sphere = new THREE.Mesh(sphereGeom, material);
  sphereGeom.computeBoundingBox();
  sphere.position.set(planets[planet].dist, 0, 0);
  solarSystem.add(sphere);
}

// dirLight2.rotation.z = Math.PI;
// dirLight3.rotation.x = -Math.PI / 2;
// dirLight4.rotation.x = Math.PI / 2;
scene.add(solarSystem, ambientLight, pointLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 15;
gui.add(camera.position, "x", 0, 25, 1);
gui.add(camera.position, "y", 0, 25, 1);
gui.add(camera.position, "z", 0, 25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  solarSystem.children[1].position.x =
    Math.sin((elapsedTime + 4) / (8 * 0.241)) * planets[0].dist;
  solarSystem.children[1].position.z =
    Math.cos((elapsedTime + 4) / (8 * 0.241)) * planets[0].dist;

  solarSystem.children[2].position.x =
    Math.sin((elapsedTime - 10) / (8 * 0.615)) * planets[1].dist;
  solarSystem.children[2].position.z =
    Math.cos((elapsedTime - 10) / (8 * 0.615)) * planets[1].dist;

  solarSystem.children[3].position.x =
    Math.sin((elapsedTime - 3) / 8) * planets[2].dist;
  solarSystem.children[3].position.z =
    Math.cos((elapsedTime - 3) / 8) * planets[2].dist;

  solarSystem.children[4].position.x =
    Math.sin((elapsedTime - 5) / (8 * 1.88)) * planets[3].dist;
  solarSystem.children[4].position.z =
    Math.cos((elapsedTime - 5) / (8 * 1.88)) * planets[3].dist;

  solarSystem.children[5].position.x =
    Math.sin((elapsedTime + 150) / (8 * 11.86)) * planets[4].dist;
  solarSystem.children[5].position.z =
    Math.cos((elapsedTime + 150) / (8 * 11.86)) * planets[4].dist;

  solarSystem.children[6].position.x =
    Math.sin((elapsedTime - 514) / (8 * 29.46)) * planets[5].dist;
  solarSystem.children[6].position.z =
    Math.cos((elapsedTime - 514) / (8 * 29.46)) * planets[5].dist;

  solarSystem.children[7].position.x =
    Math.sin((elapsedTime - 130) / (8 * 84.01)) * planets[6].dist;
  solarSystem.children[7].position.z =
    Math.cos((elapsedTime - 130) / (8 * 84.01)) * planets[6].dist;

  solarSystem.children[8].position.x =
    Math.sin((elapsedTime - 219) / (8 * 164.79)) * planets[7].dist;
  solarSystem.children[8].position.z =
    Math.cos((elapsedTime - 219) / (8 * 164.79)) * planets[7].dist;

  solarSystem.children[9].position.x =
    Math.sin((elapsedTime + 1840) / (8 * 248.59)) * planets[8].dist;
  solarSystem.children[9].position.z =
    Math.cos((elapsedTime + 1840) / (8 * 248.59)) * planets[8].dist;

  // Update controls
  // sphere.position.x = Math.sin(elapsedTime) * 3;
  // sphere.position.z = Math.cos(elapsedTime) * 3;
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
