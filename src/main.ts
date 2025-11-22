import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// ----------------------------
// CAMERA
// ----------------------------
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 2, 8);

// ----------------------------
// RENDERER
// ----------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// ----------------------------
// LIGHTING (this was missing)
// ----------------------------
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 2);
dir.position.set(5, 10, 5);
scene.add(dir);

// ----------------------------
// CONTROLS
// ----------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// ----------------------------
// ROOM GEOMETRY (not black anymore)
// ----------------------------
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  side: THREE.BackSide
});

const room = new THREE.Mesh(
  new THREE.BoxGeometry(20, 10, 20),
  wallMaterial
);
scene.add(room);

// ----------------------------
// ADD YOUR ARTWORK PLANES
// ----------------------------
function addImage(path: string, x: number, y: number, z: number) {
  const tex = new THREE.TextureLoader().load(path);
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const geo = new THREE.PlaneGeometry(3, 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}

// your images (already in public/assets/)
addImage("/public/assets/king-mcdavid-basquait.jpg", -5, 2, -8);
addImage("/public/assets/mess-and-subban-and-hats.jpg", 0, 2, -8);
addImage("/public/assets/pasta-sez-beer.png", 5, 2, -8);

// ----------------------------
// LOAD GLB MODEL
// ----------------------------
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("/public/assets/habs.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(0, 0, -3);
  model.scale.set(3, 3, 3);
  scene.add(model);
});

// ----------------------------
// MOVEMENT CONTROLS (WASD)
// ----------------------------
const keys: any = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function moveCamera() {
  const speed = 0.1;

  if (keys["w"] || keys["ArrowUp"]) camera.position.z -= speed;
  if (keys["s"] || keys["ArrowDown"]) camera.position.z += speed;
  if (keys["a"] || keys["ArrowLeft"]) camera.position.x -= speed;
  if (keys["d"] || keys["ArrowRight"]) camera.position.x += speed;
}

// ----------------------------
// ANIMATION LOOP
// ----------------------------
function animate() {
  requestAnimationFrame(animate);
  moveCamera();
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ----------------------------
// RESIZE FIX
// ----------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
