(function () {
  var S = window.AppShared;
  S.initLucideIcons();

  S.initMultiselect(document.getElementById("ccFilterSkill"));
  S.initMultiselect(document.getElementById("ccFilterAngle"));
  S.initMultiselect(document.getElementById("ccModalSkill"));
  S.initMultiselect(document.getElementById("ccModalStroke"));
  S.bindMultiselectOutsideClose();

  S.bindTagSection(
    "ccFilterTagInput",
    "ccFilterTagAdd",
    "ccFilterTagsAdded",
    "ccFilterTagSuggest",
  );
  S.bindTagSection(
    "ccModalTagInput",
    "ccModalTagAdd",
    "ccModalTagsAdded",
    "ccModalTagSuggest",
  );

  var ccUploadForm = document.getElementById("ccUploadForm");

  var ccFilterUi = S.bindSideFilter({
    openBtnId: "ccFilterOpen",
    panelId: "ccFilterPanel",
    backdropId: "ccFilterBackdrop",
    closeBtnIds: ["ccFilterClose"],
  });

  var ccSkillMs = document.getElementById("ccFilterSkill");
  var ccAngleMs = document.getElementById("ccFilterAngle");
  var ccSearchInput = document.getElementById("ccSearchInput");

  var ccFilterActive = { skills: [], angles: [], tagTokens: [] };

  function filterTagTokens() {
    var tokens = [];
    document
      .querySelectorAll("#ccFilterTagSuggest .app-tag-suggest.is-selected")
      .forEach(function (s) {
        tokens.push(
          (s.getAttribute("data-tag") || s.textContent).trim().toLowerCase(),
        );
      });
    document
      .querySelectorAll("#ccFilterTagsAdded .badge-tag-chip")
      .forEach(function (c) {
        tokens.push((c.getAttribute("data-tag") || "").trim().toLowerCase());
      });
    return tokens;
  }

  function cardMatchesFilter(card) {
    var skills = ccFilterActive.skills;
    var angles = ccFilterActive.angles;
    var tagTok = ccFilterActive.tagTokens;
    if (skills.length && skills.indexOf(card.getAttribute("data-skill")) === -1)
      return false;
    if (angles.length && angles.indexOf(card.getAttribute("data-angle")) === -1)
      return false;
    if (tagTok.length) {
      var blob =
        (card.getAttribute("data-title") || "") +
        " " +
        (card.getAttribute("data-tags") || "") +
        " " +
        (card.getAttribute("data-stroke") || "");
      blob = blob.toLowerCase();
      var stroke = (card.getAttribute("data-stroke") || "").toLowerCase();
      for (var i = 0; i < tagTok.length; i++) {
        var t = tagTok[i];
        if (blob.indexOf(t) === -1 && stroke !== t) return false;
      }
    }
    return true;
  }

  function refreshCardVisibility() {
    var q = ccSearchInput.value.trim().toLowerCase();
    document.querySelectorAll("#ccClipGrid .cc-card").forEach(function (card) {
      var okF = cardMatchesFilter(card);
      var blob =
        (card.getAttribute("data-title") || "") +
        " " +
        (card.getAttribute("data-tags") || "") +
        " " +
        (card.getAttribute("data-stroke") || "");
      blob = blob.toLowerCase();
      var okS = !q || blob.indexOf(q) !== -1;
      card.classList.toggle("is-hidden", !(okF && okS));
    });
  }

  function applyFilters() {
    ccFilterActive.skills = ccSkillMs._getSelected();
    ccFilterActive.angles = ccAngleMs._getSelected();
    ccFilterActive.tagTokens = filterTagTokens();
    refreshCardVisibility();
    if (ccFilterUi) ccFilterUi.close();
  }

  document
    .getElementById("ccFilterApply")
    .addEventListener("click", applyFilters);
  document
    .getElementById("ccFilterReset")
    .addEventListener("click", function () {
      ccSkillMs._reset();
      ccAngleMs._reset();
      document.getElementById("ccFilterTagsAdded").innerHTML = "";
      document
        .querySelectorAll("#ccFilterTagSuggest .app-tag-suggest")
        .forEach(function (s) {
          s.classList.remove("is-selected");
          S.syncTagSuggestSelectionState(s, true);
        });
      S.initLucideIcons();
      ccFilterActive = { skills: [], angles: [], tagTokens: [] };
      refreshCardVisibility();
    });

  document
    .getElementById("ccSearchBtn")
    .addEventListener("click", refreshCardVisibility);
  ccSearchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") refreshCardVisibility();
  });

  var sortKey = "newest";
  document
    .querySelectorAll(".app-sort-menu .dropdown-item")
    .forEach(function (b) {
      b.addEventListener("click", function () {
        document
          .querySelectorAll(".app-sort-menu .dropdown-item")
          .forEach(function (x) {
            x.classList.remove("active");
          });
        b.classList.add("active");
        sortKey = b.getAttribute("data-sort") || "newest";
        sortCards();
      });
    });

  function sortCards() {
    var grid = document.getElementById("ccClipGrid");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".cc-card"));
    cards.sort(function (a, b) {
      if (sortKey === "newest" || sortKey === "oldest") {
        var da = S.parseCardDate(a.getAttribute("data-date"));
        var db = S.parseCardDate(b.getAttribute("data-date"));
        return sortKey === "newest" ? db - da : da - db;
      }
      if (sortKey === "views") {
        return (
          (+b.getAttribute("data-views") || 0) -
          (+a.getAttribute("data-views") || 0)
        );
      }
      if (sortKey === "rating") {
        return (
          (+b.getAttribute("data-rating") || 0) -
          (+a.getAttribute("data-rating") || 0)
        );
      }
      return 0;
    });
    cards.forEach(function (c) {
      grid.appendChild(c);
    });
  }

  function collectModalTags() {
    var list = [];
    document
      .querySelectorAll("#ccModalTagSuggest .app-tag-suggest.is-selected")
      .forEach(function (s) {
        list.push((s.getAttribute("data-tag") || s.textContent).trim());
      });
    document
      .querySelectorAll("#ccModalTagsAdded .badge-tag-chip")
      .forEach(function (c) {
        list.push((c.getAttribute("data-tag") || "").trim());
      });
    var seen = {};
    return list.filter(function (t) {
      if (!t || seen[t.toLowerCase()]) return false;
      seen[t.toLowerCase()] = true;
      return true;
    });
  }

  var ccUploadOverlay = document.getElementById("ccUploadOverlay");
  document
    .getElementById("btnOpenUpload")
    .addEventListener("click", function () {
      ccUploadOverlay.classList.add("is-open");
      S.initLucideIcons();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var ang = document.getElementById("ccModalAngles");
          if (ang && typeof ang._slidingSegSync === "function")
            ang._slidingSegSync();
        });
      });
    });
  document
    .getElementById("ccUploadClose")
    .addEventListener("click", function () {
      ccUploadOverlay.classList.remove("is-open");
    });
  ccUploadOverlay.addEventListener("click", function (e) {
    if (e.target === ccUploadOverlay)
      ccUploadOverlay.classList.remove("is-open");
  });

  var ccFileInput = document.getElementById("ccFileInput");
  var ccDropzone = document.getElementById("ccDropzone");
  var ccDropDefault = document.getElementById("ccDropDefault");
  var ccDropDone = document.getElementById("ccDropDone");
  var ccDropUploading = document.getElementById("ccDropUploading");
  var ccProgressBar = document.getElementById("ccProgressBar");
  var ccProgressTrack = document.getElementById("ccProgressTrack");
  var ccProgressPct = document.getElementById("ccProgressPct");
  var ccDragBadgeName = document.getElementById("ccDragBadgeName");

  function resetCcUploadProgress() {
    if (ccProgressBar) ccProgressBar.style.width = "0%";
    if (ccProgressPct) ccProgressPct.textContent = "0%";
    if (ccProgressTrack) ccProgressTrack.setAttribute("aria-valuenow", "0");
  }

  function hideCcUploadingUI() {
    if (ccDropUploading) ccDropUploading.classList.add("d-none");
    ccDropzone.classList.remove("is-uploading");
    resetCcUploadProgress();
  }

  function showCcUploadingUI() {
    ccDropDefault.classList.add("d-none");
    ccDropDone.classList.add("d-none");
    if (ccDropUploading) ccDropUploading.classList.remove("d-none");
    ccDropzone.classList.add("is-uploading");
    ccDropzone.classList.remove("is-dragging");
    resetCcUploadProgress();
  }

  document
    .getElementById("ccBrowseBtn")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      ccFileInput.click();
    });
  ccDropzone.addEventListener("click", function () {
    if (!ccDropDone.classList.contains("d-none")) return;
    if (ccDropzone.classList.contains("is-uploading")) return;
    ccFileInput.click();
  });
  ccDropzone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    ccDropzone.classList.add("is-dragging");
    var nm = S.dragFileNameFromEvent(e);
    if (ccDragBadgeName)
      ccDragBadgeName.textContent = nm || "Drop video";
  });
  ccDropzone.addEventListener("dragleave", function (e) {
    var rel = e.relatedTarget;
    if (rel && ccDropzone.contains(rel)) return;
    ccDropzone.classList.remove("is-dragging");
    if (ccDragBadgeName) ccDragBadgeName.textContent = "Drop video";
  });
  ccDropzone.addEventListener("drop", function (e) {
    e.preventDefault();
    ccDropzone.classList.remove("is-dragging");
    if (ccDragBadgeName) ccDragBadgeName.textContent = "Drop video";
    if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
  });
  ccFileInput.addEventListener("change", function () {
    if (ccFileInput.files.length) pickFile(ccFileInput.files[0]);
  });
  function pickFile(file) {
    if (!file || !file.type.startsWith("video/")) {
      S.setFieldInvalid(
        ccDropzone,
        "Upload failed. Please select a valid video file and try again.",
      );
      return;
    }
    S.clearFieldInvalid(ccDropzone);
    document.getElementById("ccFileName").textContent = file.name;
    document.getElementById("ccFileSize").textContent = S.formatFileSize(
      file.size,
    );
    ccDropDefault.classList.add("d-none");
    ccDropDone.classList.remove("d-none");
    ccDropzone.classList.add("has-file");
    ccDropzone.classList.remove("is-dragging");
  }
  document
    .getElementById("ccFileRemove")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      if (window._ccUploadSim) {
        window._ccUploadSim.cancel();
        window._ccUploadSim = null;
      }
      hideCcUploadingUI();
      ccFileInput.value = "";
      ccDropDefault.classList.remove("d-none");
      ccDropDone.classList.add("d-none");
      ccDropzone.classList.remove("has-file");
      S.clearFieldInvalid(ccDropzone);
    });
  document.getElementById("ccUploadCancel").addEventListener("click", function (e) {
    e.stopPropagation();
    if (window._ccUploadSim) {
      window._ccUploadSim.cancel();
      window._ccUploadSim = null;
    }
    hideCcUploadingUI();
    ccDropDone.classList.remove("d-none");
  });

  window.AppShared.initSlidingSegmented(
    document.getElementById("ccModalAngles"),
    { trackSelector: ".cc-angle__track", btnSelector: ".cc-angle-btn" },
  );

  S.wireUploadModalValidationUX({
    form: ccUploadForm,
    dropzone: ccDropzone,
    urlInput: document.getElementById("ccModalUrl"),
    multiselectIds: ["ccModalStroke", "ccModalSkill"],
  });

  document.getElementById("ccModalSave").addEventListener("click", function () {
    if (ccUploadForm) S.clearFormValidation(ccUploadForm);
    var file = ccFileInput.files && ccFileInput.files[0];
    var url = document.getElementById("ccModalUrl").value.trim();
    var ok = true;
    if (!S.validateFileOrUrl(file, url, ccDropzone)) ok = false;
    if (
      !S.validateMultiselectHasSelection(
        document.getElementById("ccModalStroke"),
        "Please select a stroke type.",
      )
    ) {
      ok = false;
    }
    if (ccUploadForm && !S.validateRequiredFormFields(ccUploadForm)) ok = false;
    if (!ok) return;

    function runCoachSave() {
      var titleIn = document.getElementById("ccModalTitle").value.trim();
      var strokeMs = document.getElementById("ccModalStroke");
      var strokePick = strokeMs._getSelected();
      var stroke = strokePick[0] || "";
      var strokeOpt =
        stroke &&
        strokeMs.querySelector(
          '.app-multiselect__option[data-value="' +
            stroke.replace(/"/g, '\\"') +
            '"]',
        );
      var strokeTagMod =
        (strokeOpt && strokeOpt.getAttribute("data-tag")) || "orange";
      var angleBtn = document.querySelector(
        "#ccModalAngles .cc-angle-btn.is-active",
      );
      var angle = angleBtn
        ? angleBtn.getAttribute("data-val")
        : "Behind Player";
      var sk = document.getElementById("ccModalSkill")._getSelected();
      var skill = sk[0] || "Intermediate";
      var extraTags = collectModalTags();
      var title =
        titleIn || (file ? file.name.replace(/\.[^/.]+$/, "") : "Coach clip");
      var today = new Date();
      var iso =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      var mediaUrl = file ? URL.createObjectURL(file) : S.youtubeThumb(url);
      var isVideo = !!file;

      var grid = document.getElementById("ccClipGrid");
      var card = document.createElement("article");
      card.className = "cc-card";
      card.setAttribute("data-title", title.toLowerCase());
      card.setAttribute("data-skill", skill);
      card.setAttribute("data-angle", angle);
      card.setAttribute("data-stroke", stroke || "Video");
      card.setAttribute("data-tags", extraTags.join(",").toLowerCase());
      card.setAttribute("data-date", iso);
      card.setAttribute("data-views", "0");
      card.setAttribute("data-rating", "0");

      var tagsHtml =
        '<span class="badge-tag ' +
        S.skillClass(skill) +
        '">' +
        skill +
        '</span><span class="badge-tag badge-tag--purple">Coach Clips</span>';
      if (stroke)
        tagsHtml +=
          '<span class="badge-tag badge-tag--' +
          strokeTagMod +
          '">' +
          stroke +
          "</span>";
      tagsHtml +=
        '<span class="badge-tag badge-tag--dark-green">' + angle + "</span>";
      extraTags.forEach(function (tg) {
        tagsHtml += '<span class="badge-tag">' + tg + "</span>";
      });

      var inner =
        '<div class="cc-card__media">' +
        (isVideo
          ? '<video src="" muted playsinline preload="metadata"></video>'
          : '<img src="" alt="" />') +
        (isVideo
          ? '<button type="button" class="cc-card__expand" aria-label="Expand video"><i data-lucide="maximize-2" width="18" height="18"></i></button>'
          : "") +
        '<div class="cc-card__controls">' +
        '<button type="button" class="cc-skip-back" aria-label="Back 10 seconds"><i data-lucide="rotate-ccw" width="16" height="16"></i></button>' +
        '<button type="button" class="cc-card__play cc-play-toggle" aria-label="Play"><i data-lucide="play" width="22" height="22"></i></button>' +
        '<button type="button" class="cc-skip-fwd" aria-label="Forward 10 seconds"><i data-lucide="rotate-cw" width="16" height="16"></i></button>' +
        "</div></div>" +
        '<div class="cc-card__body"><h2 class="cc-card__title"></h2>' +
        '<div class="cc-card__tags">' +
        tagsHtml +
        '</div><div class="d-flex justify-content-between mt-auto pt-3 border-top"><span class="app-trainee-card__joined">Uploaded</span><span class="app-trainee-card__joined-date"></span></div></div>';

      card.innerHTML = inner;
      card.querySelector(".cc-card__title").textContent = title;
      card.querySelector(".app-trainee-card__joined-date").textContent =
        S.formatDisplayDate(iso);
      if (isVideo) card.querySelector("video").src = mediaUrl;
      else card.querySelector("img").src = mediaUrl;

      grid.insertBefore(card, grid.firstChild);
      S.wireCardMedia(card, 10);
      S.initLucideIcons();

      ccUploadOverlay.classList.remove("is-open");
      document.getElementById("ccModalUrl").value = "";
      document.getElementById("ccModalTitle").value = "";
      document.getElementById("ccModalStroke")._reset();
      document.getElementById("ccModalSkill")._reset();
      document.getElementById("ccModalTagsAdded").innerHTML = "";
      document
        .querySelectorAll("#ccModalTagSuggest .app-tag-suggest")
        .forEach(function (s) {
          s.classList.remove("is-selected");
          S.syncTagSuggestSelectionState(s, true);
        });
      S.initLucideIcons();
      ccFileInput.value = "";
      hideCcUploadingUI();
      ccDropDefault.classList.remove("d-none");
      ccDropDone.classList.add("d-none");
      ccDropzone.classList.remove("has-file");

      var succ = document.getElementById("ccSuccessOverlay");
      succ.classList.add("is-open");
      clearTimeout(window._ccSuccT);
      window._ccSuccT = setTimeout(function () {
        succ.classList.remove("is-open");
      }, 2200);
    }

    if (file) {
      showCcUploadingUI();
      window._ccUploadSim = S.runSimulatedUpload({
        barEl: ccProgressBar,
        pctEl: ccProgressPct,
        trackEl: ccProgressTrack,
        onDone: function () {
          window._ccUploadSim = null;
          runCoachSave();
        },
      });
    } else {
      runCoachSave();
    }
  });

  document
    .getElementById("ccSuccessOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("is-open");
    });

  document.querySelectorAll("#ccClipGrid .cc-card").forEach(function (c) {
    S.wireCardMedia(c, 10);
  });
})();
