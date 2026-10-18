"use strict";

/* =========================================================
   RIJAN SHRESTHA — CYBERPUNK PORTFOLIO ENGINE
   ========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const finePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

/* ---------- PRELOADER ---------- */

window.addEventListener("load", () => {
  window.setTimeout(() => {
    $("#preloader")?.classList.add("loaded");
  }, reduceMotion ? 0 : 800);
});

/* ---------- FOOTER YEAR ---------- */

const yearElement = $("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* ---------- MOBILE NAVIGATION ---------- */

const menuToggle = $("#menu-toggle");
const mainNav = $("#main-nav");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  mainNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation"
  );

  mainNav?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

$$(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

/* ---------- SCROLL PROGRESS ---------- */

let scrollTicking = false;

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0;

  const progressBar = $("#progress-bar");
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, progress)}%`;
  }

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  },
  { passive: true }
);

updateScrollProgress();

/* ---------- SCROLL REVEALS ---------- */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -25px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

/* ---------- ACTIVE NAVIGATION ---------- */

const sections = $$("main section[id]");
const navLinks = $$(".nav-link");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", active);

          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ---------- ANIMATED SKILL BARS ---------- */

$$(".skill-card").forEach((card) => {
  const percentage = Number(card.dataset.skill);
  const bar = $(".skill-track span", card);

  if (!bar || !Number.isFinite(percentage)) return;

  bar.style.setProperty(
    "--skill-width",
    `${Math.max(0, Math.min(100, percentage))}%`
  );
});

if ("IntersectionObserver" in window && !reduceMotion) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  $$(".skill-card").forEach((card) => skillObserver.observe(card));
} else {
  $$(".skill-card").forEach((card) => card.classList.add("in-view"));
}

/* ---------- CINEMATIC TYPING EFFECT ---------- */

const roleElement = $("#typed-role");

const roles = [
  "Computer Science Student",
  "Aspiring Software Developer",
  "Web Development Learner",
  "Creative Problem Solver"
];

if (roleElement) {
  if (reduceMotion) {
    roleElement.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      roleElement.textContent = currentRole.slice(
        0,
        Math.max(0, characterIndex)
      );

      let delay = deleting ? 35 : 65;

      if (!deleting && characterIndex >= currentRole.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }

      window.setTimeout(typeRole, delay);
    }

    window.setTimeout(typeRole, 1400);
  }
}

/* ---------- POINTER GLOW ---------- */

const cursorGlow = $(".cursor-glow");

if (cursorGlow && finePointer && !reduceMotion) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

/* ---------- INTERACTIVE 3D HOLOGRAM TILT ---------- */

const heroVisual = $(".hero-visual");

if (heroVisual && finePointer && !reduceMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    const rotateY = (x - 0.5) * 9;
    const rotateX = (0.5 - y) * 7;

    heroVisual.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
}

/* ---------- CONTACT FORM FEEDBACK ---------- */
/*
  The form posts directly to your original Formspree endpoint.
  Do not show a fake success message before Formspree confirms
  that the submission was accepted.
*/

const contactForm = $("#contact-form");
const formNote = $("#form-note");

contactForm?.addEventListener("submit", () => {
  if (!contactForm.reportValidity()) return;

  if (formNote) {
    formNote.textContent =
      "Transmitting message… Your browser will submit it to Formspree.";
  }

  const submitButton = $(".submit-button", contactForm);
  if (submitButton) {
    submitButton.setAttribute("aria-busy", "true");
  }
});

/* ---------- CYBERPUNK CITY: THREE.JS ---------- */

async function startCyberpunkCity() {
  const canvas = $("#city-canvas");
  if (!canvas) return;

  // Load Three.js dynamically so the rest of the site still works
  // if the external library is unavailable.
  const THREE = await import(
    "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js"
  );

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050611");
  scene.fog = new THREE.FogExp2("#07091b", 0.014);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    220
  );

  camera.position.set(0, 5, 19);
  camera.lookAt(0, 3, -10);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    alpha: false,
    powerPreference: "low-power"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.6)
  );

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  if ("ACESFilmicToneMapping" in THREE) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }

  scene.add(new THREE.AmbientLight("#7185c9", 1.2));

  const cyanLight = new THREE.PointLight("#00f5ff", 28, 45);
  cyanLight.position.set(-7, 8, -5);
  scene.add(cyanLight);

  const pinkLight = new THREE.PointLight("#ff35d3", 22, 40);
  pinkLight.position.set(8, 6, -10);
  scene.add(pinkLight);

  const cityGroup = new THREE.Group();
  scene.add(cityGroup);

  const cyanMaterial = new THREE.MeshBasicMaterial({
    color: "#00f5ff",
    transparent: true,
    opacity: 0.8
  });

  const pinkMaterial = new THREE.MeshBasicMaterial({
    color: "#ff35d3",
    transparent: true,
    opacity: 0.8
  });

  const buildingMaterials = [
    new THREE.MeshStandardMaterial({
      color: "#10162e",
      metalness: 0.7,
      roughness: 0.48,
      emissive: "#080d20",
      emissiveIntensity: 0.7
    }),
    new THREE.MeshStandardMaterial({
      color: "#17112e",
      metalness: 0.65,
      roughness: 0.45,
      emissive: "#100820",
      emissiveIntensity: 0.6
    }),
    new THREE.MeshStandardMaterial({
      color: "#0d2232",
      metalness: 0.6,
      roughness: 0.5,
      emissive: "#071523",
      emissiveIntensity: 0.65
    })
  ];

  const random = (min, max) => min + Math.random() * (max - min);

  // Create a dense skyline of geometric buildings.
  const buildingCount = window.innerWidth < 600 ? 48 : 88;

  for (let i = 0; i < buildingCount; i++) {
    const width = random(0.65, 1.8);
    const height = random(2.5, 12);
    const depth = random(0.7, 1.9);

    const x = (random(-1, 1) * 1.1) +
      (Math.random() < 0.5 ? -1 : 1) * random(5, 25);

    const z = random(-35, 7);

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(
      geometry,
      buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)]
    );

    building.position.set(x, height / 2 - 0.2, z);
    cityGroup.add(building);

    // Neon roof outlines.
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edge = new THREE.LineSegments(
      edgeGeometry,
      Math.random() > 0.65 ? pinkMaterial : cyanMaterial
    );

    edge.position.copy(building.position);
    edge.material = edge.material.clone();
    edge.material.opacity = random(0.18, 0.65);
    cityGroup.add(edge);

    // A few glowing vertical sign strips.
    if (Math.random() > 0.35) {
      const signGeometry = new THREE.BoxGeometry(
        0.035,
        random(0.8, Math.min(height, 3.5)),
        0.035
      );

      const sign = new THREE.Mesh(
        signGeometry,
        Math.random() > 0.5 ? cyanMaterial : pinkMaterial
      );

      sign.position.set(
        x + (Math.random() > 0.5 ? width * 0.3 : -width * 0.3),
        random(0.8, height - 0.3),
        z + depth / 2 + 0.025
      );

      cityGroup.add(sign);
    }
  }

  // Futuristic grid floor.
  const grid = new THREE.GridHelper(
    90,
    90,
    new THREE.Color("#00f5ff"),
    new THREE.Color("#25305b")
  );

  grid.position.set(0, -0.15, -10);
  grid.material.transparent = true;
  grid.material.opacity = 0.32;
  scene.add(grid);

  // Holographic rings hovering above the skyline.
  const hologram = new THREE.Group();
  hologram.position.set(0, 4.8, -9);
  scene.add(hologram);

  const ringConfigs = [
    { radius: 2.6, tube: 0.018, color: "#00f5ff" },
    { radius: 2.1, tube: 0.013, color: "#ff35d3" },
    { radius: 1.55, tube: 0.012, color: "#8b5cff" }
  ];

  const rings = [];

  ringConfigs.forEach((config, index) => {
    const ringGeometry = new THREE.TorusGeometry(
      config.radius,
      config.tube,
      8,
      120
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.78
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.rotation.x = Math.PI / 2 + index * 0.32;
    ring.rotation.y = index * 0.42;

    hologram.add(ring);
    rings.push(ring);
  });

  // Floating particles / distant city lights.
  const particleCount = window.innerWidth < 600 ? 650 : 1400;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = random(-38, 38);
    particlePositions[i * 3 + 1] = random(0, 23);
    particlePositions[i * 3 + 2] = random(-40, 12);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: "#9efaff",
    size: 0.055,
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // The camera smoothly follows the mouse without hijacking page scrolling.
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;
  let lastFrame = 0;

  if (finePointer && !reduceMotion) {
    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 2;
        targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );
  }

  function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.6)
    );
  }

  window.addEventListener("resize", resizeRenderer, { passive: true });

  function animate(time) {
    animationFrame = window.requestAnimationFrame(animate);

    // Limit unnecessary rendering when the tab is not visible.
    if (document.hidden) return;

    // Cap frame rate on high-refresh-rate displays to reduce GPU use.
    if (time - lastFrame < 24) return;
    lastFrame = time;

    const seconds = time * 0.001;

    if (!reduceMotion) {
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;

      camera.position.x = currentX * 1.5;
      camera.position.y = 5 - currentY * 0.8;
      camera.lookAt(currentX * 0.5, 3, -10);

      hologram.rotation.y = seconds * 0.16;
      hologram.rotation.z = Math.sin(seconds * 0.35) * 0.12;

      rings.forEach((ring, index) => {
        ring.rotation.z += (index % 2 ? -1 : 1) * 0.0015;
      });

      particles.rotation.y = Math.sin(seconds * 0.07) * 0.035;
      grid.position.z = -10 + Math.sin(seconds * 0.14) * 0.15;
    }

    renderer.render(scene, camera);
  }

  animate(0);

  // Stop the animation loop when the page is being hidden.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !animationFrame) animate(0);
  });

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
    renderer.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
  });
}

/* ---------- LIGHTWEIGHT 2D FALLBACK ---------- */

function startFallbackCity() {
  const canvas = $("#city-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let frame = 0;
  let buildings = [];
  let stars = [];
  let pointerX = 0;
  let pointerY = 0;

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    buildings = [];
    const buildingWidth = width < 600 ? 24 : 36;
    let x = -5;

    while (x < width + buildingWidth) {
      const buildingHeight = 35 + Math.random() * height * 0.25;

      buildings.push({
        x,
        w: buildingWidth - 3,
        h: buildingHeight,
        tint: Math.random() > 0.5 ? "#00f5ff" : "#ff35d3",
        lights: Array.from({ length: 5 }, () => Math.random() > 0.5)
      });

      x += buildingWidth;
    }

    stars = Array.from({ length: Math.min(120, Math.floor(width / 5)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    frame = requestAnimationFrame(draw);

    if (document.hidden) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#050611";
    ctx.fillRect(0, 0, width, height);

    const seconds = time * 0.001;
    const shiftX = reduceMotion ? 0 : pointerX * 9;
    const shiftY = reduceMotion ? 0 : pointerY * 4;

    // Distant stars.
    stars.forEach((star) => {
      const opacity = 0.25 + Math.abs(Math.sin(seconds + star.phase)) * 0.55;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#a9faff";
      ctx.fillRect(star.x, star.y, star.r, star.r);
    });

    ctx.globalAlpha = 1;

    // Neon skyline silhouettes.
    buildings.forEach((building, index) => {
      const bx = building.x + shiftX * (index % 2 ? 1 : -1);
      const by = height - building.h + shiftY;

      ctx.fillStyle = "#090d22";
      ctx.fillRect(bx, by, building.w, building.h);

      ctx.strokeStyle = building.tint;
      ctx.globalAlpha = 0.28;
      ctx.strokeRect(bx, by, building.w, building.h);
      ctx.globalAlpha = 1;

      for (let row = 0; row < building.lights.length; row++) {
        if (!building.lights[row]) continue;

        ctx.fillStyle = building.tint;
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(seconds + row + index)) * 0.5;
        ctx.fillRect(bx + 5, by + 10 + row * 12, 3, 4);
      }
    });

    ctx.globalAlpha = 1;

    // A softly animated central hologram.
    const cx = width * 0.5 + shiftX;
    const cy = height * 0.48 + shiftY;
    const baseRadius = Math.min(width * 0.22, 150);

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        baseRadius * (0.7 + i * 0.2),
        baseRadius * (0.7 + i * 0.2),
        seconds * (i % 2 ? -0.15 : 0.15),
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = i === 1 ? "#ff35d3" : "#00f5ff";
      ctx.globalAlpha = 0.23 + Math.abs(Math.sin(seconds + i)) * 0.3;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Perspective grid near the bottom.
    ctx.strokeStyle = "#00f5ff";
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;

    const horizon = height * 0.68;

    for (let i = 0; i < 15; i++) {
      const y = horizon + Math.pow(i / 14, 2) * height * 0.35;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(width * 0.5 + i * 2, horizon);
      ctx.lineTo(width * 0.5 + i * width * 0.08, height);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  if (finePointer && !reduceMotion) {
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
    }, { passive: true });
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw(0);

  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
}

/* ---------- START RENDERER ---------- */

startCyberpunkCity().catch((error) => {
  console.warn(
    "3D city could not start; using the animated fallback instead.",
    error
  );

  startFallbackCity();
});
