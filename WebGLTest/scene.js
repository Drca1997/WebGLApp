import { GLTFLoader } from './Three/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from './Three/three/build/three.module.js'
import {OrbitControls} from './Three/three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from './Three/three/examples/jsm/controls/TransformControls.js';

const scene = new THREE.Scene();
let mixer;
let clips;
var clock = new THREE.Clock();
scene.background = new THREE.Color(0xdddddd);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth / 1.2, window.innerHeight / 1.2);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

var raycaster = new THREE.Raycaster();

var obj;
var slider = document.getElementById("slider");
var selected = false;

slider.addEventListener("mousemove", rescaleObj);


addLightToScene(scene, -100, 0, 100);
addLightToScene(scene, 100, 0, 100);
addLightToScene(scene, 100, 0, -100);


function addLightToScene(scene, x, y, z){
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(x, y, z);
    scene.add(light);
}

function getURL(){
    var url = document.getElementById("url").value;
    loadObject(url); 
}


const objectControls = new TransformControls(camera, renderer.domElement);

function render(){
    renderer.render(scene, camera);
}

function loadObject(path){
    const loader = new GLTFLoader();

    loader.load( path, function ( glb ) {
        console.log(glb.scene);
	    glb.scene.position.set(0, 0.25, 0);
        scene.add( glb.scene );
        obj = glb;
        rescaleObj();
        if (glb.animations.length > 0){
             //Playing Animation
            mixer = new THREE.AnimationMixer( glb.scene );
            console.log( glb.animations );
            mixer.clipAction( glb.animations[ 0 ] ).play();
        }
        objectControls.attach(glb.scene);
        scene.add(objectControls);
        objectControls.setMode("translate");


    }, function(xhr){
        console.log((xhr.loaded/xhr.total * 100) + "% loaded");
    }, undefined, function ( error ) {

	    console.error( error );

    } );    
}


function rescaleObj(){
    if (obj){
        var newScale = parseInt(slider.value) / 50;
        obj.scene.scale.set(newScale, newScale, newScale );
    }
}


window.onload = function() {
    var button = document.getElementById("loadbutton");
    console.log(button);
    button.onclick = function(){getURL};
    button.addEventListener("click", getURL);
}


function animate() {
	requestAnimationFrame( animate );
    if ( mixer ) mixer.update( clock.getDelta() );
	renderer.render( scene, camera );
}

animate();
