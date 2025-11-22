import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 2, 6);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTING
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 10, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// FLOOR
const floorTex = new THREE.TextureLoader().load("/public/assets/rink-floor.jpg");
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(4, 4);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ map: floorTex })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// WALLS + ARTWORK
const wallTex = new THREE.TextureLoader().load("/public/assets/whitewall.jpg");
const wallMat = new THREE.MeshStandardMaterial({ map: wallTex });

function addWallWithArt(
  artFile: string,
  x: number,
  y: number,
  z: number,
  rotY: number
) {
  const artTex = new THREE.TextureLoader().load(`/public/assets/${artFile}`);
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ map: artTex })
  );
  art.position.set(x, y, z);
  art.rotation.y = rotY;
  scene.add(art);
}

addWallWithArt("king McDavid Baswuit.jpg", -4, 2, 0, Math.PI / 2);
addWallWithArt("mess and subban and hats.jpg", 4, 2, 0, -Math.PI / 2);
addWallWithArt("pasta billboard.jpeg", 0, 2, -4, 0);
addWallWithArt("sway for printful mockup.jpeg", 0, 2, 4, Math.PI);
addWallWithArt("pasta sez beer.png", -2, 2, -4, 0);

// CENTER GLB
const loader = new GLTFLoader();
loader.load("/public/assets/habs.glb", (gltf) => {
  const model = gltf.scene;
  model.position.set(0, 0, 0);
  model.scale.set(1.2, 1.2, 1.2);
  scene.add(model);
});

// RESPONSIVENESS
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LOOP
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
