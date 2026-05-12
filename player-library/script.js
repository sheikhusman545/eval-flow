var S = window.AppShared;
S.initLucideIcons();

S.initMultiselect(document.getElementById("plFilterSkill"));
S.initMultiselect(document.getElementById("plFilterAngle"));
S.initMultiselect(document.getElementById("plModalSkill"));
S.initMultiselect(document.getElementById("plModalStroke"));
S.bindMultiselectOutsideClose();

S.bindTagSection(
  "plFilterTagInput",
  "plFilterTagAdd",
  "plFilterTagsAdded",
  "plFilterTagSuggest",
);
S.bindTagSection(
  "plModalTagInput",
  "plModalTagAdd",
  "plModalTagsAdded",
  "plModalTagSuggest",
);

var plUploadForm = document.getElementById("plUploadForm");

var plFilterBackdrop = document.getElementById("plFilterBackdrop");
var plFilterPanel = document.getElementById("plFilterPanel");
function openFilter() {
  plFilterBackdrop.classList.add("is-open");
  plFilterPanel.classList.add("is-open");
}
function closeFilter() {
  plFilterBackdrop.classList.remove("is-open");
  plFilterPanel.classList.remove("is-open");
}
document.getElementById("plFilterOpen").addEventListener("click", openFilter);
document.getElementById("plFilterClose").addEventListener("click", closeFilter);
plFilterBackdrop.addEventListener("click", closeFilter);

var plSkillMs = document.getElementById("plFilterSkill");
var plAngleMs = document.getElementById("plFilterAngle");
var plSearchInput = document.getElementById("plSearchInput");

var plFilterActive = { skills: [], angles: [], tagTokens: [] };

function filterTagTokens() {
  var tokens = [];
  document
    .querySelectorAll("#plFilterTagSuggest .app-tag-suggest.is-selected")
    .forEach(function (s) {
      tokens.push(
        (s.getAttribute("data-tag") || s.textContent).trim().toLowerCase(),
      );
    });
  document
    .querySelectorAll("#plFilterTagsAdded .badge-tag-chip")
    .forEach(function (c) {
      tokens.push((c.getAttribute("data-tag") || "").trim().toLowerCase());
    });
  return tokens;
}

function cardBlob(card) {
  return (
    (card.getAttribute("data-title") || "") +
    " " +
    (card.getAttribute("data-player") || "") +
    " " +
    (card.getAttribute("data-tags") || "") +
    " " +
    (card.getAttribute("data-stroke") || "")
  ).toLowerCase();
}

function cardMatchesFilter(card) {
  var skills = plFilterActive.skills;
  var angles = plFilterActive.angles;
  var tagTok = plFilterActive.tagTokens;
  if (skills.length && skills.indexOf(card.getAttribute("data-skill")) === -1)
    return false;
  if (angles.length && angles.indexOf(card.getAttribute("data-angle")) === -1)
    return false;
  if (tagTok.length) {
    var blob = cardBlob(card);
    var stroke = (card.getAttribute("data-stroke") || "").toLowerCase();
    for (var i = 0; i < tagTok.length; i++) {
      var t = tagTok[i];
      if (blob.indexOf(t) === -1 && stroke !== t) return false;
    }
  }
  return true;
}

function refreshCardVisibility() {
  var q = plSearchInput.value.trim().toLowerCase();
  document.querySelectorAll("#plClipGrid .cc-card").forEach(function (card) {
    var okF = cardMatchesFilter(card);
    var okS = !q || cardBlob(card).indexOf(q) !== -1;
    card.classList.toggle("is-hidden", !(okF && okS));
  });
}

function applyFilters() {
  plFilterActive.skills = plSkillMs._getSelected();
  plFilterActive.angles = plAngleMs._getSelected();
  plFilterActive.tagTokens = filterTagTokens();
  refreshCardVisibility();
  closeFilter();
}

document
  .getElementById("plFilterApply")
  .addEventListener("click", applyFilters);
