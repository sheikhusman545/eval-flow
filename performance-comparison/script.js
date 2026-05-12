/* Performance Comparison — wizard, filters, and result view */
(function () {
  "use strict";

  (function initComparisonBreadcrumb() {
    var nav = document.getElementById("pcBreadcrumb");
    if (!nav) return;
    var fromTrainee =
      new URLSearchParams(window.location.search).get("from") === "trainee";
    if (fromTrainee) {
      nav.innerHTML =
        '<a href="../index.html">Trainees</a>' +
        '<i data-lucide="chevron-right" width="16" height="16" aria-hidden="true"></i>' +
        '<a href="../trainee/index.html">Player Profile</a>' +
        '<i data-lucide="chevron-right" width="16" height="16" aria-hidden="true"></i>' +
        '<span class="current">Performance Comparison</span>';
    } else {
      nav.innerHTML = '<span class="current">Performance Comparison</span>';
    }
  })();

  (function initNavActiveWhenFromTrainee() {
    if (new URLSearchParams(window.location.search).get("from") !== "trainee") {
      return;
    }
    document
      .querySelectorAll(
        ".app-header .app-nav-pill, #appNavOffcanvas .app-nav-pill",
      )
      .forEach(function (p) {
        p.classList.remove("is-active");
      });
    document
      .querySelectorAll(
        '.app-header .app-nav-pill[href="../index.html"], #appNavOffcanvas .app-nav-pill[href="../index.html"]',
      )
      .forEach(function (p) {
        p.classList.add("is-active");
      });
  })();

  window.AppShared.initLucideIcons();

  var EVALUATIONS = [
    {
      id: 1,
      type: "session",
      traineeId: 1,
      stroke: "Forehand",
      date: "2026-03-01",
      dateDisplay: "3/1/2026",
      score: 8.0,
      coachRating: 8.6,
      stars: 4,
      body: "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Condimentum Curabitur Vel Odio Tortor Egestas Eius. Cursus Volutpat Tincidunt Tellus In Blandit Sociis Nunc Eu Scelerisque Purus Morbi Vel Phasellus Dolor Vel Proin Sed.",
      whatsGood: ["Good Follow-Through"],
      needsAttention: ["Frequent Backswing", "Poor Spacing"],
      coachNotes:
        "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Porto Finilius Ringilla. Nul Iscule Justo Phasellus Vel Bloom Libra. Dui Rlus Scelerisque Volutpate Nec Insignis Figali Non.",
      howToFix: [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
        "Sit Dictum Batlincir Cursui Pretium Commodo Rutrum",
      ],
      refClips: 5,
      img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80",
      tags: ["Coach Clips", "Forehand"],
    },
    {
      id: 2,
      type: "session",
      traineeId: 1,
      stroke: "Forehand",
      date: "2026-03-15",
      dateDisplay: "3/15/2026",
      score: 8.2,
      coachRating: 8.8,
      stars: 4,
      body: "Lorem Ipsum Dolor Sit Amet Consectetur. Netus In Maximus In Venenatis Efficitur. Dignissim Ac Consequat Morbi Tellus. Fusce Vel A Posuere Viverra Vestibulum.",
      whatsGood: ["Good Follow-Through", "Improved Footwork"],
      needsAttention: ["Racquet Back Late", "Poor Spacing"],
      coachNotes:
        "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Porto Finilius Ringilla. Nul Iscule Justo Phasellus Vel Bloom Libra. Dui Rlus Scelerisque Volutpate Nec Insignis Figali Non.",
      howToFix: [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
        "Sit Dictum Batlincir Cursui Pretium Commodo Rutrum",
      ],
      refClips: 5,
      img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80",
      tags: ["Coach Clips", "Forehand"],
    },
    {
      id: 3,
      type: "session",
      traineeId: 1,
      stroke: "Forehand",
      date: "2026-08-03",
      dateDisplay: "8/3/2026",
      score: 8.0,
      coachRating: 8.6,
      stars: 5,
      body: "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Condimentum Curabitur Vel Odio Tortor Egestas Eius.",
      whatsGood: ["Good Follow-Through"],
      needsAttention: ["Frequent Backswing", "Poor Spacing"],
      coachNotes:
        "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Porto Finilius Ringilla. Nul Iscule Justo Phasellus Vel Bloom Libra.",
      howToFix: [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
        "Sit Dictum Batlincir Cursui Pretium Commodo Rutrum",
      ],
      refClips: 3,
      img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80",
      tags: ["Coach Clips", "Forehand"],
    },
    {
      id: 4,
      type: "session",
      traineeId: 1,
      stroke: "Backhand",
      date: "2026-02-15",
      dateDisplay: "2/15/2026",
      score: 7.3,
      coachRating: 7.8,
      stars: 4,
      body: "Lorem Ipsum Dolor Sit Amet Consectetur. Netus In Maximus In Venenatis Efficitur.",
      whatsGood: ["Consistent Grip"],
      needsAttention: ["Wrist Angle", "Late Contact Point"],
      coachNotes:
        "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Porto Finilius Ringilla.",
      howToFix: [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
      ],
      refClips: 4,
      img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80",
      tags: ["Coach Clips", "Backhand"],
    },
    {
      id: 5,
      type: "session",
      traineeId: 1,
      stroke: "Backhand",
      date: "2026-04-20",
      dateDisplay: "4/20/2026",
      score: 7.8,
      coachRating: 8.2,
      stars: 4,
      body: "Lorem Ipsum Dolor Sit Amet Consectetur. Netus In Maximus In Venenatis Efficitur. Dignissim Ac Consequat Morbi Tellus.",
      whatsGood: ["Consistent Grip", "Better Spacing"],
      needsAttention: ["Wrist Angle"],
      coachNotes:
        "Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Porto Finilius Ringilla. Nul Iscule Justo.",
      howToFix: [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
      ],
      refClips: 3,
      img: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80",
      tags: ["Coach Clips", "Backhand"],
    },
  ];

  var TRAINEES = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Marcus Chen" },
    { id: 3, name: "Elena Rossi" },
  ];
  var nextTraineeId = 4;

  function starsHTML(count) {
    var s = "";
    for (var i = 0; i < 5; i++) {
      s +=
        i < count
          ? '<i data-lucide="star" class="star-on" width="14" height="14"></i>'
          : '<i data-lucide="star" class="star-off" width="14" height="14"></i>';
    }
    return s;
  }

  function daysBetween(d1, d2) {
    var a = new Date(d1),
      b = new Date(d2);
    return Math.abs(Math.round((b - a) / 86400000));
  }

  function badgeModifierForTag(label) {
    var strokes = ["Forehand", "Backhand", "Volley", "Serve", "Smash"];
    if (strokes.indexOf(label) !== -1) {
      return window.AppShared.strokeBadgeTone(label);
    }
    var t = (label || "").toLowerCase();
    if (t.indexOf("coach") !== -1) return "blue";
    if (t.indexOf("player") !== -1) return "blue";
    if (t.indexOf("pro") !== -1) return "orange";
    if (t.indexOf("volley") !== -1) return "red";
    if (
      t.indexOf("forehand") !== -1 ||
      t.indexOf("smash") !== -1 ||
      t.indexOf("serve") !== -1
    ) {
      return "orange";
    }
    if (t.indexOf("backhand") !== -1) return "blue";
    if (
      t.indexOf("intermediate") !== -1 ||
      t.indexOf("advanced") !== -1 ||
      t.indexOf("beginner") !== -1
    ) {
      return "green";
    }
    return "green";
  }

  /** Same DOM as session-evaluation Reference Clips list (.rc-card) */
  function evalCardHTML(ev, isSelected) {
    var S = window.AppShared;
    var tagSource =
      ev.tags && ev.tags.length
        ? ev.tags
        : ["Session", ev.stroke || "Evaluation"];
    var tags = tagSource.map(function (t) {
      var mod = badgeModifierForTag(t);
      return (
        '<span class="badge-tag badge-tag--' +
        mod +
        '">' +
        S.escapeHtml(t) +
        "</span>"
      );
    });
    return (
      '<article class="rc-card' +
      (isSelected ? " is-selected" : "") +
      '" data-id="' +
      ev.id +
      '">' +
      '<div class="rc-card__thumb"><img src="' +
      ev.img +
      '" alt="" /></div>' +
      '<div class="rc-card__body">' +
      '<h4 class="rc-card__title">' +
      S.escapeHtml(ev.stroke + " Evaluation") +
      "</h4>" +
      '<p class="rc-card__date">' +
      '<i data-lucide="calendar" width="15" height="15"></i>' +
      S.escapeHtml(ev.dateDisplay) +
      "</p>" +
      '<div class="rc-card__tags">' +
      tags.join("") +
      "</div>" +
      "</div>" +
      '<span class="rc-card__badge d-none">0</span>' +
      "</article>"
    );
  }

  var state = {
    step: 0,
    trainee: null,
    stroke: null,
    beforeId: null,
    afterId: null,
    beforeDatePicker: null,
    afterDatePicker: null,
  };

  var pageParams = new URLSearchParams(window.location.search);
  var isTraineeProfileContext = pageParams.get("from") === "trainee";
  var lockedTraineeIdParam = parseInt(
    pageParams.get("traineeId") || pageParams.get("id") || "",
    10,
  );

  function resolveTraineeFromProfileContext() {
    if (!isTraineeProfileContext) return null;
    var id = lockedTraineeIdParam;
    if (!id || isNaN(id)) id = 1;
    var t = TRAINEES.find(function (x) {
      return x.id === id;
    });
    return t ? { id: t.id, name: t.name } : null;
  }

  var overlay = document.getElementById("wizardOverlay");
  var modal = document.getElementById("wizardModal");
  var steps = modal.querySelectorAll(".pc-wizard__step");
  var emptyState = document.getElementById("emptyState");
  var compResult = document.getElementById("comparisonResult");
  var btnNew = document.getElementById("btnNewComparison");
  var pcTraineeSelectRow = document.getElementById("pcTraineeSelectRow");
  var pcWizardStrokeSection = document.getElementById("pcWizardStrokeSection");

  function openWizard() {
    state.step = 1;
    state.stroke = null;
    state.beforeId = null;
    state.afterId = null;
    resetStrokeChips();
    var locked = resolveTraineeFromProfileContext();
    if (locked) {
      state.trainee = locked;
      if (pcTraineeSelectRow) pcTraineeSelectRow.classList.add("d-none");
      if (pcWizardStrokeSection) pcWizardStrokeSection.classList.remove("mb-5");
      var searchInp = document.getElementById("pcTraineeSearch");
      if (searchInp) searchInp.value = locked.name;
      updateStep1NextState();
      updatePcTraineeClearVisibility();
    } else {
      if (pcTraineeSelectRow) pcTraineeSelectRow.classList.remove("d-none");
      if (pcWizardStrokeSection) pcWizardStrokeSection.classList.add("mb-5");
      resetTraineeSearch();
    }
    goToStep(1, "forward");
    overlay.classList.add("is-open");
  }

  function closeWizard() {
    overlay.classList.remove("is-open");
  }

  function goToStep(n, dir) {
    state.step = n;
    steps.forEach(function (s) {
      var sn = parseInt(s.dataset.step, 10);
      s.classList.remove("is-active", "pc-slide-in", "pc-slide-in-back");
      if (sn === n) {
        s.classList.add("is-active");
        s.classList.add(dir === "back" ? "pc-slide-in-back" : "pc-slide-in");
      }
    });
    modal.classList.toggle("pc-wizard--wide", n === 2);
    modal.classList.toggle("pc-wizard--split", n === 3);

    if (n === 1) updateStep1NextState();
    if (n === 2) renderBeforeList();
    if (n === 3) {
      renderBeforeDetail();
      renderAfterList();
    }
    window.AppShared.initLucideIcons();
  }

  function resetStrokeChips() {
    document
      .querySelectorAll("#strokeChips .pc-stroke-badge")
      .forEach(function (b) {
        var s = b.getAttribute("data-stroke") || "";
        b.className = "badge-tag pc-stroke-badge";
        b.textContent = s;
      });
    state.stroke = null;
    updateStep1NextState();
  }

  function updateStep1NextState() {
    var ok = !!(state.trainee && state.stroke);
    document.getElementById("step1Next").disabled = !ok;
  }

  var pcTraineeSearch = document.getElementById("pcTraineeSearch");
  var pcTraineeDropdown = document.getElementById("pcTraineeDropdown");
  var pcTraineeClear = document.getElementById("pcTraineeClear");

  function updatePcTraineeClearVisibility() {
    if (!pcTraineeClear) return;
    var has = (pcTraineeSearch.value || "").trim() !== "" || !!state.trainee;
    pcTraineeClear.hidden = !has;
  }

  function setTraineeDropdownOpen(open) {
    var ms = document.getElementById("pcTraineeMultiselect");
    if (ms) ms.classList.toggle("is-open", open);
    pcTraineeSearch.setAttribute("aria-expanded", open ? "true" : "false");
    var chev = document.getElementById("pcTraineeChevron");
    if (chev) chev.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function renderTraineeOptions(filterText) {
    var q = (filterText || "").trim().toLowerCase();
    var list = TRAINEES.filter(function (t) {
      return !q || t.name.toLowerCase().indexOf(q) !== -1;
    });
    if (!list.length) {
      pcTraineeDropdown.innerHTML =
        '<p class="app-multiselect__noresults py-2 px-1 mb-0">No matches. Use + to add a new player.</p>';
      return;
    }
    pcTraineeDropdown.innerHTML = list
      .map(function (t) {
        return (
          '<button type="button" class="app-multiselect__option" role="option" data-id="' +
          t.id +
          '">' +
          window.AppShared.escapeHtml(t.name) +
          "</button>"
        );
      })
      .join("");
    pcTraineeDropdown
      .querySelectorAll(".app-multiselect__option")
      .forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          selectTrainee(list[i]);
          setTraineeDropdownOpen(false);
        });
      });
  }

  function selectTrainee(t) {
    state.trainee = { id: t.id, name: t.name };
    pcTraineeSearch.value = t.name;
    updateStep1NextState();
    updatePcTraineeClearVisibility();
  }

  function resetTraineeSearch() {
    state.trainee = null;
    pcTraineeSearch.value = "";
    pcTraineeDropdown.innerHTML = "";
    setTraineeDropdownOpen(false);
    updateStep1NextState();
    updatePcTraineeClearVisibility();
  }

  pcTraineeSearch.addEventListener("focus", function () {
    /* Full list when opening; filter only on input (typing). */
    renderTraineeOptions("");
    setTraineeDropdownOpen(true);
    updatePcTraineeClearVisibility();
  });

  pcTraineeSearch.addEventListener("input", function () {
    if (!state.trainee || pcTraineeSearch.value !== state.trainee.name) {
      state.trainee = null;
    }
    renderTraineeOptions(pcTraineeSearch.value);
    setTraineeDropdownOpen(true);
    updateStep1NextState();
    updatePcTraineeClearVisibility();
  });

  pcTraineeSearch.addEventListener("blur", function () {
    setTimeout(function () {
      var v = pcTraineeSearch.value.trim();
      if (!v) {
        updatePcTraineeClearVisibility();
        return;
      }
      var match = TRAINEES.find(function (t) {
        return t.name.toLowerCase() === v.toLowerCase();
      });
      if (match) selectTrainee(match);
      updatePcTraineeClearVisibility();
    }, 180);
  });

  document
    .getElementById("pcTraineeChevron")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !document
        .getElementById("pcTraineeMultiselect")
        .classList.contains("is-open");
      if (open) renderTraineeOptions("");
      setTraineeDropdownOpen(open);
      updatePcTraineeClearVisibility();
    });

  if (pcTraineeClear) {
    pcTraineeClear.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      resetTraineeSearch();
      pcTraineeSearch.focus();
    });
  }

  updatePcTraineeClearVisibility();

  document.addEventListener("click", function (e) {
    var ms = document.getElementById("pcTraineeMultiselect");
    if (!ms || ms.contains(e.target)) return;
    setTraineeDropdownOpen(false);
  });

  document
    .getElementById("pcBtnAddTrainee")
    .addEventListener("click", function () {
      document.getElementById("pcAddPlayerOverlay").classList.add("is-open");
      window.AppShared.initLucideIcons();
    });

  window.AppShared.bindExclusiveStrokeBadges("#strokeChips");
  document
    .getElementById("strokeChips")
    .addEventListener("click", function (e) {
      var btn = e.target.closest(".pc-stroke-badge");
      if (!btn) return;
      state.stroke = btn.getAttribute("data-stroke");
      updateStep1NextState();
    });

  document.getElementById("step1Next").addEventListener("click", function () {
    if (!state.trainee) {
      alert("Please select a trainee.");
      return;
    }
    if (!state.stroke) {
      alert("Please choose a stroke type.");
      return;
    }
    goToStep(2, "forward");
  });

  function filteredByStroke() {
    return EVALUATIONS.filter(function (e) {
      if (e.type !== "session" || e.stroke !== state.stroke) return false;
      if (
        state.trainee &&
        e.traineeId != null &&
        e.traineeId !== state.trainee.id
      )
        return false;
      return true;
    });
  }

  function renderBeforeList(dateRange) {
    var list = filteredByStroke();
    if (dateRange && dateRange.length === 2) {
      var from = dateRange[0].getTime(),
        to = dateRange[1].getTime();
      list = list.filter(function (e) {
        var t = new Date(e.date).getTime();
        return t >= from && t <= to;
      });
    }
    var el = document.getElementById("beforeEvalList");
    if (!list.length) {
      el.innerHTML =
        '<p class="text-center text-muted-app py-4 small">No evaluations found.</p>';
      return;
    }
    el.innerHTML = list
      .map(function (e) {
        return evalCardHTML(e, state.beforeId === e.id);
      })
      .join("");
    bindCardClicks(el, "before");
    window.AppShared.initLucideIcons();
  }

  function bindCardClicks(container, which) {
    container.querySelectorAll(".rc-card").forEach(function (card) {
      card.addEventListener("click", function () {
        container.querySelectorAll(".rc-card").forEach(function (c) {
          c.classList.remove("is-selected");
        });
        card.classList.add("is-selected");
        var id = parseInt(card.dataset.id, 10);
        if (which === "before") {
          state.beforeId = id;
          document.getElementById("step2Next").disabled = false;
        } else {
          state.afterId = id;
          document.getElementById("step3Next").disabled = false;
        }
      });
    });
  }

  document.getElementById("step2Back").addEventListener("click", function () {
    goToStep(1, "back");
  });
  document.getElementById("step2Next").addEventListener("click", function () {
    if (!state.beforeId) return;
    state.afterId = null;
    document.getElementById("step3Next").disabled = true;
    goToStep(3, "forward");
  });

  function renderBeforeDetail() {
    var ev = EVALUATIONS.find(function (e) {
      return e.id === state.beforeId;
    });
    if (!ev) return;
    var timeLabel = ev.videoTimeLabel || "02:28 / 05:21";
    var progressPct =
      ev.progressPct != null && !isNaN(Number(ev.progressPct))
        ? String(ev.progressPct)
        : "46";
    var html =
      '<div class="pc-detail-thumb" style="--pc-detail-progress-pct: ' +
      progressPct +
      '%">' +
      '<img src="' +
      ev.img +
      '" alt="" />' +
      '<div class="pc-detail-thumb__overlay" aria-hidden="true"></div>' +
      '<div class="pc-detail-thumb__top">' +
      '<button type="button" class="pc-detail-thumb__icon-btn" aria-label="Fullscreen">' +
      '<i data-lucide="maximize-2" width="16" height="16"></i></button>' +
      '<button type="button" class="pc-detail-thumb__icon-btn" aria-label="More options">' +
      '<i data-lucide="more-vertical" width="16" height="16"></i></button>' +
      "</div>" +
      '<div class="pc-detail-thumb__center">' +
      '<button type="button" class="pc-detail-thumb__skip" aria-label="Rewind 15 seconds">' +
      '<i data-lucide="rewind" width="18" height="18"></i></button>' +
      '<button type="button" class="pc-detail-thumb__play" aria-label="Play video">' +
      '<i data-lucide="play" width="22" height="22"></i></button>' +
      '<button type="button" class="pc-detail-thumb__skip" aria-label="Fast forward 15 seconds">' +
      '<i data-lucide="fast-forward" width="18" height="18"></i></button>' +
      "</div>" +
      '<div class="pc-detail-thumb__bottom">' +
      '<div class="pc-detail-thumb__progress" aria-hidden="true"><span class="pc-detail-thumb__progress-fill"></span></div>' +
      '<span class="pc-detail-thumb__time">' +
      timeLabel +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="pc-eval-panel__body pc-before-detail__body">' +
      '<div class="d-flex flex-column gap-3">' +
      '<div class="d-flex align-items-center justify-content-between">' +
      '<span class="subtitle mb-0">Trainer Evaluation</span>' +
      '<div class="app-stars">' +
      starsHTML(ev.stars) +
      "</div>" +
      "</div>" +
      '<div class="row g-3 mt-0">' +
      '<div class="col-sm-6">' +
      '<h4 class="subtitle subtitle--green mb-0">' +
      '<i data-lucide="check" width="19" height="19"></i> What\'s Good' +
      "</h4>" +
      evalPointsHTML(ev.whatsGood) +
      "</div>" +
      '<div class="col-sm-6">' +
      '<h4 class="subtitle subtitle--orange mb-0">' +
      '<i data-lucide="alert-circle" width="19" height="19"></i> Needs Attention' +
      "</h4>" +
      evalPointsHTML(ev.needsAttention) +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="d-flex flex-column gap-3">' +
      '<h4 class="subtitle mb-3">Coach\'s Notes</h4>' +
      '<p class="pc-body-text">' +
      window.AppShared.escapeHtml(ev.coachNotes) +
      "</p>" +
      "</div>" +
      '<div class="d-flex flex-column gap-3">' +
      '<h4 class="subtitle subtitle--orange mb-0">How To Fix</h4>' +
      '<ul class="pc-fix-list">' +
      fixListItemsHTML(ev.howToFix) +
      "</ul>" +
      "</div>" +
      "</div>";
    document.getElementById("beforeDetail").innerHTML = html;
  }

  function renderAfterList(dateRange) {
    var list = filteredByStroke().filter(function (e) {
      return e.id !== state.beforeId;
    });
    if (dateRange && dateRange.length === 2) {
      var from = dateRange[0].getTime(),
        to = dateRange[1].getTime();
      list = list.filter(function (e) {
        var t = new Date(e.date).getTime();
        return t >= from && t <= to;
      });
    }
    var el = document.getElementById("afterEvalList");
    if (!list.length) {
      el.innerHTML =
        '<p class="text-center text-muted-app py-4">No evaluations found.</p>';
      return;
    }
    el.innerHTML = list
      .map(function (e) {
        return evalCardHTML(e, state.afterId === e.id);
      })
      .join("");
    bindCardClicks(el, "after");
    window.AppShared.initLucideIcons();
  }

  document
    .getElementById("step3BackArrow")
    .addEventListener("click", function () {
      goToStep(2, "back");
    });
  document.getElementById("step3Back").addEventListener("click", function () {
    goToStep(2, "back");
  });
  document.getElementById("step3Next").addEventListener("click", function () {
    if (!state.afterId) return;
    closeWizard();
    showComparison();
  });

  ["wizardClose1", "wizardClose2", "wizardClose3"].forEach(function (id) {
    document.getElementById(id).addEventListener("click", closeWizard);
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeWizard();
  });

  function showComparison() {
    var earlier = EVALUATIONS.find(function (e) {
      return e.id === state.beforeId;
    });
    var later = EVALUATIONS.find(function (e) {
      return e.id === state.afterId;
    });
    if (!earlier || !later) return;

    if (new Date(earlier.date) > new Date(later.date)) {
      var tmp = earlier;
      earlier = later;
      later = tmp;
    }

    emptyState.classList.add("d-none");
    compResult.classList.remove("d-none");
    btnNew.classList.remove("d-none");

    document.getElementById("earlierDate").textContent = earlier.dateDisplay;
    document.getElementById("laterDate").textContent = later.dateDisplay;
    document.getElementById("earlierVideo").poster = earlier.img;
    document.getElementById("laterVideo").poster = later.img;

    document.getElementById("earlierStars").innerHTML = starsHTML(
      earlier.stars,
    );
    document.getElementById("laterStars").innerHTML = starsHTML(later.stars);

    renderEvalPointsList("earlierGood", earlier.whatsGood);
    renderEvalPointsList("earlierAttention", earlier.needsAttention);
    renderEvalPointsList("laterGood", later.whatsGood);
    renderEvalPointsList("laterAttention", later.needsAttention);

    document.getElementById("earlierNotes").textContent = earlier.coachNotes;
    document.getElementById("laterNotes").textContent = later.coachNotes;

    renderFixList("earlierFix", earlier.howToFix);
    renderFixList("laterFix", later.howToFix);

    document.getElementById("tlFrom").textContent = earlier.dateDisplay;
    document.getElementById("tlTo").textContent = later.dateDisplay;
    document.getElementById("tlDays").textContent =
      daysBetween(earlier.date, later.date) + " Days";

    var improvements = later.whatsGood.filter(function (g) {
      return earlier.whatsGood.indexOf(g) === -1;
    });
    if (!improvements.length)
      improvements = [
        "Lorem Ipsum Dolor Sit Amet Consectetur",
        "Effictur Multis Ulora Purus Nunc Fragilis",
        "Sit Dictum Batlincir Cursui Pretium Commodo Rutrum",
      ];
    renderTimelineList("tlImprovementsList", improvements);

    var workingOn = later.needsAttention.slice();
    if (!workingOn.length) workingOn = ["Continue Monitoring Progress"];
    renderTimelineList("tlWorkingOnList", workingOn);

    renderRefCard("earlierRefCard", earlier);
    renderRefCard("laterRefCard", later);

    window.AppShared.initLucideIcons();
    if (pcTimelineTabs && pcTimelineTabs._slidingSegSync) {
      pcTimelineTabs._slidingSegSync();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function evalPointsHTML(items) {
    if (!items || !items.length) {
      return '<p class="pc-body-text small mb-0 text-muted-app">None listed</p>';
    }
    return (
      '<ul class="pc-eval-points-list">' +
      items
        .map(function (t) {
          return "<li>" + window.AppShared.escapeHtml(t) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function renderEvalPointsList(id, items) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = evalPointsHTML(items);
  }

  function fixListItemsHTML(items) {
    if (!items || !items.length) return "";
    return items
      .map(function (t) {
        return "<li>" + window.AppShared.escapeHtml(t) + "</li>";
      })
      .join("");
  }

  function renderFixList(id, items) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = fixListItemsHTML(items);
  }

  function renderTimelineList(id, items) {
    document.getElementById(id).innerHTML = items
      .map(function (t) {
        return "<li>" + t + "</li>";
      })
      .join("");
  }

  function renderRefCard(id, ev) {
    var badgeClass =
      ev.stroke === "Forehand" ? "badge-tag--orange" : "badge-tag";
    document.getElementById(id).innerHTML =
      '<div class="d-flex gap-3 align-items-start">' +
      '<div class="pc-ref-thumb"><img src="' +
      ev.img +
      '" alt="" /></div>' +
      "<div>" +
      '<h4 class="fw-bold mb-1 pc-ref-title">' +
      ev.stroke +
      " Evaluation</h4>" +
      '<div class="d-flex flex-wrap gap-2 mt-2">' +
      ev.tags
        .map(function (t) {
          var cls = t === ev.stroke ? badgeClass : "badge-tag";
          return '<span class="badge-tag ' + cls + '">' + t + "</span>";
        })
        .join("") +
      '<span class="badge-tag badge-tag--green">Intermediate</span>' +
      "</div>" +
      "</div>" +
      "</div>";
  }

  var pcTimelineTabs = document.getElementById("pcTimelineTabs");
  if (pcTimelineTabs) {
    window.AppShared.initSlidingSegmented(pcTimelineTabs, {
      trackSelector: ".app-segmented-tabs__track",
      btnSelector: ".app-segmented-tabs__tab",
    });
    pcTimelineTabs
      .querySelectorAll(".app-segmented-tabs__tab")
      .forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = tab.dataset.tab;
          document
            .getElementById("tlImprovements")
            .classList.toggle("d-none", target !== "improvements");
          document
            .getElementById("tlWorkingOn")
            .classList.toggle("d-none", target !== "working-on");
          pcTimelineTabs
            .querySelectorAll(".app-segmented-tabs__tab")
            .forEach(function (t) {
              t.setAttribute("aria-selected", t === tab ? "true" : "false");
            });
        });
      });
  }

  state.beforeDatePicker = flatpickr("#beforeDateRange", {
    mode: "range",
    dateFormat: "m/d/Y",
    disableMobile: true,
    onChange: function (dates) {
      renderBeforeList(dates.length === 2 ? dates : null);
    },
  });

  state.afterDatePicker = flatpickr("#afterDateRange", {
    mode: "range",
    dateFormat: "m/d/Y",
    disableMobile: true,
    onChange: function (dates) {
      renderAfterList(dates.length === 2 ? dates : null);
    },
  });

  document
    .getElementById("btnStartWizard")
    .addEventListener("click", openWizard);
  btnNew.addEventListener("click", function () {
    compResult.classList.add("d-none");
    emptyState.classList.remove("d-none");
    btnNew.classList.add("d-none");
    openWizard();
  });

  var pcAddPlayerOverlay = document.getElementById("pcAddPlayerOverlay");
  document
    .getElementById("pcAddPlayerClose")
    .addEventListener("click", function () {
      pcAddPlayerOverlay.classList.remove("is-open");
    });
  pcAddPlayerOverlay.addEventListener("click", function (e) {
    if (e.target === pcAddPlayerOverlay)
      pcAddPlayerOverlay.classList.remove("is-open");
  });

  window.AppShared.bindExclusiveLevelBadges("#pcApLevel");
  window.AppShared.bindToggleGroupChips("#pcApGroup");

  function resetPcAddPlayerFormDefaults() {
    document.querySelectorAll("#pcApLevel .badge-tag").forEach(function (btn) {
      var val = btn.getAttribute("data-value");
      var color = btn.getAttribute("data-level-color");
      if (val === "2.0") {
        btn.className = "badge-tag badge-tag--green is-selected";
        btn.innerHTML =
          '<span class="badge-tag__check"><i data-lucide="check" width="12" height="12"></i></span> 2.0';
      } else {
        btn.className = "badge-tag";
        btn.textContent = val;
      }
    });
    document.querySelectorAll("#pcApGroup .badge-tag").forEach(function (btn) {
      var val = btn.getAttribute("data-value");
      var label = btn.getAttribute("data-label") || "";
      if (val === "mon-thu") {
        btn.className = "badge-tag badge-tag--orange is-selected";
        btn.innerHTML =
          '<span class="badge-tag__check"><i data-lucide="check" width="12" height="12"></i></span> ' +
          label;
      } else {
        btn.className = "badge-tag";
        btn.textContent = label;
      }
    });
    window.AppShared.initLucideIcons();
  }

  var pcAddPlayerForm = document.getElementById("pcAddPlayerForm");
  if (pcAddPlayerForm) {
    window.AppShared.bindLiveFormValidationReset(pcAddPlayerForm);
  }
  document
    .getElementById("pcAddPlayerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      window.AppShared.clearFormValidation(pcAddPlayerForm);
      if (!window.AppShared.validateRequiredFormFields(pcAddPlayerForm)) return;
      var name = document.getElementById("pcApName").value.trim();
      var t = { id: nextTraineeId++, name: name };
      TRAINEES.push(t);
      TRAINEES.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      pcAddPlayerOverlay.classList.remove("is-open");
      document.getElementById("pcAddPlayerForm").reset();
      resetPcAddPlayerFormDefaults();
      selectTrainee(t);
      renderTraineeOptions("");
      setTraineeDropdownOpen(false);
      window.AppShared.initLucideIcons();
      var succ = document.getElementById("pcApSuccessOverlay");
      succ.classList.add("is-open");
      clearTimeout(window._pcApSuccT);
      window._pcApSuccT = setTimeout(function () {
        succ.classList.remove("is-open");
      }, 2000);
    });

  document
    .getElementById("pcApSuccessOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("is-open");
    });

  (function () {
    var expandOverlay = document.getElementById("videoExpandOverlay");
    var expandPlayer = document.getElementById("videoExpandPlayer");
    var expandClose = document.getElementById("videoExpandClose");
    var sourceVideo = null;

    function openExpand(srcVideo) {
      sourceVideo = srcVideo;
      srcVideo.pause();
      expandPlayer.src = srcVideo.currentSrc || srcVideo.src;
      expandPlayer.currentTime = srcVideo.currentTime;
      expandOverlay.classList.add("is-open");
      expandPlayer.play();
    }

    function closeExpand() {
      expandPlayer.pause();
      if (sourceVideo) {
        sourceVideo.currentTime = expandPlayer.currentTime;
      }
      expandOverlay.classList.remove("is-open");
      setTimeout(function () {
        expandPlayer.removeAttribute("src");
        expandPlayer.load();
      }, 300);
    }

    expandClose.addEventListener("click", closeExpand);
    expandOverlay.addEventListener("click", function (e) {
      if (e.target === expandOverlay) closeExpand();
    });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='expand']");
      if (btn) {
        var targetId = btn.dataset.target;
        var video = document.getElementById(targetId);
        if (video) openExpand(video);
      }

      var pipBtn = e.target.closest("[data-action='pip']");
      if (pipBtn) {
        var wrap = pipBtn.closest(".pc-eval-panel__video");
        if (wrap) {
          var vid = wrap.querySelector("video");
          if (vid && document.pictureInPictureEnabled) {
            vid.requestPictureInPicture().catch(function () {});
          }
        }
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && expandOverlay.classList.contains("is-open")) {
        closeExpand();
      }
    });
  })();
})();
