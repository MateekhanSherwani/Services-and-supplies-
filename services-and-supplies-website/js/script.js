/* ==========================================================================
   GNT MAK HOLDINGS — Services & Supplies
   Shared interactivity
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function init() {
    initPreloader();
    initScrollProgress();
    initNavbar();
    initThemeToggle();
    initRevealOnScroll();
    initCounters();
    initTestimonials();
    initAccordion();
    initFilterChips();
    initContactForm();
    initBackToTop();
    initFooterYear();
    initQuotePrefill();
    initHeroTextReveal();
    initParallaxBlobs();
    initHeroTilt();
    initCustomCursor();
    initMagneticButtons();
    initPageTransitions();
  }

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    var loader = document.querySelector(".preloader");
    if (!loader) return;
    var spinner = loader.querySelector(".spinner");
    if (spinner) {
      var logo = document.createElement("img");
      logo.className = "preloader-logo";
      logo.src = "images/company-logo.jpg";
      logo.alt = "";
      loader.appendChild(logo);
    }
    window.addEventListener("load", function () {
      setTimeout(function () { loader.classList.add("loaded"); }, 250);
    });
  }

  /* ---------------- Hero heading word-reveal ---------------- */
  function initHeroTextReveal() {
    var heading = document.querySelector(".hero-content h1");
    if (!heading || prefersReducedMotion) return;

    var nodes = Array.prototype.slice.call(heading.childNodes);
    var frag = document.createDocumentFragment();
    var wordIndex = 0;

    nodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var parts = node.textContent.split(/(\s+)/);
        parts.forEach(function (part) {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var mask = document.createElement("span");
          mask.className = "word-mask";
          var inner = document.createElement("span");
          inner.className = "word-inner";
          inner.style.animationDelay = (wordIndex * 0.07) + "s";
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
          wordIndex++;
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        var mask2 = document.createElement("span");
        mask2.className = "word-mask";
        node.classList.add("word-inner");
        node.style.animationDelay = (wordIndex * 0.07) + "s";
        mask2.appendChild(node);
        frag.appendChild(mask2);
        wordIndex++;
      }
    });

    heading.innerHTML = "";
    heading.appendChild(frag);
  }

  /* ---------------- Hero blob parallax ---------------- */
  function initParallaxBlobs() {
    if (!isFinePointer || prefersReducedMotion) return;
    var hero = document.querySelector(".hero");
    var layer = hero ? hero.querySelector(".hero-parallax") : null;
    if (!hero || !layer) return;

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      layer.style.transform = "translate(" + (x * 34) + "px," + (y * 34) + "px)";
    }, { passive: true });

    hero.addEventListener("mouseleave", function () {
      layer.style.transform = "";
    });
  }

  /* ---------------- Hero visual tilt + spotlight ---------------- */
  function initHeroTilt() {
    if (!isFinePointer || prefersReducedMotion) return;
    var frame = document.querySelector(".hero-visual-frame");
    if (!frame) return;

    frame.addEventListener("mousemove", function (e) {
      var rect = frame.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (0.5 - py) * 14;
      var ry = (px - 0.5) * 16;
      frame.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(1.02)";
      frame.style.setProperty("--mx", (px * 100) + "%");
      frame.style.setProperty("--my", (py * 100) + "%");
    });

    frame.addEventListener("mouseleave", function () {
      frame.style.transform = "";
    });
  }

  /* ---------------- Custom magnetic cursor ---------------- */
  function initCustomCursor() {
    if (!isFinePointer || prefersReducedMotion) return;

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    var label = document.createElement("span");
    label.className = "cursor-label";
    ring.appendChild(label);
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("has-custom-cursor");

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var ringX = mouseX, ringY = mouseY;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
    }, { passive: true });

    (function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", function (e) {
      var target = e.target.closest ? e.target.closest("a, button, .btn, .chip, .card, .icon-btn") : null;
      if (!target) return;
      var cursorText = target.getAttribute("data-cursor");
      if (cursorText) {
        label.textContent = cursorText;
        ring.classList.add("is-label");
      } else {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      var target = e.target.closest ? e.target.closest("a, button, .btn, .chip, .card, .icon-btn") : null;
      if (!target) return;
      ring.classList.remove("is-hover", "is-label");
      label.textContent = "";
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  function initMagneticButtons() {
    if (!isFinePointer || prefersReducedMotion) return;
    var items = document.querySelectorAll(".btn, .fab, .icon-btn");
    items.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = "translate(" + (x * 0.25) + "px," + (y * 0.3) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------------- Smooth page transitions ---------------- */
  function initPageTransitions() {
    if (prefersReducedMotion) return;
    var overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    document.body.appendChild(overlay);

    document.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target && link.target !== "_self") return;

      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === 0 || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      if (link.hostname && link.hostname !== window.location.hostname) return;

      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(function () { window.location.href = href; }, 420);
    });

    window.addEventListener("pageshow", function (e) {
      if (e.persisted) overlay.classList.remove("active");
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
    }, { passive: true });
  }

  /* ---------------- Navbar ---------------- */
  function initNavbar() {
    var navbar = document.querySelector(".navbar");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("open");
        toggle.classList.toggle("open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("open");
          toggle.classList.remove("open");
        });
      });
    }
  }

  /* ---------------- Dark / light theme ---------------- */
  function initThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    var root = document.documentElement;
    var stored = localStorage.getItem("gnt-theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    applyTheme(theme);

    if (btn) {
      btn.addEventListener("click", function () {
        theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(theme);
        localStorage.setItem("gnt-theme", theme);
      });
    }

    function applyTheme(t) {
      if (t === "dark") root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
      if (btn) {
        var icon = btn.querySelector("i");
        if (icon) icon.className = t === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initRevealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + (el.getAttribute("data-suffix") || "");
      }
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Testimonials carousel ---------------- */
  function initTestimonials() {
    var track = document.querySelector(".testi-track");
    if (!track) return;
    var slides = track.querySelectorAll(".testi-slide");
    var dotsWrap = document.querySelector(".testi-dots");
    var prevBtn = document.querySelector(".testi-arrow.prev");
    var nextBtn = document.querySelector(".testi-arrow.next");
    var index = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { show(i); reset(); });
      if (dotsWrap) dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap ? dotsWrap.querySelectorAll("button") : [];

    function show(i) {
      slides[index].classList.remove("active");
      if (dots[index]) dots[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("active");
      if (dots[index]) dots[index].classList.add("active");
    }

    function reset() {
      clearInterval(timer);
      timer = setInterval(function () { show(index + 1); }, 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); reset(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); reset(); });

    reset();
  }

  /* ---------------- FAQ accordion ---------------- */
  function initAccordion() {
    var items = document.querySelectorAll(".accordion-item");
    if (!items.length) return;
    items.forEach(function (item) {
      var head = item.querySelector(".accordion-head");
      var body = item.querySelector(".accordion-body");
      head.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".accordion-body").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------- Supplies filter chips ---------------- */
  function initFilterChips() {
    var chips = document.querySelectorAll(".chip[data-filter]");
    var cards = document.querySelectorAll("[data-category]");
    if (!chips.length || !cards.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var filter = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.display = match ? "" : "none";
          if (match) {
            card.classList.remove("reveal");
          }
        });
      });
    });
  }

  /* ---------------- Contact form validation ---------------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var success = document.querySelector(".form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.value.trim().length > 0;
        if (field.type === "email" && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      var data = new FormData(form);
      var name = encodeURIComponent(data.get("name") || "");
      var email = data.get("email") || "";
      var service = data.get("service") || "General Enquiry";
      var message = data.get("message") || "";
      var subject = encodeURIComponent("Website Enquiry — " + service);
      var body = encodeURIComponent(
        "Name: " + data.get("name") + "\nEmail: " + email + "\nInterested in: " + service + "\n\n" + message
      );

      if (success) success.classList.add("show");
      form.reset();

      var mailLink = "mailto:info@gntmakholdings.co.za?subject=" + subject + "&body=" + body;
      setTimeout(function () { window.location.href = mailLink; }, 900);
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap) wrap.classList.remove("invalid");
      });
    });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    var btn = document.querySelector(".fab-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Footer year ---------------- */
  function initFooterYear() {
    var el = document.querySelector("#footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Prefill contact subject from ?service= ---------------- */
  function initQuotePrefill() {
    var select = document.querySelector("#service-select");
    if (!select) return;
    var params = new URLSearchParams(window.location.search);
    var service = params.get("service");
    if (service) {
      var opt = Array.from(select.options).find(function (o) {
        return o.value.toLowerCase() === service.toLowerCase();
      });
      if (opt) select.value = opt.value;
      select.closest(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})();
