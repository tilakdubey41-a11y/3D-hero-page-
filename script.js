/* =========================================
   PHORCYSTY 3D EARTH
========================================= */

const container =
    document.getElementById("earth-container");


/* -----------------------------------------
   SCENE
----------------------------------------- */

const scene =
    new THREE.Scene();


/* -----------------------------------------
   CAMERA
----------------------------------------- */

const camera =
    new THREE.PerspectiveCamera(
        45,
        container.clientWidth /
        container.clientHeight,
        0.1,
        100
    );

camera.position.z = 3;


/* -----------------------------------------
   RENDERER
----------------------------------------- */

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

renderer.outputEncoding =
    THREE.sRGBEncoding;

container.appendChild(renderer.domElement);


/* -----------------------------------------
   EARTH
----------------------------------------- */

const earthGeometry =
    new THREE.SphereGeometry(
        1.25,
        96,
        96
    );


const earthTexture =
    new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );


const earthNormal =
    new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    );


const earthSpecular =
    new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
    );


const earthMaterial =
    new THREE.MeshPhongMaterial({

        map: earthTexture,

        normalMap: earthNormal,

        specularMap: earthSpecular,

        specular:
            new THREE.Color(
                0x333333
            ),

        shininess: 12

    });


const earth =
    new THREE.Mesh(
        earthGeometry,
        earthMaterial
    );


scene.add(earth);


/* =========================================
   CLOUDS
========================================= */

const cloudGeometry =
    new THREE.SphereGeometry(
        1.265,
        96,
        96
    );


const cloudTexture =
    new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
    );


const cloudMaterial =
    new THREE.MeshPhongMaterial({

        map: cloudTexture,

        transparent: true,

        opacity: 0.35,

        depthWrite: false

    });


const clouds =
    new THREE.Mesh(
        cloudGeometry,
        cloudMaterial
    );


scene.add(clouds);


/* =========================================
   LIGHTING
========================================= */

const ambientLight =
    new THREE.AmbientLight(
        0x7898ff,
        0.35
    );

scene.add(ambientLight);


const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

sunLight.position.set(
    5,
    2,
    5
);

scene.add(sunLight);


/* =========================================
   ATMOSPHERE
========================================= */

const atmosphereGeometry =
    new THREE.SphereGeometry(
        1.30,
        96,
        96
    );


const atmosphereMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x4595ff,

        transparent: true,

        opacity: 0.13,

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

        const normalizedX =
            event.clientX /
            window.innerWidth -
            0.5;

        const normalizedY =
            event.clientY /
            window.innerHeight -
            0.5;


        targetY =
            normalizedX * 0.35;


        targetX =
            normalizedY * 0.18;

    }
);


/* =========================================
   RESIZE
========================================= */

function resizeEarth() {

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


window.addEventListener(
    "resize",
    resizeEarth
);


/* =========================================
   ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    /* Slow Earth rotation */

    earth.rotation.y +=
        0.0008;


    /* Clouds slightly faster */

    clouds.rotation.y +=
        0.0011;


    /* Smooth mouse movement */

    currentX +=
        (targetX - currentX) *
        0.035;


    currentY +=
        (targetY - currentY) *
        0.035;


    earth.rotation.x =
        currentX;


    earth.rotation.z =
        currentY;


    clouds.rotation.x =
        currentX;


    clouds.rotation.z =
        currentY;


    atmosphere.rotation.x =
        currentX;


    atmosphere.rotation.z =
        currentY;


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================
   TOOL CARD INTERACTION
========================================= */

const cards =
    document.querySelectorAll(
        ".tool-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            cards.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            card.classList.add(
                "active"
            );

        }
    );

});
