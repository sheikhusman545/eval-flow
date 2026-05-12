(function () {
  window.AppShared.initLucideIcons();

  var params = new URLSearchParams(window.location.search);
  if (params.get("detail") === "1") {
    localStorage.setItem("fe_evaluation_saved", "true");
  }

  var hasEval = localStorage.getItem("fe_evaluation_saved") === "true";
  if (hasEval) {
    document.getElementById("emptyState").classList.add("d-none");
    document.getElementById("evalView").classList.remove("d-none");
    document.getElementById("btnCreateNew").classList.remove("d-none");
    window.AppShared.initLucideIcons();
  }

  function refreshFeViewRangePreviews() {
    document
      .querySelectorAll("#evalView .se-range--preview")
      .forEach(function (range) {
        var pct =
          ((parseFloat(range.value, 10) - parseFloat(range.min, 10)) /
            (parseFloat(range.max, 10) - parseFloat(range.min, 10))) *
          100;
        range.style.setProperty("--fill", pct + "%");
      });
  }

  refreshFeViewRangePreviews();

  function setStrokeCardScore(cardId, valueStr) {
    var card = document.getElementById(cardId);
    if (!card || valueStr === undefined || valueStr === "") return;
    var num = parseFloat(String(valueStr).replace(/[^\d.]/g, ""), 10);
    if (isNaN(num)) return;
    var valEl = card.querySelector(".se-rate-head__right");
    var range = card.querySelector(".se-range--preview");
    var v = Math.min(10, Math.max(0, num));
    if (valEl) valEl.textContent = v.toFixed(1);
    if (range) {
      range.value = String(v);
    }
  }

  function applyFullEvalTimelineHydration() {
    var raw = sessionStorage.getItem("fe_full_eval_timeline");
    if (!raw) return false;
    var d;
    try {
      d = JSON.parse(raw);
    } catch (e) {
      return false;
    }

    var obs = document.getElementById("feHydrateCoachObs");
    if (obs && d.coachBody) obs.textContent = d.coachBody;

    var sug = document.getElementById("feHydrateCoachSuggest");
    if (sug) {
      var parts = [];
      if (d.working) parts.push("What's working: " + d.working);
      if (d.improve && d.improve.length)
        parts.push("Needs improvement: " + d.improve.join("; "));
      if (parts.length) {
        sug.textContent = parts.join("\n\n");
        sug.style.whiteSpace = "pre-line";
      }
    }

    var strokeToCard = {
      forehand: "strokeForehands",
      backhand: "strokeBackhands",
      serve: "strokeServes",
      volly: "strokeVolleys",
      volley: "strokeVolleys",
    };
    if (d.strokes && typeof d.strokes === "object") {
      Object.keys(d.strokes).forEach(function (k) {
        var nk = String(k)
          .toLowerCase()
          .replace(/\s+/g, "");
        var cardId = strokeToCard[nk];
        if (cardId) setStrokeCardScore(cardId, d.strokes[k]);
      });
    }

    sessionStorage.removeItem("fe_full_eval_timeline");

    return true;
  }

  if (hasEval) {
    applyFullEvalTimelineHydration();
    refreshFeViewRangePreviews();
    if (params.get("detail") === "1") {
      try {
        history.replaceState({}, "", window.location.pathname);
      } catch (e2) {
        /* ignore */
      }
    }
    window.AppShared.initLucideIcons();
  }

  (function initFeVideoModal() {
    var overlay = document.getElementById("feVideoModalOverlay");
    var player = document.getElementById("feVideoModalPlayer");
    var titleEl = document.getElementById("feVideoModalTitle");
    var closeBtn = document.getElementById("feVideoModalClose");
    if (!overlay || !player) return;

    function closeModal() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      player.pause();
      player.removeAttribute("src");
      player.removeAttribute("poster");
      player.load();
    }

    function openModal(src, poster, title) {
      if (titleEl) titleEl.textContent = title || "Video";
      if (poster) player.setAttribute("poster", poster);
      else player.removeAttribute("poster");
      player.src = src;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      window.AppShared.initLucideIcons();
    }

    document
      .querySelectorAll(".app-eval-video-done__view")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var root = btn.closest(".app-eval-video-done");
          if (!root) return;
          var nameEl = root.querySelector(".app-eval-video-done__name");
          openModal(
            root.getAttribute("data-video-src") || "",
            root.getAttribute("data-video-poster") || "",
            nameEl ? nameEl.textContent.trim() : "",
          );
        });
      });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
      }
    });
  })();

  if (!hasEval) return;

  var stepper = document.querySelector(".app-eval-stepper--view-nav");
  if (!stepper) return;

  var sectionIds = ["feStepStroke", "feStepFeedback", "feStepRecommendations"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  var dots = stepper.querySelectorAll(".app-eval-stepper__dot--nav");
  if (!dots.length) return;

  var scrollTicking = false;

  function setActiveStep(index) {
    dots.forEach(function (btn, i) {
      var on = i === index;
      btn.classList.toggle("app-eval-stepper__dot--hollow", on);
      if (on) btn.setAttribute("aria-current", "step");
      else btn.removeAttribute("aria-current");
    });
  }

  function activeIndexFromScroll() {
    var trigger = window.scrollY + window.innerHeight * 0.22;
    var active = 0;
    for (var i = sections.length - 1; i >= 0; i--) {
      var top = sections[i].getBoundingClientRect().top + window.scrollY;
      if (top <= trigger) {
        active = i;
        break;
      }
    }
    return active;
  }

  function updateFeStepperChrome() {
    setActiveStep(activeIndexFromScroll());
  }

  function onScrollOrResize() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      updateFeStepperChrome();
    });
  }

  dots.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = parseInt(btn.getAttribute("data-fe-step"), 10);
      if (i >= 0 && i < sections.length) {
        sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  updateFeStepperChrome();
})();
