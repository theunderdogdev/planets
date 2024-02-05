import {
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  WebGLRenderer,
  PointLightHelper,
  PointLight,
  AmbientLight,
  PCFSoftShadowMap
} from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SolarSystem } from "./planets";
export function initVisual(canvas) {
  if (!canvas) {
    return;
  }
  const gui = new GUI();
  const dims = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new PerspectiveCamera(
    75,
    dims.width / dims.height,
    0.1,
    10000
  );
  camera.position.x = 0;
  camera.position.y = 10;
  camera.position.z = 15;

  window.addEventListener("resize", () => {
    dims.width = window.innerWidth;
    dims.height = window.innerHeight;
    camera.aspect = dims.width / dims.height;
    camera.updateProjectionMatrix();
    renderer.setSize(dims.width, dims.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  const scene = new Scene();
  const solarSys = new SolarSystem();
  solarSys.addPlanet({
    name: 'earth',
    radius: 0.5,
    distFromSun: 8,
    period: 0.8,
    texturePath: './assets/earth.jpg'
  })
  scene.add(solarSys.getPlanets());

  const ambLight = new AmbientLight(0xffffff, 1);
  const pointLight = new PointLight(0xffffff, 1);
  const plHelp = new PointLightHelper(pointLight, 5)
  pointLight.castShadow = true;
  gui.add(ambLight, "intensity", 0, 3, 0.0001);
  gui.add(pointLight.position ,"x", 0, 50,1);
  gui.add(pointLight.position ,"y", 0, 50,1);
  gui.add(pointLight.position ,"z", 0, 50,1);
  scene.add(ambLight);
  scene.add(pointLight, plHelp);
  const planeGeom = new PlaneGeometry(10, 10);
  const plane = new Mesh(planeGeom, new MeshBasicMaterial());
  plane.position.set(15, 0, 0);
  plane.rotation.set(30, 11, 10)
  gui.add(plane.position, 'x', 0, 50, 1);
  gui.add(plane.position, 'y', 0, 50, 1);
  gui.add(plane.position, 'z', 0, 50, 1);
  gui.add(plane.rotation, 'x', 0, 360, 1)
  gui.add(plane.rotation, 'y', 0, 360, 1)
  gui.add(plane.rotation, 'z', 0, 360, 1)
  plane.castShadow
  scene.add(plane)
  const orbitCtrl = new OrbitControls(camera, canvas);
  orbitCtrl.enableDamping = true;

  const renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setSize(dims.width, dims.height);
  renderer.render(scene, camera);
  const framer = () => {
    orbitCtrl.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(framer);
  };
  framer();
}
