import "./destyle.css";
import "./style.css";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

import countries from "./jsons/custom.geo.json";
import lines from "./jsons/lines.json";
import map from "./jsons/map.json";

/* =================================================
   Scene
=================================================== */
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x535ef3, 100, 2000);

/* =================================================
   Camera
=================================================== */
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.z = 200;

/* =================================================
   Renderer
=================================================== */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

/* =================================================
   Controlls
=================================================== */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // ダンピング効果を有効にする
controls.dampingFactor = 0.05; // ダンピングの係数

/* =================================================
   Object
=================================================== */
// SphereGeometryで作成したオブジェクト
const earthGeometry = new THREE.SphereGeometry(15, 32, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  color: 0x732bff,
  metalness: 0.5,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// scene.add(earth);

// ShaderMaterialで作成したオブジェクト
const earthShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    directionalLightDirection: { value: new THREE.Vector3(-0.5, 1.0, 1.0) },
    directionalLightColor: { value: new THREE.Color(0x8a2be2) },
    ambientLightColor: { value: new THREE.Color(0x8a2be2) },
    ambientLightIntensity: { value: 0.5 },
  },
});
const earthShader = new THREE.Mesh(earthGeometry, earthShaderMaterial);

// scene.add(earthShader);

// Globeで作成したオブジェクト
const Globe = new ThreeGlobe({
  waitForGlobeReady: true,
  animateIn: true,
})

  .hexPolygonsData(countries.features)
  .hexPolygonResolution(3)
  .hexPolygonMargin(0.7)
  .showAtmosphere(true)
  .atmosphereColor("#2f05ff")
  .atmosphereAltitude(0.3);

console.log(lines.pulls);

setTimeout(() => {
  Globe.arcsData([...lines.pulls, ...lines.pushes])
    .arcColor((e) => {
      return e.type === "push" ? "#00AAEE" : e.status ? "#9cff00" : "#ff4000";
    })
    .arcAltitude((e) => {
      return e.arcAlt;
    })
    .arcStroke((e) => {
      return e.status ? 0.5 : 0.3;
    })
    .arcDashLength(0.9)
    .arcDashGap(4)
    .arcDashAnimateTime(1000)
    .arcsTransitionDuration(500)
    .arcDashInitialGap((e) => e.order * 1)
    .labelsData(map.maps)
    .labelColor(() => "#ffcb21")

    .labelDotRadius(0.3)
    .labelSize((e) => e.size)
    .labelText("city")
    .labelResolution(6)
    .labelAltitude(0.01)
    .pointsData(map.maps)
    .pointsMerge(true)
    .pointAltitude(0.07)
    .pointRadius(0.1);
});

Globe.rotateY(2);
const globeMaterial = Globe.globeMaterial();
globeMaterial.color = new THREE.Color(0x3a228a);
globeMaterial.emissive = new THREE.Color(0x220038);
globeMaterial.emissiveIntensity = 2;
globeMaterial.shininess = 1;

scene.add(Globe);

/* =================================================
   Light
=================================================== */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(directionalLight, ambientLight);

/* =================================================
   Resize
=================================================== */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

/* =================================================
   Animate
=================================================== */
const animate = () => {
  Globe.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