document.getElementById("plFilterReset").addEventListener("click", function () {
  plSkillMs._reset();
  plAngleMs._reset();
  document.getElementById("plFilterTagsAdded").innerHTML = "";
  document
    .querySelectorAll("#plFilterTagSuggest .app-tag-suggest")
    .forEach(function (s) {
      s.classList.remove("is-selected");
      S.syncTagSuggestSelectionState(s, true);
    });
  S.initLucideIcons();
  plFilterActive = { skills: [], angles: [], tagTokens: [] };
  refreshCardVisibility();
});

function runSearch() {
  refreshCardVisibility();
}
document.getElementById("plSearchBtn").addEventListener("click", runSearch);
plSearchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") runSearch();
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

function parseCardDate(s) {
  if (!s) return 0;
  if (String(s).indexOf("-") !== -1) {
    var iso = String(s).split("-");
    if (iso.length !== 3) return 0;
    return new Date(+iso[0], +iso[1] - 1, +iso[2]).getTime();
  }
  var p = String(s).split("/");
  if (p.length !== 3) return 0;
  return new Date(+p[2], +p[0] - 1, +p[1]).getTime();
}

function sortCards() {
  var grid = document.getElementById("plClipGrid");
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".cc-card"));
  cards.sort(function (a, b) {
    if (sortKey === "newest" || sortKey === "oldest") {
      var da = parseCardDate(a.getAttribute("data-date"));
      var db = parseCardDate(b.getAttribute("data-date"));
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

function strokeClass(stroke) {
  return stroke ? "badge-tag--orange" : "";
}

function skillClass(skill) {
  if (skill === "Beginner") return "badge-tag--yellow";
  if (skill === "Intermediate") return "badge-tag--blue";
  return "badge-tag--green";
}

function formatDisplayDate(iso) {
  var p = iso.split("-");
  if (p.length !== 3) return iso;
  return +p[1] + "/" + +p[2] + "/" + p[0];
}

function collectModalTags() {
  var list = [];
  document
    .querySelectorAll("#plModalTagSuggest .app-tag-suggest.is-selected")
    .forEach(function (s) {
      list.push((s.getAttribute("data-tag") || s.textContent).trim());
    });
  document
    .querySelectorAll("#plModalTagsAdded .badge-tag-chip")
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

var plUploadOverlay = document.getElementById("plUploadOverlay");
document.getElementById("btnOpenUpload").addEventListener("click", function () {
  plUploadOverlay.classList.add("is-open");
  S.initLucideIcons();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var ang = document.getElementById("plModalAngles");
      if (ang && typeof ang._slidingSegSync === "function")
        ang._slidingSegSync();
    });
  });
});
document.getElementById("plUploadClose").addEventListener("click", function () {
  plUploadOverlay.classList.remove("is-open");
});
plUploadOverlay.addEventListener("click", function (e) {
  if (e.target === plUploadOverlay) plUploadOverlay.classList.remove("is-open");
});

var plFileInput = document.getElementById("plFileInput");
var plDropzone = document.getElementById("plDropzone");
var plDropDefault = document.getElementById("plDropDefault");
var plDropDone = document.getElementById("plDropDone");
var plDropUploading = document.getElementById("plDropUploading");
var plProgressBar = document.getElementById("plProgressBar");
var plProgressTrack = document.getElementById("plProgressTrack");
var plProgressPct = document.getElementById("plProgressPct");
var plDragBadgeName = document.getElementById("plDragBadgeName");

function resetPlUploadProgress() {
  if (plProgressBar) plProgressBar.style.width = "0%";
  if (plProgressPct) plProgressPct.textContent = "0%";
  if (plProgressTrack) plProgressTrack.setAttribute("aria-valuenow", "0");
}

function hidePlUploadingUI() {
  if (plDropUploading) plDropUploading.classList.add("d-none");
  plDropzone.classList.remove("is-uploading");
  resetPlUploadProgress();
}

function showPlUploadingUI() {
  plDropDefault.classList.add("d-none");
  plDropDone.classList.add("d-none");
  if (plDropUploading) plDropUploading.classList.remove("d-none");
  plDropzone.classList.add("is-uploading");
  plDropzone.classList.remove("is-dragging");
  resetPlUploadProgress();
}

