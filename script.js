import * as THREE from "three";


/* =========================================
   BASIC SETUP
========================================= */

const container =
    document.getElementById("earth");


const scene =
    new THREE.Scene();


const camera =
    new THREE.PerspectiveCamera(
        38,
        container.clientWidth /
        container.clientHeight,
        0.1,
        100
    );


camera.position.z = 3.2;


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });


renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


renderer.setSize(
    container.clientWidth,
    container.clientHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


container.appendChild(renderer.domElement);


/* =========================================
   EARTH
========================================= */

const loader =
    new THREE.TextureLoader();


const earthTexture =
    loader.load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );


earthTexture.colorSpace =
    THREE.SRGBColorSpace;


const earthGeometry =
    new THREE.SphereGeometry(
        1,
        96,
        96
    );


const earthMaterial =
    new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 8
    });


const earth =
    new THREE.Mesh(
        earthGeometry,
        earthMaterial
    );


scene.add(earth);


/* =========================================
   EARTH LIGHTING
========================================= */

const ambientLight =
    new THREE.AmbientLight(
        0x6688aa,
        1.4
    );


scene.add(ambientLight);


const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );


sunLight.position.set(
    4,
    2,
    5
);


scene.add(sunLight);


/* =========================================
   ATMOSPHERE
========================================= */

const atmosphereGeometry =
    new THREE.SphereGeometry(
        1.045,
        96,
        96
    );


const atmosphereMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x4da3ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
    });


const atmosphere =
    new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );


scene.add(atmosphere);


/* =========================================
   MOUSE MOVEMENT
========================================= */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;


document.addEventListener(
    "mousemove",
    (event) => {

        targetX =
            (event.clientX /
            window.innerWidth - 0.5)
            * 0.35;


        targetY =
            (event.clientY /
            window.innerHeight - 0.5)
            * 0.22;
    }
);


/* =========================================
   SMOOTH ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    /*
       VERY SLOW EARTH ROTATION
    */

    earth.rotation.y += 0.0008;


    /*
       Smooth cursor movement
    */

    currentX +=
        (targetX - currentX) * 0.035;


    currentY +=
        (targetY - currentY) * 0.035;


    /*
       Cursor makes Earth
       slightly tilt
    */

    earth.rotation.y +=
        currentX * 0.002;


    earth.rotation.x =
        currentY;


    /*
       Atmosphere follows Earth
    */

    atmosphere.rotation.x =
        earth.rotation.x;

    atmosphere.rotation.y =
        earth.rotation.y;


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );
    }
);
