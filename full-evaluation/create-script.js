window.AppShared.initLucideIcons();

/* ====== Range sliders (se-range) ====== */
document
  .querySelectorAll(".app-eval-stroke-card .se-range:not(.se-range--preview)")
  .forEach(function (range) {
    var head = range.previousElementSibling;
    var valEl = null;
    if (head && head.classList && head.classList.contains("se-rate-head")) {
      valEl = head.querySelector(".se-rate-head__right");
    }
    function update() {
      var pct = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.setProperty("--fill", pct + "%");
      if (valEl) valEl.textContent = parseFloat(range.value).toFixed(1);
    }
    range.addEventListener("input", update);
    update();
  });

/* ====== File Upload per stroke (cc-dropzone) ====== */
var AppS = window.AppShared;
document
  .querySelectorAll(".app-eval-stroke-card .cc-dropzone")
  .forEach(function (dz) {
    var input = dz.querySelector('input[type="file"]');
    var defUI = dz.querySelector(".cc-dropzone__content");
    var uploadedUI = dz.querySelector(".cc-dropzone__done");
    var browse = defUI && defUI.querySelector(".btn.btn-primary-outline");
    var remove =
      uploadedUI &&
      uploadedUI.querySelector('button[aria-label="Remove file"]');
    var nameEl = dz.querySelector(".upload-file-name");
    var sizeEl = dz.querySelector(".upload-file-size");
    var badgeName = dz.querySelector(".cc-dropzone__drag-badge-name");

    var previewVideo = uploadedUI && uploadedUI.querySelector(".cc-dropzone__preview-video");

    function loadFile(file) {
      if (!file) return;
      if (nameEl) nameEl.textContent = file.name;
      if (sizeEl) sizeEl.textContent = AppS.formatFileSize(file.size);
      defUI.classList.add("d-none");
      uploadedUI.classList.remove("d-none");
      dz.classList.add("has-file");
      dz.classList.remove("is-dragging");
      if (previewVideo && file.type && file.type.startsWith("video/")) {
        previewVideo.src = URL.createObjectURL(file);
        previewVideo.classList.remove("d-none");
      } else if (previewVideo) {
        previewVideo.classList.add("d-none");
        previewVideo.removeAttribute("src");
      }
      AppS.initLucideIcons();
    }

    function removeFile() {
      defUI.classList.remove("d-none");
      uploadedUI.classList.add("d-none");
      dz.classList.remove("has-file");
      input.value = "";
      if (badgeName) badgeName.textContent = "Drop video";
      if (previewVideo) {
        previewVideo.pause();
        previewVideo.removeAttribute("src");
        previewVideo.classList.add("d-none");
      }
      AppS.initLucideIcons();
    }

    if (browse) {
      browse.addEventListener("click", function (e) {
        e.stopPropagation();
        input.click();
      });
    }
    input.addEventListener("change", function () {
      if (input.files.length) loadFile(input.files[0]);
    });
    if (remove) {
      remove.addEventListener("click", function (e) {
        e.stopPropagation();
        removeFile();
      });
    }

    dz.addEventListener("click", function () {
      if (!uploadedUI.classList.contains("d-none")) return;
      if (dz.classList.contains("is-uploading")) return;
      input.click();
    });

    dz.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      dz.classList.add("is-dragging");
      var nm = AppS.dragFileNameFromEvent(e);
      if (badgeName) badgeName.textContent = nm || "Drop video";
    });

    dz.addEventListener("dragleave", function (e) {
      var rel = e.relatedTarget;
      if (rel && dz.contains(rel)) return;
      dz.classList.remove("is-dragging");
      if (badgeName) badgeName.textContent = "Drop video";
    });

    dz.addEventListener("drop", function (e) {
      e.preventDefault();
      dz.classList.remove("is-dragging");
      if (badgeName) badgeName.textContent = "Drop video";
      var files = e.dataTransfer.files;
      if (files.length) loadFile(files[0]);
    });
  });

/* ====== AI Generate Buttons ====== */
document
  .querySelectorAll(".app-eval-stroke-card .se-ai-btn")
  .forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".position-relative");
      var textarea = wrap && wrap.querySelector(".app-textarea");
      var strokeName = btn
        .closest(".app-eval-stroke-card")
        .querySelector(".app-eval-stroke-card__name").textContent;
      btn.disabled = true;
      btn.innerHTML =
        '<i data-lucide="loader" width="18" height="18" class="app-eval-spin"></i> Generating...';
      AppS.initLucideIcons();

      setTimeout(function () {
        textarea.value =
          "Based on the " +
          strokeName.toLowerCase() +
          " analysis, the player shows strong fundamentals with consistent technique. Focus areas include improving timing on contact point and maintaining proper body rotation throughout the stroke. Recommend increasing repetition drills with emphasis on follow-through mechanics.";
        textarea.dispatchEvent(new Event("input"));
        btn.disabled = false;
        btn.innerHTML =
          '<i data-lucide="sparkles" width="18" height="18"></i> Generate with AI';
        AppS.initLucideIcons();
      }, 1500);
    });
  });

/* ====== Save Evaluation ====== */
document.getElementById("btnSave").addEventListener("click", function () {
  localStorage.setItem("fe_evaluation_saved", "true");
  document.getElementById("successOverlay").classList.add("is-open");
  window.AppShared.initLucideIcons();
});

