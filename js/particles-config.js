// Default, calm, interactive state for particles
const particlesLightConfig = {
    "particles": {
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#2A2927" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.3, "random": false, "anim": { "enable": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#2A2927", "opacity": 0.2, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "window",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }, "push": { "particles_nb": 4 } }
    },
    "retina_detect": true
};

const particlesDarkConfig = {
    "particles": {
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#FBBF24" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.4, "random": false, "anim": { "enable": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#E2E0DB", "opacity": 0.1, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "window",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } }, "push": { "particles_nb": 4 } }
    },
    "retina_detect": true
};

// A separate configuration for the "explosion" effect
const particlesExplosionConfig = {
    light: {
        "particles": {
            "number": { "value": 0 }, // Start with 0 particles
            "color": { "value": "#D97706" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.8, "random": true, "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 4, "random": true, "anim": { "enable": true, "speed": 20, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 15, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } },
        "retina_detect": true
    },
    dark: {
        "particles": {
            "number": { "value": 0 },
            "color": { "value": "#FBBF24" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.8, "random": true, "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 4, "random": true, "anim": { "enable": true, "speed": 20, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 15, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } },
        "retina_detect": true
    }
};