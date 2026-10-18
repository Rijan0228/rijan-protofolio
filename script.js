
// =========================================================
// RIJAN SHRESTHA — PORTFOLIO INTERACTION ENGINE
// Three.js scene, scroll reveals, navigation and contact form
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // -------------------------------------------------------
  // LOADING SCREEN
  // -------------------------------------------------------

  const loader = $("#pageLoader");

  function finishLoading() {
    if (loader) loader.classList.add("loaded");
    document.body.classList.add("page-ready");
  }

  window.addEventListener("load", () => {
    window.setTimeout(finishLoading, reducedMotion ? 0 : 450);
  }, { once: true });

  // Safety fallback if a remote resource takes too long.
  window.setTimeout(finishLoading, 2500);

  // -------------------------------------------------------
  // CURRENT YEAR
  // -------------------------------------------------------

  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // -------------------------------------------------------
  // MOBILE NAVIGATION
  // -------------------------------------------------------

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  const navLinks = $$(".nav-link");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const opening = menuToggle.getAttribute("aria-expanded") !== "true";

      menuToggle.setAttribute("aria-expanded", String(opening));
      menuToggle.setAttribute(
        "aria-label",
        opening ? "Close navigation" : "Open navigation"
      );
      mainNav.classList.toggle("open", opening);
      document.body.classList.toggle("menu-open", opening);
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  // -------------------------------------------------------
  // SCROLL PROGRESS, BACK-TO-TOP AND ACTIVE NAV
  // -------------------------------------------------------

  const progressBar = $("#scrollProgress");
  const backToTop = $("#backToTop");
  let scrollTicking = false;

  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }

    scrollTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });

  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.id;

        navLinks.forEach(link => {
          const isActive = link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // -------------------------------------------------------
  // SCROLL-REVEAL ANIMATIONS
  // -------------------------------------------------------

  const revealElements = $$(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));
  }

  // -------------------------------------------------------
  // 3D CARD TILT
  // -------------------------------------------------------

  if (!reducedMotion && !coarsePointer) {
    $$(".tilt-card").forEach(card => {
      let rect = null;

      card.addEventListener("pointerenter", () => {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener("pointermove", event => {
        if (event.pointerType !== "mouse") return;

        rect = rect || card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        rect = null;
      });
    });
  }

  // -------------------------------------------------------
  // HERO POINTER PARALLAX
  // -------------------------------------------------------

  const heroVisual = $("#heroVisual");

  if (heroVisual && !reducedMotion && !coarsePointer) {
    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    heroVisual.addEventListener("pointermove", event => {
      const rect = heroVisual.getBoundingClientRect();

      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        heroVisual.style.setProperty("--pointer-x", `${targetX}px`);
        heroVisual.style.setProperty("--pointer-y", `${targetY}px`);
        frame = 0;
      });
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--pointer-x", "0px");
      heroVisual.style.setProperty("--pointer-y", "0px");
    });
  }

  // -------------------------------------------------------
  // THREE.JS INTERACTIVE 3D SCENE
  // -------------------------------------------------------

  function initThreeScene() {
    const stage = $("#threeStage");
    const canvas = $("#threeCanvas");
    const fallback = $("#threeFallback");

    if (!stage || !canvas || !window.THREE) return;

    const THREE = window.THREE;
    let renderer;
    let scene;
    let camera;
    let sculpture;
    let innerCore;
    let particles;
    let particleGeometry;
    let particleMaterial;
    let animationFrame = 0;
    let resizeObserver;
    let disposed = false;

    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !coarsePointer,
        powerPreference: "low-power"
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      // The main object: a sculptural, wireframe torus knot.
      sculpture = new THREE.Group();
      scene.add(sculpture);

      const knotGeometry = new THREE.TorusKnotGeometry(
        1.03, 0.29, 180, 16, 2, 3
      );

      const knotMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffc3,
        metalness: 0.72,
        roughness: 0.24,
        emissive: 0x003c31,
        emissiveIntensity: 0.75,
        wireframe: true
      });

      const knot = new THREE.Mesh(knotGeometry, knotMaterial);
      sculpture.add(knot);

      // A bright inner form gives the object depth.
      const coreGeometry = new THREE.IcosahedronGeometry(0.49, 2);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x93ffe3,
        emissive: 0x00a87e,
        emissiveIntensity: 0.65,
        metalness: 0.5,
        roughness: 0.22,
        flatShading: true
      });

      innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
      sculpture.add(innerCore);

      // Fine orbital rings.
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x678dff,
        transparent: true,
        opacity: 0.75
      });

      const ringOne = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.007, 6, 180),
        ringMaterial
      );
      ringOne.rotation.set(1.05, 0.35, 0.2);
      sculpture.add(ringOne);

      const ringTwo = new THREE.Mesh(
        new THREE.TorusGeometry(2.02, 0.005, 6, 180),
        new THREE.MeshBasicMaterial({
          color: 0x00ffc3,
          transparent: true,
          opacity: 0.4
        })
      );
      ringTwo.rotation.set(0.35, 1.15, 0.7);
      sculpture.add(ringTwo);

      // Small points of light orbit the central form.
      const particleCount = coarsePointer ? 360 : 750;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 2.2 + Math.random() * 2.3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] =
          radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] =
          radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] =
          radius * Math.cos(phi);
      }

      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      particleMaterial = new THREE.PointsMaterial({
        color: 0x8cffe3,
        size: 0.018,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Lighting.
      scene.add(new THREE.AmbientLight(0x7bffe1, 1.2));

      const keyLight = new THREE.PointLight(0x00ffc3, 36, 15);
      keyLight.position.set(3, 2, 4);
      scene.add(keyLight);

      const blueLight = new THREE.PointLight(0x678dff, 25, 15);
      blueLight.position.set(-3, -2, 2);
      scene.add(blueLight);

      const rimLight = new THREE.PointLight(0xffffff, 10, 12);
      rimLight.position.set(0, 3, -3);
      scene.add(rimLight);

      function resizeScene() {
        if (disposed) return;

        const width = stage.clientWidth;
        const height = stage.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 420 ? 8 : width < 700 ? 7.4 : 6.8;
        camera.updateProjectionMatrix();
      }

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(resizeScene);
        resizeObserver.observe(stage);
      } else {
        window.addEventListener("resize", resizeScene);
      }

      resizeScene();

      if (fallback) fallback.style.display = "none";
      canvas.style.visibility = "visible";

      if (!reducedMotion) {
        stage.addEventListener("pointermove", event => {
          if (event.pointerType !== "mouse") return;

          const rect = stage.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        stage.addEventListener("pointerleave", () => {
          pointer.x = 0;
          pointer.y = 0;
        });
      }

      const clock = new THREE.Clock();

      function animate() {
        if (disposed) return;

        animationFrame = window.requestAnimationFrame(animate);

        // Pause expensive rendering while the scene is off-screen.
        if (document.hidden || !stage.getClientRects().length) return;

        const elapsed = clock.getElapsedTime();

        if (!reducedMotion) {
          sculpture.rotation.y +=
            (pointer.x * 0.3 - sculpture.rotation.y) * 0.018 + 0.002;

          targetRotation.x = -pointer.y * 0.22;
          sculpture.rotation.x +=
            (targetRotation.x - sculpture.rotation.x) * 0.025;

          innerCore.rotation.x = elapsed * 0.16;
          innerCore.rotation.y = elapsed * 0.23;
          particles.rotation.y = elapsed * 0.018;
          particles.rotation.x = Math.sin(elapsed * 0.12) * 0.08;
        }

        const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 1.3) * 0.025;
        sculpture.scale.setScalar(pulse);

        renderer.render(scene, camera);
      }

      animate();

      // Pause/resume rendering as the page is hidden or restored.
      const onVisibilityChange = () => {
        if (!document.hidden && !disposed && !animationFrame) animate();
      };

      document.addEventListener("visibilitychange", onVisibilityChange);

      // Clean up WebGL resources if the page is leaving.
      window.addEventListener("pagehide", () => {
        disposed = true;
        if (animationFrame) cancelAnimationFrame(animationFrame);
        if (resizeObserver) resizeObserver.disconnect();
        else window.removeEventListener("resize", resizeScene);

        document.removeEventListener("visibilitychange", onVisibilityChange);

        knotGeometry.dispose();
        knotMaterial.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        ringMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      }, { once: true });

    } catch (error) {
      console.warn("3D scene unavailable; using the CSS fallback.", error);

      if (renderer) renderer.dispose();
      if (canvas) canvas.style.display = "none";
      if (fallback) fallback.style.display = "grid";
    }
  }

  // Wait until layout dimensions are available before creating WebGL.
  if ("requestAnimationFrame" in window) {
    window.requestAnimationFrame(initThreeScene);
  } else {
    initThreeScene();
  }

  // -------------------------------------------------------
  // FORM VALIDATION AND FORMSPREE SUBMISSION
  // -------------------------------------------------------

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const submitButton = $("#submitButton");
  const submitLabel = $("#submitLabel");
  const submitArrow = $("#submitArrow");

  function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status visible ${type}`;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      // Basic anti-spam honeypot.
      const honeypot = $('[name="_gotcha"]', contactForm);

      if (honeypot && honeypot.value.trim() !== "") {
        showFormStatus("Thanks! Your message has been received.", "success");
        contactForm.reset();
        return;
      }

      const endpoint = contactForm.getAttribute("action");

      if (!endpoint || !endpoint.startsWith("https://formspree.io/f/")) {
        showFormStatus(
          "The contact form endpoint is missing or invalid. Please contact me by email.",
          "error"
        );
        return;
      }

      const originalLabel = submitLabel ? submitLabel.textContent : "Send message";

      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending...";
      if (submitArrow) submitArrow.textContent = "…";

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { "Accept": "application/json" }
        });

        let result = {};

        try {
          result = await response.json();
        } catch (_) {
          result = {};
        }

        if (!response.ok) {
          const detail = Array.isArray(result.errors)
            ? result.errors.map(item => item.message).filter(Boolean).join(" ")
            : "";

          throw new Error(
            detail || "The message could not be sent. Please try again."
          );
        }

        contactForm.reset();

        showFormStatus(
          "Message sent successfully! Thanks for reaching out. ✨",
          "success"
        );
      } catch (error) {
        console.error("Contact form submission failed:", error);

        showFormStatus(
          "We couldn't confirm delivery. Check your connection and try again, or email rijanshrestha0414@gmail.com directly.",
          "error"
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = originalLabel;
        if (submitArrow) submitArrow.textContent = "↗";
      }
    });
  }
});