document
  .getElementById("successOverlay")
  .addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("is-open");
  });

/* ====== Recommendations: class search + location, coach search ====== */
(function () {
  var AppS = window.AppShared;
  var classInput = document.getElementById("feRecClassSearch");
  var classBtn = document.getElementById("feRecClassSearchBtn");
  var classCards = document.getElementById("classCards");
  var locEl = document.getElementById("feRecLocationSelect");

  function applyFeClassFilters() {
    if (!classCards) return;
    var q = (classInput && classInput.value) || "";
    q = q.trim().toLowerCase();
    var loc = null;
    if (locEl && typeof locEl._getSelected === "function") {
      var sel = locEl._getSelected();
      if (sel && sel.length) loc = sel[0];
    }
    var cols = classCards.children;
    for (var i = 0; i < cols.length; i++) {
      var col = cols[i];
      var article =
        col.tagName === "ARTICLE" ? col : col.querySelector("article");
      var textMatch = true;
      if (q) {
        textMatch =
          article &&
          (article.textContent || "").toLowerCase().indexOf(q) !== -1;
      }
      var cardLoc = col.getAttribute("data-fe-class-location");
      var locMatch = !loc || !cardLoc || cardLoc === loc;
      var match = textMatch && locMatch;
      var hideRoot = col.tagName === "ARTICLE" ? col : col;
      hideRoot.classList.toggle("d-none", !match);
    }
  }

  if (locEl) {
    AppS.initMultiselect(locEl);
    AppS.bindMultiselectOutsideClose();
    locEl.addEventListener("click", function () {
      setTimeout(applyFeClassFilters, 0);
    });
  }

  if (classInput && classCards) {
    classInput.addEventListener("input", applyFeClassFilters);
    classInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFeClassFilters();
      }
    });
    if (classBtn) {
      classBtn.addEventListener("click", function (e) {
        e.preventDefault();
        applyFeClassFilters();
      });
    }
  }

  AppS.bindRecommendationCardSearch(
    "feRecCoachSearch",
    "feRecCoachSearchBtn",
    "coachCards",
  );
})();

/* ====== Selectable recommendation cards (classes & coaches) ====== */
(function () {
  var root = document.querySelector(".page-full-eval");
  if (!root) return;

  function refresh(group) {
    var cards = root.querySelectorAll(
      '.se-selectable[data-group="' + group + '"]',
    );
    var selections = [];
    var countEl = document.getElementById(
      group === "classes" ? "classCount" : "coachCount",
    );

    cards.forEach(function (card) {
      var badge = card.querySelector(".se-order-badge");
      if (card.classList.contains("is-selected")) {
        selections.push(card);
        if (badge) badge.classList.remove("d-none");
      } else {
        if (badge) badge.classList.add("d-none");
        card.classList.remove(
          "app-class-card--selected",
          "app-coach-compact--selected",
        );
        card.classList.add(
          "app-class-card--muted",
          "app-coach-compact--muted",
        );
      }
    });

    selections.forEach(function (card, i) {
      var badge = card.querySelector(".se-order-badge");
      if (badge) badge.textContent = String(i + 1);
      card.classList.remove(
        "app-class-card--muted",
        "app-coach-compact--muted",
      );
      card.classList.add(
        "app-class-card--selected",
        "app-coach-compact--selected",
      );
    });

    cards.forEach(function (card) {
      if (!card.classList.contains("is-selected")) {
        card.classList.remove(
          "app-class-card--muted",
          "app-coach-compact--muted",
        );
        if (selections.length > 0) {
          card.classList.add(
            group === "classes"
              ? "app-class-card--muted"
              : "app-coach-compact--muted",
          );
        }
      }
    });

    if (countEl) {
      countEl.textContent = selections.length + " Added";
    }
  }

  root.querySelectorAll(".se-selectable").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-selected");
      refresh(card.getAttribute("data-group"));
    });
  });
})();

/* ====== Stepper: per-section sticky dots, scroll spy, jump to section ====== */
(function () {
  var stepper = document.querySelector(".app-eval-stepper--view-nav");
  if (!stepper) return;

  var sectionIds = [
    "feStepStroke",
    "feStepFeedback",
    "feStepRecommendations",
  ];
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

/* ====== Overall feedback: append suggestions + View more / Show less ====== */
(function initFeFeedbackSuggestions() {
  document.querySelectorAll(".fe-suggest-panel").forEach(function (panel) {
    var scrollEl = panel.querySelector(".fe-suggest-scroll");
    var toggle = panel.querySelector(".fe-suggest-toggle");
    var targetSel = panel.getAttribute("data-textarea-target");
    if (!scrollEl || !toggle || !targetSel) return;

    toggle.addEventListener("click", function () {
      var expanded = panel.classList.toggle("is-expanded");
      toggle.textContent = expanded ? "Show less" : "View more";
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (!expanded) scrollEl.scrollTop = 0;
    });

    panel.querySelectorAll(".fe-suggest-row__add").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-append-text");
        if (!text) return;
        var ta = document.querySelector(targetSel);
        if (!ta) return;
        var cur = ta.value.trim();
        ta.value = cur ? cur + "\n" + text : text;
        ta.focus();
      });
    });
  });
})();
