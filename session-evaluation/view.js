(function () {
  "use strict";

  var STORAGE_KEY = "se_session_saved";
  var params = new URLSearchParams(window.location.search);

  if (params.get("detail") === "1") {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      /* ignore */
    }
  }

  var hasEval = localStorage.getItem(STORAGE_KEY) === "true";
  var emptyEl = document.getElementById("seEmptyState");
  var viewEl = document.getElementById("seEvalView");
  var btnEdit = document.getElementById("btnSeViewEdit");

  if (emptyEl && viewEl) {
    if (hasEval) {
      emptyEl.classList.add("d-none");
      viewEl.classList.remove("d-none");
      if (btnEdit) btnEdit.classList.remove("d-none");
    } else {
      emptyEl.classList.remove("d-none");
      viewEl.classList.add("d-none");
    }
  }

  function refreshSeViewRangePreviews() {
    document
      .querySelectorAll("#seEvalView .se-range--preview")
      .forEach(function (range) {
        var min = parseFloat(range.min, 10);
        var max = parseFloat(range.max, 10);
        var val = parseFloat(range.value, 10);
        var pct = ((val - min) / (max - min)) * 100;
        range.style.setProperty("--fill", pct + "%");
      });
  }

  function applySessionTimelineHydration() {
    var raw = sessionStorage.getItem("se_session_timeline");
    if (!raw) return false;
    var d;
    try {
      d = JSON.parse(raw);
    } catch (e) {
      return false;
    }

    var notes = document.getElementById("seViewCoachNotes");
    var good = document.getElementById("seViewGoodList");
    var att = document.getElementById("seViewAttentionList");
    var rateVal = document.getElementById("seViewRateVal");
    var ratePct = document.getElementById("seViewRatePct");
    var range = document.getElementById("seViewRateRange");
    var sub = document.getElementById("seViewPageSubtitle");
    var coachRateEl = document.getElementById("seViewCoachRateLine");

    if (notes && d.coachBody) notes.textContent = d.coachBody;
    if (good && d.working) {
      good.innerHTML = "<li>" + escapeListText(d.working) + "</li>";
    }
    if (att && d.improve && d.improve.length) {
      att.innerHTML = d.improve
        .map(function (t) {
          return "<li>" + escapeListText(t) + "</li>";
        })
        .join("");
    }
    if (sub && (d.sessionTitle || d.date)) {
      var parts = [];
      if (d.sessionTitle) parts.push(d.sessionTitle);
      if (d.date) parts.push(d.date);
      sub.textContent = parts.join(" · ");
    }
    if (coachRateEl && d.coachRate) {
      coachRateEl.textContent = "Coach feedback: " + d.coachRate;
    }

    if (d.overall) {
      var num = parseFloat(String(d.overall).replace(/[^\d.]/g, ""), 10);
      if (!isNaN(num)) {
        var clamped = Math.min(10, Math.max(0, num));
        if (rateVal) rateVal.textContent = clamped.toFixed(1);
        if (ratePct)
          ratePct.textContent = Math.round((clamped / 10) * 100) + "%";
        if (range) range.value = String(clamped);
      }
    }

    sessionStorage.removeItem("se_session_timeline");
    return true;
  }

  function escapeListText(t) {
    var div = document.createElement("div");
    div.textContent = t;
    return div.innerHTML;
  }

  if (hasEval) {
    applySessionTimelineHydration();
    refreshSeViewRangePreviews();
    if (params.get("detail") === "1") {
      try {
        history.replaceState({}, "", window.location.pathname);
      } catch (e2) {
        /* ignore */
      }
    }
  }

  if (window.AppShared) {
    window.AppShared.bindClipVideoExpandModal();
    document.querySelectorAll("#seEvalView .cc-card").forEach(function (c) {
      window.AppShared.wireCardMedia(c, 10);
    });
  }

  window.AppShared.initLucideIcons();
})();
