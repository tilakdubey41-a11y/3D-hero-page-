/* ==========================================
   PHORCYSTY COLOR TRANSFER
   3D INTERACTION + BEFORE/AFTER SLIDER
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const comparisonSlider =
    document.getElementById("comparisonSlider");

const beforeLayer =
    document.querySelector(".before-layer");

const sliderLine =
    document.querySelector(".slider-line");

const comparisonCard =
    document.getElementById("comparisonCard");

const references =
    document.querySelectorAll(".reference");

const afterImage =
    document.querySelector(".after-image");


/* ==========================================
   BEFORE / AFTER SLIDER
========================================== */

function updateComparison() {

    if (!comparisonSlider) return;

    const value =
        comparisonSlider.value;

    beforeLayer.style.width =
        `${value}%`;

    sliderLine.style.left =
        `${value}%`;
}


/* Initial position */

updateComparison();


/* Slider movement */

comparisonSlider.addEventListener(
    "input",
    updateComparison
);


/* ==========================================
   COLOR REFERENCE SYSTEM
========================================== */

const filters = {

    warm: `
        saturate(1.45)
        contrast(1.08)
        sepia(.18)
        brightness(1.04)
    `,

    blue: `
        hue-rotate(35deg)
        saturate(1.35)
        contrast(1.08)
        brightness(.98)
    `,

    purple: `
        hue-rotate(285deg)
        saturate(1.4)
        contrast(1.1)
        brightness(.95)
    `
};


/* ==========================================
   REFERENCE CLICK
========================================== */

references.forEach(reference => {

    reference.addEventListener(
        "click",
        () => {

            /* Remove active */

            references.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            /* Activate selected */

            reference.classList.add(
                "active"
            );


            /* Get selected color */

            const selectedFilter =
                reference.dataset.filter;


            /* Apply color */

            if (
                filters[selectedFilter]
            ) {

                afterImage.style.filter =
                    filters[selectedFilter];

            }


            /* Small animation */

            afterImage.animate(
                [
                    {
                        transform:
                            "scale(1.025)"
                    },

                    {
                        transform:
                            "scale(1)"
                    }
                ],
                {
                    duration: 450,
                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }
            );

        }
    );

});


/* ==========================================
   3D COMPARISON CARD TILT
========================================== */

if (comparisonCard) {

    comparisonCard.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                comparisonCard.getBoundingClientRect();


            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateY =
                ((mouseX - centerX) /
                centerX) * 5;


            const rotateX =
                -((mouseY - centerY) /
                centerY) * 4;


            comparisonCard.style.transform =
                `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
                scale(1.008)
                `;
        }
    );


    comparisonCard.addEventListener(
        "mouseleave",
        () => {

            comparisonCard.style.transform =
                `
                perspective(1200px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
                scale(1)
                `;
        }
    );
}


/* ==========================================
   REFERENCE 3D TILT
========================================== */

references.forEach(card => {

    card.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                ((x - rect.width / 2) /
                rect.width) * 7;


            const rotateX =
                -((y - rect.height / 2) /
                rect.height) * 6;


            card.style.transform =
                `
                perspective(700px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
                scale(1.035)
                `;
        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            if (
                card.classList.contains("active")
            ) {

                card.style.transform =
                    "translateZ(0)";

            } else {

                card.style.transform =
                    "translateZ(0)";

            }
        }
    );

});


/* ==========================================
   BUTTON MICRO INTERACTION
========================================== */

const tryButton =
    document.querySelector(".try-button");


if (tryButton) {

    tryButton.addEventListener(
        "click",
        () => {

            document
                .querySelector(".comparison-area")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }
    );

}


/* ==========================================
   TOUCH SUPPORT
========================================== */

let touchStartX = 0;

comparisonSlider.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


/* ==========================================
   CONSOLE CHECK
========================================== */

console.log(
    "Phorcysty Color Transfer loaded successfully."
);
