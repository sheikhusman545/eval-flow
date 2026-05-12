(function () {
  var S = window.AppShared;
  S.initLucideIcons();

  S.initMultiselectsIn(document);

  (function initTraineeSearchSort() {
    var grid = document.getElementById("traineeGrid");
    var searchInput = document.getElementById("traineeSearchInput");
    var searchBtn = document.getElementById("traineeSearchBtn");
    var emptyEl = document.getElementById("traineeSearchEmpty");
    if (!grid || !searchInput) return;

    var currentSort = "name-asc";

    function sortCards() {
      var cards = Array.prototype.slice.call(
        grid.querySelectorAll(".app-trainee-card"),
      );
      cards.sort(function (a, b) {
        switch (currentSort) {
          case "name-asc":
            return (a.getAttribute("data-name") || "").localeCompare(
              b.getAttribute("data-name") || "",
              undefined,
              { sensitivity: "base" },
            );
          case "level":
            return (
              (+a.getAttribute("data-level-rank") || 0) -
              (+b.getAttribute("data-level-rank") || 0)
            );
          case "joined-desc":
            return (
              new Date(b.getAttribute("data-joined") || 0).getTime() -
              new Date(a.getAttribute("data-joined") || 0).getTime()
            );
          case "eval-desc":
            return (
              new Date(b.getAttribute("data-last-eval") || 0).getTime() -
              new Date(a.getAttribute("data-last-eval") || 0).getTime()
            );
          default:
            return 0;
        }
      });
      cards.forEach(function (c) {
        grid.appendChild(c);
      });
    }

    function filterCards() {
      var q = (searchInput.value || "").trim().toLowerCase();
      var visible = 0;
      grid.querySelectorAll(".app-trainee-card").forEach(function (card) {
        var hay = (card.getAttribute("data-search") || "").toLowerCase();
        var name = (card.getAttribute("data-name") || "").toLowerCase();
        var match = !q || hay.indexOf(q) !== -1 || name.indexOf(q) !== -1;
        card.hidden = !match;
        if (match) visible++;
      });
      if (emptyEl) {
        emptyEl.hidden = visible > 0 || !q;
      }
    }

    function applySortAndFilter() {
      sortCards();
      filterCards();
    }

    function applyFilterOnly() {
      filterCards();
    }

    sortCards();
    filterCards();

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        applyFilterOnly();
      });
    }

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilterOnly();
      }
    });

    searchInput.addEventListener("input", function () {
      applyFilterOnly();
    });

    document.querySelectorAll(".app-sort-menu .dropdown-item").forEach(function (item) {
      item.addEventListener("click", function () {
        document
          .querySelectorAll(".app-sort-menu .dropdown-item")
          .forEach(function (el) {
            el.classList.remove("active");
          });
        item.classList.add("active");
        var sort = item.getAttribute("data-sort");
        if (sort) {
          currentSort = sort;
          applySortAndFilter();
        }
      });
    });
  })();

  S.bindSideFilter({
    openBtnId: "btnFilter",
    panelId: "filterPanel",
    backdropId: "filterBackdrop",
    closeBtnIds: ["filterClose", "filterApply"],
  });

  document.getElementById("filterReset").addEventListener("click", function () {
    S.resetMultiselectsIn(document.getElementById("filterPanel"));
  });

  var addPlayerModal = S.bindCenterOverlay({
    overlayId: "addPlayerOverlay",
    openBtnId: "btnAddTrainee",
    closeBtnId: "addPlayerClose",
  });

  S.bindExclusiveLevelBadges("#playerLevel");
  S.bindToggleGroupChips("#playerGroup");

  var addPlayerForm = document.getElementById("addPlayerForm");
  if (addPlayerForm) {
    S.bindLiveFormValidationReset(addPlayerForm);
    addPlayerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      S.clearFormValidation(addPlayerForm);
      if (!S.validateRequiredFormFields(addPlayerForm)) return;
      if (addPlayerModal) addPlayerModal.close();
      S.flashOverlay("successOverlay", 2000);
    });
  }

  S.bindCenterOverlay({ overlayId: "successOverlay" });
})();
