import * as THREE from './three.js-dev/build/three.module.js';
import { VRButton } from './three.js-dev/examples/jsm/webxr/VRButton.js';
import { OBJLoader } from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { AnaglyphEffect } from './three.js-dev/examples/jsm/effects/AnaglyphEffect.js';
import { XRControllerModelFactory } from './three.js-dev/examples/jsm/webxr/XRControllerModelFactory.js';
import { StereoEffect } from './three.js-dev/examples/jsm/effects/StereoEffect.js';
import { GUI } from './three.js-dev/examples/jsm/libs/dat.gui.module.js';
export function practical2() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    const loader = new THREE.TextureLoader();
    const effect = new AnaglyphEffect(renderer)

    renderer.setSize(window.innerWidth, window.innerHeight);
    const material = new THREE.MeshBasicMaterial({
        map: loader.load('./cage.jpg'),
        //color: 0x31cc02
    })
    let object;

    let uniform = {
        time: { value: 1 }
    };
    const material1 = new THREE.ShaderMaterial({
        uniforms: uniform,
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
    })

    const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let is_key_down = false;
    var mouseX = 0;
    var mouseY = 0;
    scene.add(ambient_light);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.position.x = 5;
    const gui = new GUI();
    const gui_container = gui.addFolder('Morph animations');
    let params = {
        res: 0,

    }
    gui_container.add(params, 'res', 0, 10).step(0.1).onChange(function (value) {
        cube1.scale.z = value;
        cube1.scale.x = value;
        cube1.scale.y = value;
    });
    gui_container.open();
    scene.add(cube1);


    const manager = new THREE.LoadingManager(loadModel);
    const texture_loader = new THREE.TextureLoader(manager);
    const texture = texture_loader.load('./gold.jpg');

    const object_loader = new OBJLoader(manager);
    object_loader.load('./crown.obj', function (obj) {
        object = obj;
    }, onProgress, onError);
    renderer.setAnimationLoop(function () {
        if (!is_key_down) {
            camera.position.x -= (mouseX - camera.position.x) * 0.001;
            camera.position.y += (mouseY - camera.position.y) * 0.001;
            camera.updateProjectionMatrix();


        }
        else {
            mouseX = 0;
            mouseY = 0;

        }
        cube.rotation.x += Math.PI / 180;
        cube.rotation.y += Math.PI / 180;
        cube.rotation.z += Math.PI / 180;
        effect.render(scene, camera)
        //renderer.render(scene, camera)

    });

    document.body.appendChild(renderer.domElement);
    function loadModel() {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material.map = texture;
            }
        })
        object.position.z = -40;

        object.rotation.x = 100;
        scene.add(object);
    }
    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const loading_completed = xhr.loaded / xhr.total / 100;
            console.log('Model ' + Math.round(loading_completed, 2) + '%');
        }
    }

    function onError(err) {
        console.log(err);
    }
   
    window.addEventListener("keydown", function (event) {
        let keyCode = event.which;
        let delta = 0.08;
        let rot = 10;
        if (keyCode == 65) {
            cube.position.x -= delta;
        }

        if (keyCode == 83) {
            cube.position.y -= delta;
        }

        if (keyCode == 68) {
            cube.position.x += delta;
        }

        if (keyCode == 87) {
            cube.position.y += delta;
        }
        //r to rotate the crown
        if (keyCode == 82) {

            object.rotation.y += rot;
        }
        is_key_down = true;
    })

    window.addEventListener("mousemove", function (event) {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);



    })

    window.addEventListener("click", function (event) {
        if (!is_key_down) {
            is_key_down = true;
        }
        else {
            is_key_down = false;
        }

    })

}