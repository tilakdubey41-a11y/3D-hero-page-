import * as THREE from "three";


/* =========================================
   BASIC SETUP
========================================= */

const container =
    document.getElementById("earth-container");

const scene =
    new THREE.Scene();


/* =========================================
   CAMERA
========================================= */

const camera =
    new THREE.PerspectiveCamera(
        42,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

camera.position.z = 5.2;


/* =========================================
   RENDERER
========================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.05;

container.appendChild(
    renderer.domElement
);


/* =========================================
   EARTH GROUP
========================================= */

const earthGroup =
    new THREE.Group();

scene.add(earthGroup);


/* =========================================
   EARTH TEXTURES
========================================= */

const loader =
    new THREE.TextureLoader();

const earthTexture =
    loader.load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );

const earthNormal =
    loader.load(
        "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    );

const earthSpecular =
    loader.load(
        "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
    );


/* =========================================
   EARTH
========================================= */

const earthGeometry =
    new THREE.SphereGeometry(
        1.65,
        96,
        96
    );

const earthMaterial =
    new THREE.MeshPhongMaterial({

        map: earthTexture,

        normalMap: earthNormal,

        specularMap: earthSpecular,

        specular:
            new THREE.Color(0x222222),

        shininess: 8
    });


const earth =
    new THREE.Mesh(
        earthGeometry,
        earthMaterial
    );


earthGroup.add(earth);


/* =========================================
   ATMOSPHERE
========================================= */

const atmosphereGeometry =
    new THREE.SphereGeometry(
        1.72,
        96,
        96
    );


const atmosphereMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x3f9cff,

        transparent: true,

        opacity: 0.09,

        side: THREE.BackSide
    });


const atmosphere =
    new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );


earthGroup.add(atmosphere);


/* =========================================
   LIGHTING
========================================= */

const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        3.2
    );


sunLight.position.set(
    -4,
    2,
    5
);

scene.add(sunLight);


const blueLight =
    new THREE.PointLight(
        0x2f75ff,
        1.2,
        10
    );


blueLight.position.set(
    3,
    -2,
    -3
);

scene.add(blueLight);


const ambientLight =
    new THREE.AmbientLight(
        0x304060,
        0.28
    );

scene.add(ambientLight);


/* =========================================
   MOUSE CONTROL
========================================= */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;


document.addEventListener(
    "mousemove",
    (event) => {

        /*
         * Mouse position:
         * -1 to +1
         */

        targetX =
            (event.clientX /
            window.innerWidth - 0.5);

        targetY =
            (event.clientY /
            window.innerHeight - 0.5);

    }
);


/* =========================================
   ANIMATION
========================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /*
     * VERY SLOW EARTH ROTATION
     *
     * Small value = slower
     */

    earth.rotation.y += 0.00055;


    /*
     * Smooth mouse inertia
     */

    currentX +=
        (targetX - currentX) * 0.025;

    currentY +=
        (targetY - currentY) * 0.025;


    /*
     * Mouse movement affects
     * Earth smoothly
     */

    earthGroup.rotation.y =
        currentX * 0.18;

    earthGroup.rotation.x =
        -currentY * 0.10;


    /*
     * Very subtle floating motion
     */

    earthGroup.position.y =
        Math.sin(time * 0.35) * 0.025;


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================
   RESPONSIVE
========================================= */

function resize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


window.addEventListener(
    "resize",
    resize
);
