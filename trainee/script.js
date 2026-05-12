(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var showEmpty = params.get("empty") === "1";

  var emptyEl = document.getElementById("timelineEmptyState");
  var popEl = document.getElementById("timelinePopulated");
  var btnCompare = document.getElementById("btnCompare");

  if (emptyEl && popEl) {
    if (showEmpty) {
      emptyEl.classList.remove("d-none");
      popEl.classList.add("d-none");
    } else {
      emptyEl.classList.add("d-none");
      popEl.classList.remove("d-none");
    }
  }

  if (btnCompare) {
    if (showEmpty) {
      btnCompare.classList.add("d-none");
    } else {
      var sessionCount = document.querySelectorAll(
        '#timelinePopulated [data-eval-type="session"]',
      ).length;
      btnCompare.classList.toggle("d-none", sessionCount < 2);
    }
  }

  var fullEvalLink = document.getElementById("tlLinkFullEval");
  if (fullEvalLink) {
    fullEvalLink.addEventListener("click", function () {
      var coachBodyEl = fullEvalLink.querySelector(".tl__body");
      var coachBody = coachBodyEl
        ? coachBodyEl.textContent.replace(/\s+/g, " ").trim()
        : "";
      var cols = fullEvalLink.querySelectorAll(".tl__columns .col-sm-6");
      var working = "";
      if (cols[0]) {
        var wp = cols[0].querySelector(".tl__sub-text");
        if (wp) working = wp.textContent.trim();
      }
      var improve = [];
      if (cols[1]) {
        cols[1].querySelectorAll(".tl__sub-text").forEach(function (p) {
          improve.push(p.textContent.trim());
        });
      }
      var strokes = {};
      fullEvalLink.querySelectorAll(".tl__stroke-row").forEach(function (row) {
        var nameEl = row.querySelector(".tl__stroke-name");
        var badge = row.querySelector(".badge-tag");
        if (nameEl && badge) {
          strokes[nameEl.textContent.trim().toLowerCase()] =
            badge.textContent.trim();
        }
      });
      var overallEl = fullEvalLink.querySelector(".tl__score-val");
      var timeEl = fullEvalLink.querySelector(".tl__date");
      var dateText = "";
      if (timeEl) {
        var clone = timeEl.cloneNode(true);
        clone.querySelectorAll("svg").forEach(function (n) {
          n.remove();
        });
        dateText = clone.textContent.replace(/\s+/g, " ").trim();
      }
      try {
        sessionStorage.setItem(
          "fe_full_eval_timeline",
          JSON.stringify({
            coachBody: coachBody,
            working: working,
            improve: improve,
            strokes: strokes,
            overall: overallEl ? overallEl.textContent.trim() : "",
            date: dateText,
          }),
        );
      } catch (e) {
        /* ignore quota / private mode */
      }
    });
  }

  document
    .querySelectorAll(
      "a.tl__card--session.tl__card--link[href*=\"session-evaluation/index.html?detail\"]",
    )
    .forEach(function (sessionLink) {
      sessionLink.addEventListener("click", function () {
        var coachBodyEl = sessionLink.querySelector(".tl__body");
        var coachBody = coachBodyEl
          ? coachBodyEl.textContent.replace(/\s+/g, " ").trim()
          : "";
        var cols = sessionLink.querySelectorAll(".tl__columns .col-sm-6");
        var working = "";
        if (cols[0]) {
          var wp = cols[0].querySelector(".tl__sub-text");
          if (wp) working = wp.textContent.trim();
        }
        var improve = [];
        if (cols[1]) {
          cols[1].querySelectorAll(".tl__sub-text").forEach(function (p) {
            improve.push(p.textContent.trim());
          });
        }
        var overallEl = sessionLink.querySelector(".tl__score-val");
        var coachRateEl = sessionLink.querySelector(".tl__coach-rate");
        var titleEl = sessionLink.querySelector(".tl__title");
        var timeEl = sessionLink.querySelector(".tl__date");
        var dateText = "";
        if (timeEl) {
          var clone = timeEl.cloneNode(true);
          clone.querySelectorAll("svg").forEach(function (n) {
            n.remove();
          });
          dateText = clone.textContent.replace(/\s+/g, " ").trim();
        }
        try {
          sessionStorage.setItem(
            "se_session_timeline",
            JSON.stringify({
              coachBody: coachBody,
              working: working,
              improve: improve,
              overall: overallEl ? overallEl.textContent.trim() : "",
              coachRate: coachRateEl ? coachRateEl.textContent.trim() : "",
              sessionTitle: titleEl ? titleEl.textContent.trim() : "",
              date: dateText,
            }),
          );
        } catch (e) {
          /* ignore */
        }
      });
    });

  window.AppShared.initLucideIcons();
})();
