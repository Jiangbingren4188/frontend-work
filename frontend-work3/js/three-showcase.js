const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10131f);
scene.fog = new THREE.Fog(0x10131f, 8, 20);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const dir = new THREE.DirectionalLight(0xffe8b0, 0.85);
dir.position.set(3, 6, 4);
scene.add(dir);

const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(2.4, 2.6, 0.3, 48),
  new THREE.MeshStandardMaterial({ color: 0x3a3527, metalness: 0.3, roughness: 0.6 })
);
stage.position.y = -0.15;
scene.add(stage);

const deckRing = new THREE.Mesh(
  new THREE.TorusGeometry(2.45, 0.03, 12, 64),
  new THREE.MeshStandardMaterial({ color: 0xc8a24d, metalness: 0.7, roughness: 0.3 })
);
deckRing.rotation.x = Math.PI / 2;
deckRing.position.y = 0.02;
scene.add(deckRing);

const items = new THREE.Group();
const exhibits = [
  {
    geo: new THREE.BoxGeometry(0.75, 0.75, 0.75),
    color: 0xc8a24d,
    float: false
  },
  {
    geo: new THREE.SphereGeometry(0.45, 32, 32),
    color: 0x4fc3f7,
    float: true
  },
  {
    geo: new THREE.TorusGeometry(0.42, 0.16, 16, 48),
    color: 0xef5350,
    float: false
  },
  {
    geo: new THREE.CylinderGeometry(0.28, 0.34, 0.85, 32),
    color: 0xb0a98c,
    float: false
  }
];
const orbitRadius = 1.55;
const baseY = 0.6;
exhibits.forEach(function (item, i) {
  const angle = (i / exhibits.length) * Math.PI * 2;
  const mesh = new THREE.Mesh(
    item.geo,
    new THREE.MeshStandardMaterial({ color: item.color, metalness: 0.35, roughness: 0.45 })
  );
  mesh.position.set(Math.cos(angle) * orbitRadius, baseY, Math.sin(angle) * orbitRadius);
  mesh.userData.baseY = baseY;
  mesh.userData.float = item.float;
  mesh.userData.spin = item.float ? 0.01 : 0;
  items.add(mesh);
});
scene.add(items);

let clock = 0;
const animate = function () {
  requestAnimationFrame(animate);
  clock += 0.02;
  items.rotation.y += 0.005;
  items.children.forEach(function (mesh) {
    if (mesh.userData.spin) {
      mesh.rotation.y += mesh.userData.spin;
    }
    if (mesh.userData.float) {
      mesh.position.y = mesh.userData.baseY + Math.sin(clock) * 0.12;
    }
  });
  renderer.render(scene, camera);
};
animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
