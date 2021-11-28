import { GLTFLoader } from './Three/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from './Three/three/build/three.module.js'
import {OrbitControls} from './Three/three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from './Three/three/examples/jsm/controls/TransformControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / 1.2, window.innerHeight / 1.2);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

var mixer;
var clock = new THREE.Clock();
var obj;
var slider = document.getElementById("slider");
slider.addEventListener("mousemove", rescaleObj);

addLightToScene(scene, -100, 0, 100);
addLightToScene(scene, 100, 0, 100);
addLightToScene(scene, 100, 0, -100);

//Add a directional light to a scene
function addLightToScene(scene, x, y, z){
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(x, y, z);
    scene.add(light);
}

//Gets the Load Button
window.onload = function() {
    var button = document.getElementById("loadbutton");
    button.onclick = function(){getURL};
    button.addEventListener("click", getURL);
}

//Gets the url currently in the input field and calls the method to load the object
function getURL(){
    var url = document.getElementById("url").value;
    loadObject(url); 
}

const objectControls = new TransformControls(camera, renderer.domElement);

//Uses GTFLoader to load a .gbl object from the given path 
function loadObject(path){
    const loader = new GLTFLoader();

    loader.load( path, function ( glb ) {
	    glb.scene.position.set(0, 0.25, 0); //set initial position of the 3D object in the scene
        scene.add( glb.scene );
        obj = glb;
        rescaleObj();
        if (glb.animations.length > 0){ //if object has animations
            //plays animation
            mixer = new THREE.AnimationMixer( glb.scene );
            console.log( glb.animations );
            mixer.clipAction( glb.animations[ 0 ] ).play();
        }
        //Attach object to TransformControls object in order to be able to move it
        objectControls.attach(glb.scene);
        scene.add(objectControls);
        objectControls.setMode("translate"); 


    }, function(xhr){
        console.log((xhr.loaded/xhr.total * 100) + "% loaded"); //Prints in the console the loading process 
    }, undefined, function ( error ) {

	    console.error( error );

    } );    
}

//Rescale object according to the slider's value
function rescaleObj(){
    if (obj){
        var newScale = parseInt(slider.value) / 50;
        obj.scene.scale.set(newScale, newScale, newScale );
    }
}

//Rendering of the scene
function animate() {
	requestAnimationFrame( animate );
    if ( mixer ) mixer.update( clock.getDelta() );
	renderer.render( scene, camera );
}

animate();
