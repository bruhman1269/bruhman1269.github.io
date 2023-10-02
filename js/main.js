import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let dt = 3;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();
const container = document.getElementById("container3D");

//Load the file
loader.load(
  "crucifix.gltf",
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.scale.x = 10;
    object.scale.y = 10;
    object.scale.z = 10;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);

//Add the renderer to the DOM
container.appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(randomHex(), 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const bottomLight = new THREE.DirectionalLight(randomHex(), 1); // (color, intensity)
bottomLight.position.set(500, -500, 500) //top-left-ish
bottomLight.castShadow = true;
scene.add(bottomLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    object.rotation.y = lerp(object.rotation.y, -3 + mouseX / window.innerWidth * 3, 0.1);
    object.rotation.x = lerp(object.rotation.x, -1.2 + mouseY * 2.5 / window.innerHeight, 0.1);
    //object.rotation.x = clamp(object.rotation.x, -1.2, 1.6);
    //object.rotation.y = clamp(object.rotation.y, -3, 0)
    //document.getElementById("output").innerText = object.rotation.y.toString();
  }
  renderer.render(scene, camera);
}


//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}


function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
};


function randomHex() {
  return Math.random() * 16777215;
}


//Start the 3D rendering
window.addEventListener("resize", function() {
  camera.updateProjectionMatrix(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer.setSize(window.innerWidth - 20, window.innerHeight - 20)
})
animate();