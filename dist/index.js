import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
//import { OrbitControls } from "https://unpkg.com/three-orbitcontrols@2.110.3/OrbitControls.js;

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(30, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./img/sun.jpg"),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 110);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

function animate() {
  sun.rotateY(0.004);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