document.getElementById("plBrowseBtn").addEventListener("click", function (e) {
  e.stopPropagation();
  plFileInput.click();
});
plDropzone.addEventListener("click", function () {
  if (!plDropDone.classList.contains("d-none")) return;
  if (plDropzone.classList.contains("is-uploading")) return;
  plFileInput.click();
});
plDropzone.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  plDropzone.classList.add("is-dragging");
  var nm = S.dragFileNameFromEvent(e);
  if (plDragBadgeName) plDragBadgeName.textContent = nm || "Drop video";
});
plDropzone.addEventListener("dragleave", function (e) {
  var rel = e.relatedTarget;
  if (rel && plDropzone.contains(rel)) return;
  plDropzone.classList.remove("is-dragging");
  if (plDragBadgeName) plDragBadgeName.textContent = "Drop video";
});
plDropzone.addEventListener("drop", function (e) {
  e.preventDefault();
  plDropzone.classList.remove("is-dragging");
  if (plDragBadgeName) plDragBadgeName.textContent = "Drop video";
  if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
});
plFileInput.addEventListener("change", function () {
  if (plFileInput.files.length) pickFile(plFileInput.files[0]);
});

function pickFile(file) {
  if (!file || !file.type.startsWith("video/")) {
    S.setFieldInvalid(
      plDropzone,
      "Upload failed. Please select a valid video file and try again.",
    );
    return;
  }
  S.clearFieldInvalid(plDropzone);
  document.getElementById("plFileName").textContent = file.name;
  document.getElementById("plFileSize").textContent = S.formatFileSize(
    file.size,
  );
  plDropDefault.classList.add("d-none");
  plDropDone.classList.remove("d-none");
  plDropzone.classList.add("has-file");
  plDropzone.classList.remove("is-dragging");
}

document.getElementById("plFileRemove").addEventListener("click", function (e) {
  e.stopPropagation();
  if (window._plUploadSim) {
    window._plUploadSim.cancel();
    window._plUploadSim = null;
  }
  hidePlUploadingUI();
  plFileInput.value = "";
  plDropDefault.classList.remove("d-none");
  plDropDone.classList.add("d-none");
  plDropzone.classList.remove("has-file");
  S.clearFieldInvalid(plDropzone);
});
document
  .getElementById("plUploadCancel")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    if (window._plUploadSim) {
      window._plUploadSim.cancel();
      window._plUploadSim = null;
    }
    hidePlUploadingUI();
    plDropDone.classList.remove("d-none");
  });

window.AppShared.initSlidingSegmented(
  document.getElementById("plModalAngles"),
  { trackSelector: ".cc-angle__track", btnSelector: ".cc-angle-btn" },
);

S.wireUploadModalValidationUX({
  form: plUploadForm,
  dropzone: plDropzone,
  multiselectIds: ["plModalStroke", "plModalSkill"],
});

