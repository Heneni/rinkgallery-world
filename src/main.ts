import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadingEl = document.getElementById("loading");

const canvas = document.getElementById("app") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.8, 10);
camera.lookAt(0, 1.5, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5, 10, 5);
scene.add(dir);

// Rink floor
const floorGeom = new THREE.PlaneGeometry(20, 30);
const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeom, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Simple boards (walls)
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });

const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 5),
  wallMat
);
backWall.position.set(0, 2.5, -12);
scene.add(backWall);

const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 5),
  wallMat
);
leftWall.position.set(-10, 2.5, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 5),
  wallMat
);
rightWall.position.set(10, 2.5, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

const texLoader = new THREE.TextureLoader();

function addArt(texturePath: string, position: THREE.Vector3, w = 4, h = 3) {
  const tex = texLoader.load(texturePath);
  tex.colorSpace = THREE.SRGBColorSpace;

  const geom = new THREE.PlaneGeometry(w, h);
  const mat = new THREE.MeshStandardMaterial({ map: tex });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(position);
  scene.add(mesh);

  const frameGeom = new THREE.PlaneGeometry(w * 1.04, h * 1.04);
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const frame = new THREE.Mesh(frameGeom, frameMat);
  frame.position.copy(position);
  frame.position.z -= 0.01;
  scene.add(frame);
}

// Artwork panels using local assets
addArt("/assets/pasta-billboard.jpeg", new THREE.Vector3(-6, 2.5, -11));
addArt("/assets/mess-and-subban-and-hats.jpg", new THREE.Vector3(0, 2.5, -11));
addArt("/assets/sway-for-printful-mockup.jpeg", new THREE.Vector3(6, 2.5, -11));

// Side walls art
addArt("/assets/king-mcdavid-baswuit.jpg", new THREE.Vector3(-9.9, 2.5, -4), 3, 2.5);
addArt("/assets/pasta-sez-beer.png", new THREE.Vector3(9.9, 2.5, -4), 3, 2.5);

const gltfLoader = new GLTFLoader();

function loadCenterModel(path: string) {
  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, -4);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);
      if (loadingEl) loadingEl.classList.add("hidden");
    },
    undefined,
    (err) => {
      console.error("Error loading GLB:", err);
      if (loadingEl) loadingEl.textContent = "Error loading 3D model";
    }
  );
}

// Try habs first
loadCenterModel("/assets/habs.glb");

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
