/* ==========================================================================
   GNT MAK HOLDINGS — Services & Supplies
   Shared interactivity
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

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
  }

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    var loader = document.querySelector(".preloader");
    if (!loader) return;
    window.addEventListener("load", function () {
      setTimeout(function () { loader.classList.add("loaded"); }, 250);
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
