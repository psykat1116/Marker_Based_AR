const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let ArToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
});

ArToolkitSource.init(() => {
  setTimeout(() => {
    ArToolkitSource.onResizeElement();
    ArToolkitSource.copyElementSizeTo(renderer.domElement);
  }, 2000);
});

let ArToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: "camera_para.dat",
  detectionMode: "color_and_matrix",
});

ArToolkitContext.init(() => {
  camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
});

let ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera, {
  type: "pattern",
  patternUrl: "pattern-JGEC.patt",
  changeMatrixMode: "cameraTransformMatrix",
});

scene.visible = false;

const geometry = new THREE.CubeGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = geometry.parameters.height / 2;
scene.add(cube);

// camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  ArToolkitContext.update(ArToolkitSource.domElement);
  scene.visible = camera.visible;
  renderer.render(scene, camera);
}

animate();
