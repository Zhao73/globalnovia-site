/* GLOBAL NOVIA JAPAN — 共通スクリプト */
(function () {
  "use strict";

  /* ---- header solidify on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.querySelector(".burger");
  if (burger) {
    var overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    function closeMenu() {
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", document.body.classList.contains("menu-open") ? "true" : "false");
    });
    overlay.addEventListener("click", closeMenu);
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- form tabs ---- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".form-tabs button");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-target");
        btns.forEach(function (b) { b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
        document.querySelectorAll(".form-panel").forEach(function (p) {
          p.classList.toggle("active", p.id === target);
        });
      });
    });
  });

  /* ---- form validation + on-site (Netlify) submit ---- */
  function findErr(f) {
    var wrap = f.closest(".field, .agree");
    if (!wrap) return null;
    var err = wrap.querySelector(".err");
    if (err) return err;
    // consent: .agree's err lives as the next sibling element
    var sib = wrap.nextElementSibling;
    return (sib && sib.classList.contains("err")) ? sib : null;
  }

  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = false;
      if (f.type === "checkbox") { bad = !f.checked; }
      else if (f.type === "email") { bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()); }
      else { bad = f.value.trim() === ""; }
      f.classList.toggle("invalid", bad);
      var err = findErr(f);
      if (err) err.classList.toggle("show", bad);
      if (bad) ok = false;
    });
    return ok;
  }

  document.querySelectorAll("form[data-mail]").forEach(function (form) {
    var okBox = form.querySelector(".form-ok");
    var submitBtn = form.querySelector('[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) {
        var first = form.querySelector(".invalid");
        if (first) first.focus({ preventScroll: false });
        return;
      }
      if (submitBtn) submitBtn.disabled = true;
      // submit on-site to Netlify Forms (delivered to info@globalnoviajp.com)
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error("status " + res.status);
        if (okBox) {
          okBox.classList.add("show");
          window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
        }
        form.reset();
      }).catch(function () {
        window.alert("送信に失敗しました。お手数ですが info@globalnoviajp.com または LINE まで直接ご連絡ください。");
      }).finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
    // clear invalid on input
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      var clear = function () {
        f.classList.remove("invalid");
        var err = findErr(f);
        if (err) err.classList.remove("show");
      };
      f.addEventListener("input", clear);
      f.addEventListener("change", clear);
    });
  });

  /* ---- footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