document.getElementById("plModalSave").addEventListener("click", function () {
  if (plUploadForm) S.clearFormValidation(plUploadForm);
  var file = plFileInput.files && plFileInput.files[0];
  var ok = true;
  if (
    !S.validateFileOrUrl(
      file,
      "",
      plDropzone,
      "Upload failed. Please select a valid video file and try again.",
    )
  ) {
    ok = false;
  }
  if (
    !S.validateMultiselectHasSelection(
      document.getElementById("plModalStroke"),
      "Please select a stroke type.",
    )
  ) {
    ok = false;
  }
  if (plUploadForm && !S.validateRequiredFormFields(plUploadForm)) ok = false;
  if (!ok) return;
  var titleIn = document.getElementById("plModalTitle").value.trim();
  var playerIn = document.getElementById("plModalPlayerName").value.trim();

  function runPlSave() {
    var strokeMs = document.getElementById("plModalStroke");
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
      "#plModalAngles .cc-angle-btn.is-active",
    );
    var angle = angleBtn ? angleBtn.getAttribute("data-val") : "Behind Player";
    var sk = document.getElementById("plModalSkill")._getSelected();
    var skill = sk[0] || "Intermediate";
    var extraTags = collectModalTags();
    var title = titleIn || file.name.replace(/\.[^/.]+$/, "") || "Trainee clip";
    var today = new Date();
    var iso =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    var mediaUrl = URL.createObjectURL(file);

    var grid = document.getElementById("plClipGrid");
    var card = document.createElement("article");
    card.className = "cc-card";
    card.setAttribute("data-title", title.toLowerCase());
    card.setAttribute("data-player", playerIn.toLowerCase());
    card.setAttribute("data-skill", skill);
    card.setAttribute("data-angle", angle);
    card.setAttribute("data-stroke", stroke || "Video");
    card.setAttribute("data-tags", extraTags.join(",").toLowerCase());
    card.setAttribute("data-date", iso);
    card.setAttribute("data-views", "0");
    card.setAttribute("data-rating", "0");

    var tagsHtml =
      '<span class="badge-tag ' +
      skillClass(skill) +
      '">' +
      skill +
      '</span><span class="badge-tag badge-tag--purple">Player Library</span>';
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
      '<video src="" muted playsinline preload="metadata"></video>' +
      '<button type="button" class="cc-card__expand" aria-label="Expand video"><i data-lucide="maximize-2" width="18" height="18"></i></button>' +
      '<div class="cc-card__controls">' +
      '<button type="button" class="cc-skip-back" aria-label="Back 15 seconds"><i data-lucide="rotate-ccw" width="16" height="16"></i></button>' +
      '<button type="button" class="cc-card__play cc-play-toggle" aria-label="Play"><i data-lucide="play" width="22" height="22"></i></button>' +
      '<button type="button" class="cc-skip-fwd" aria-label="Forward 15 seconds"><i data-lucide="rotate-cw" width="16" height="16"></i></button>' +
      "</div></div>" +
      '<div class="cc-card__body"><h2 class="cc-card__title"></h2>' +
      '<p class="cc-card__player mb-0"></p>' +
      '<div class="cc-card__tags">' +
      tagsHtml +
      '</div><div class="d-flex justify-content-between mt-auto pt-3 border-top"><span class="app-trainee-card__joined">Uploaded</span><span class="app-trainee-card__joined-date"></span></div></div>';

    card.innerHTML = inner;
    card.querySelector(".cc-card__title").textContent = title;
    card.querySelector(".cc-card__player").textContent = playerIn;
    card.querySelector(".app-trainee-card__joined-date").textContent =
      formatDisplayDate(iso);
    card.querySelector("video").src = mediaUrl;

    grid.insertBefore(card, grid.firstChild);
    S.wireCardMedia(card, 15);
    S.initLucideIcons();

    plUploadOverlay.classList.remove("is-open");
    document.getElementById("plModalTitle").value = "";
    document.getElementById("plModalPlayerName").value = "";
    document.getElementById("plModalStroke")._reset();
    document.getElementById("plModalSkill")._reset();
    document.getElementById("plModalTagsAdded").innerHTML = "";
    document
      .querySelectorAll("#plModalTagSuggest .app-tag-suggest")
      .forEach(function (s) {
        s.classList.remove("is-selected");
        S.syncTagSuggestSelectionState(s, true);
      });
    S.initLucideIcons();
    plFileInput.value = "";
    hidePlUploadingUI();
    plDropDefault.classList.remove("d-none");
    plDropDone.classList.add("d-none");
    plDropzone.classList.remove("has-file");
    refreshCardVisibility();

    var succ = document.getElementById("plSuccessOverlay");
    succ.classList.add("is-open");
    clearTimeout(window._plSuccT);
    window._plSuccT = setTimeout(function () {
      succ.classList.remove("is-open");
    }, 2200);
  }

  showPlUploadingUI();
  window._plUploadSim = S.runSimulatedUpload({
    barEl: plProgressBar,
    pctEl: plProgressPct,
    trackEl: plProgressTrack,
    onDone: function () {
      window._plUploadSim = null;
      runPlSave();
    },
  });
});

document
  .getElementById("plSuccessOverlay")
  .addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("is-open");
  });

document.querySelectorAll("#plClipGrid .cc-card").forEach(function (c) {
  S.wireCardMedia(c, 15);
});
