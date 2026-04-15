import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

let scene, camera, renderer, pikachuModel, mixer;
let timer = new Timer();
let animations = {};
let currentAction;
let maxHappiness = 10;
function init3D() {

  //window size
  const SIZE = 500;

  // set up scene
  scene = new THREE.Scene();

 //set up camera
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  camera.position.z = 2;
  camera.position.y = 1;
  camera.lookAt(0, 1, 0);

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(SIZE, SIZE);
  document.getElementById('pet-canvas-container').appendChild(renderer.domElement);


  //lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xeac8ca, 2);
  scene.add(ambientLight);
  scene.background = new THREE.Color(0xf9e4ec);


  //load model (GLB format)
  const loader = new GLTFLoader();
  loader.load('pikachu/source/pikachu2.glb', (gltf) => {
    pikachuModel = gltf.scene;
    scene.add(pikachuModel);

    mixer = new THREE.AnimationMixer(pikachuModel);

    //setting actions for each animation in the model
    animations = {
      walk: mixer.clipAction(gltf.animations[0]),
      dance: mixer.clipAction(gltf.animations[1]),
      jump: mixer.clipAction(gltf.animations[2]),
      idle: mixer.clipAction(gltf.animations[3])
    };

    animations.jump.setLoop(THREE.LoopRepeat, 2);

    mixer.addEventListener('finished', () => {
      switchAnimation(animations.idle);
    });

    currentAction = animations.idle;
    currentAction.play();

   /* if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(pikachuModel);
      mixer.clipAction(gltf.animations[3]).play();
      //0 walk
      //1 dance
      //2 jump
      //3 idle
    }*/

  });

  animate();

}

function animate()
{
  requestAnimationFrame(animate);
  timer.update();

  if (mixer) {
    mixer.update(timer.getDelta());
  }
  renderer.render(scene, camera);
}

function switchAnimation(newAction)
{
  if (!currentAction || currentAction === newAction) return;

   currentAction.fadeOut(0.5);
   newAction.reset().fadeIn(0.5).play();

   //update tracker of current action
   currentAction = newAction;
}



//variable to hold pet information (name, weight, happiness, sleep state)
var pikachu_info = {name:"Pikachu", weight:10, happiness:5, sleep:false};



$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

init3D();

    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').on('click', clickedTreatButton);
    $('.play-button').on('click', clickedPlayButton);
    $('.exercise-button').on('click', clickedExerciseButton);
    $('.sleep-button').on('click', clickedSleepButton);

  });
    
  
    function clickedTreatButton() {
      // Increase pet happiness
      pikachu_info['happiness'] += 1;
      // Increase pet weight
      pikachu_info['weight'] += 1;
      switchAnimation(animations.jump);
      showMessage("pika - pika! (˶>⩊<˶)");
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedPlayButton() {
      // Increase pet happiness
      pikachu_info['happiness'] += 1;
      // Decrease pet weight
      pikachu_info['weight'] -= 1;
      switchAnimation(animations.jump)
      showMessage("pika - pika! (˶>⩊<˶)");
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedExerciseButton() {
      // Decrease pet happiness
      pikachu_info['happiness'] -= 1;
      // Decrease pet weight
      pikachu_info['weight'] -= 1;
      switchAnimation(animations.walk);
      showMessage(".·°՞(っ-ᯅ-ς)՞°·.");
      checkAndUpdatePetInfoInHtml();
    }
  
    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessBeforeUpdating();  
      updatePetInfoInHtml();
    }
    
    function clickedSleepButton() {
      // Toggle sleep state
     if (pikachu_info['sleep'] == true) return;
      pikachu_info['sleep'] = true;
      switchAnimation(animations.idle);
      showMessage(" ᶻ 𝘇 𐰁 (っ. -｡)");
      setTimeout(() => {
        pikachu_info['sleep'] = false;
        switchAnimation(animations.jump);
        showMessage("pika - pika! (˶>⩊<˶)");
      }, 5000); 
    }


function checkWeightAndHappinessBeforeUpdating()
{
if (pikachu_info['weight'] < 0) pikachu_info['weight'] = 0;
if (pikachu_info['happiness'] < 0) pikachu_info['happiness'] = 0;

if (pikachu_info['happiness'] >= maxHappiness)
    {pikachu_info['happiness'] = maxHappiness;
      switchAnimation(animations.dance);}
}
    
// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml()
 {
      $('.name').text(pikachu_info['name']);
      $('.weight').text(pikachu_info['weight']);
      $('.happiness').text(pikachu_info['happiness']);
      $('.sleep').text(pikachu_info['sleep'] ? "Sleeping" : "Awake");
}

function showMessage(message)
{
  $('#message').finish().text(message).fadeIn(500).fadeOut(2000);
}