var S = window.AppShared;
S.initLucideIcons();

S.initMultiselect(document.getElementById("prFilterSkill"));
S.initMultiselect(document.getElementById("prFilterAngle"));
S.initMultiselect(document.getElementById("prModalSkill"));
S.initMultiselect(document.getElementById("prModalStroke"));
S.bindMultiselectOutsideClose();

S.bindTagSection(
  "prFilterTagInput",
  "prFilterTagAdd",
  "prFilterTagsAdded",
  "prFilterTagSuggest",
);
S.bindTagSection(
  "prModalTagInput",
  "prModalTagAdd",
  "prModalTagsAdded",
  "prModalTagSuggest",
);

var prUploadForm = document.getElementById("prUploadForm");

var prFilterBackdrop = document.getElementById("prFilterBackdrop");
var prFilterPanel = document.getElementById("prFilterPanel");
function openFilter() {
  prFilterBackdrop.classList.add("is-open");
  prFilterPanel.classList.add("is-open");
}
function closeFilter() {
  prFilterBackdrop.classList.remove("is-open");
  prFilterPanel.classList.remove("is-open");
}
document.getElementById("prFilterOpen").addEventListener("click", openFilter);
document.getElementById("prFilterClose").addEventListener("click", closeFilter);
prFilterBackdrop.addEventListener("click", closeFilter);

var prSkillMs = document.getElementById("prFilterSkill");
var prAngleMs = document.getElementById("prFilterAngle");
var prSearchInput = document.getElementById("prSearchInput");

var prFilterActive = { skills: [], angles: [], tagTokens: [] };

function filterTagTokens() {
  var tokens = [];
  document
    .querySelectorAll("#prFilterTagSuggest .app-tag-suggest.is-selected")
    .forEach(function (s) {
      tokens.push(
        (s.getAttribute("data-tag") || s.textContent).trim().toLowerCase(),
      );
    });
  document
    .querySelectorAll("#prFilterTagsAdded .badge-tag-chip")
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
    (card.getAttribute("data-stroke") || "") +
    " " +
    (card.getAttribute("data-skill") || "") +
    " " +
    (card.getAttribute("data-angle") || "")
  ).toLowerCase();
}

function cardMatchesFilter(card) {
  var skills = prFilterActive.skills;
  var angles = prFilterActive.angles;
  var tagTok = prFilterActive.tagTokens;
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
  var q = prSearchInput.value.trim().toLowerCase();
  document.querySelectorAll("#prClipGrid .cc-card").forEach(function (card) {
    var okF = cardMatchesFilter(card);
    var okS = !q || cardBlob(card).indexOf(q) !== -1;
    card.classList.toggle("is-hidden", !(okF && okS));
  });
}

function applyFilters() {
  prFilterActive.skills = prSkillMs._getSelected();
  prFilterActive.angles = prAngleMs._getSelected();
  prFilterActive.tagTokens = filterTagTokens();
  refreshCardVisibility();
  closeFilter();
}

document
  .getElementById("prFilterApply")
  .addEventListener("click", applyFilters);
document.getElementById("prFilterReset").addEventListener("click", function () {
  prSkillMs._reset();
  prAngleMs._reset();
  document.getElementById("prFilterTagsAdded").innerHTML = "";
  document
    .querySelectorAll("#prFilterTagSuggest .app-tag-suggest")
    .forEach(function (s) {
      s.classList.remove("is-selected");
      S.syncTagSuggestSelectionState(s, true);
    });
  S.initLucideIcons();
  prFilterActive = { skills: [], angles: [], tagTokens: [] };
  refreshCardVisibility();
});

function runSearch() {
  refreshCardVisibility();
}
document.getElementById("prSearchBtn").addEventListener("click", runSearch);
prSearchInput.addEventListener("keydown", function (e) {
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

function sortCards() {
  var grid = document.getElementById("prClipGrid");
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
    .querySelectorAll("#prModalTagSuggest .app-tag-suggest.is-selected")
    .forEach(function (s) {
      list.push((s.getAttribute("data-tag") || s.textContent).trim());
    });
  document
    .querySelectorAll("#prModalTagsAdded .badge-tag-chip")
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

var prUploadOverlay = document.getElementById("prUploadOverlay");
document.getElementById("btnOpenUpload").addEventListener("click", function () {
  prUploadOverlay.classList.add("is-open");
  S.initLucideIcons();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var ang = document.getElementById("prModalAngles");
      if (ang && typeof ang._slidingSegSync === "function")
        ang._slidingSegSync();
    });
  });
});
document.getElementById("prUploadClose").addEventListener("click", function () {
  prUploadOverlay.classList.remove("is-open");
});
prUploadOverlay.addEventListener("click", function (e) {
  if (e.target === prUploadOverlay) prUploadOverlay.classList.remove("is-open");
});

var prFileInput = document.getElementById("prFileInput");
var prDropzone = document.getElementById("prDropzone");
var prDropDefault = document.getElementById("prDropDefault");
var prDropDone = document.getElementById("prDropDone");
var prDropUploading = document.getElementById("prDropUploading");
var prProgressBar = document.getElementById("prProgressBar");
var prProgressTrack = document.getElementById("prProgressTrack");
var prProgressPct = document.getElementById("prProgressPct");
var prDragBadgeName = document.getElementById("prDragBadgeName");

function resetPrUploadProgress() {
  if (prProgressBar) prProgressBar.style.width = "0%";
  if (prProgressPct) prProgressPct.textContent = "0%";
  if (prProgressTrack) prProgressTrack.setAttribute("aria-valuenow", "0");
}

function hidePrUploadingUI() {
  if (prDropUploading) prDropUploading.classList.add("d-none");
  prDropzone.classList.remove("is-uploading");
  resetPrUploadProgress();
}

function showPrUploadingUI() {
  prDropDefault.classList.add("d-none");
  prDropDone.classList.add("d-none");
  if (prDropUploading) prDropUploading.classList.remove("d-none");
  prDropzone.classList.add("is-uploading");
  prDropzone.classList.remove("is-dragging");
  resetPrUploadProgress();
}

document.getElementById("prBrowseBtn").addEventListener("click", function (e) {
  e.stopPropagation();
  prFileInput.click();
});
prDropzone.addEventListener("click", function () {
  if (!prDropDone.classList.contains("d-none")) return;
  if (prDropzone.classList.contains("is-uploading")) return;
  prFileInput.click();
});
prDropzone.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  prDropzone.classList.add("is-dragging");
  var nm = S.dragFileNameFromEvent(e);
  if (prDragBadgeName) prDragBadgeName.textContent = nm || "Drop video";
});
prDropzone.addEventListener("dragleave", function (e) {
  var rel = e.relatedTarget;
  if (rel && prDropzone.contains(rel)) return;
  prDropzone.classList.remove("is-dragging");
  if (prDragBadgeName) prDragBadgeName.textContent = "Drop video";
});
prDropzone.addEventListener("drop", function (e) {
  e.preventDefault();
  prDropzone.classList.remove("is-dragging");
  if (prDragBadgeName) prDragBadgeName.textContent = "Drop video";
  if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
});
prFileInput.addEventListener("change", function () {
  if (prFileInput.files.length) pickFile(prFileInput.files[0]);
});
function pickFile(file) {
  if (!file || !file.type.startsWith("video/")) {
    S.setFieldInvalid(
      prDropzone,
      "Upload failed. Please select a valid video file and try again.",
    );
    return;
  }
  S.clearFieldInvalid(prDropzone);
  document.getElementById("prFileName").textContent = file.name;
  document.getElementById("prFileSize").textContent = S.formatFileSize(
    file.size,
  );
  prDropDefault.classList.add("d-none");
  prDropDone.classList.remove("d-none");
  prDropzone.classList.add("has-file");
  prDropzone.classList.remove("is-dragging");
}
document.getElementById("prFileRemove").addEventListener("click", function (e) {
  e.stopPropagation();
  if (window._prUploadSim) {
    window._prUploadSim.cancel();
    window._prUploadSim = null;
  }
  hidePrUploadingUI();
  prFileInput.value = "";
  prDropDefault.classList.remove("d-none");
  prDropDone.classList.add("d-none");
  prDropzone.classList.remove("has-file");
  S.clearFieldInvalid(prDropzone);
});
document
  .getElementById("prUploadCancel")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    if (window._prUploadSim) {
      window._prUploadSim.cancel();
      window._prUploadSim = null;
    }
    hidePrUploadingUI();
    prDropDone.classList.remove("d-none");
  });

window.AppShared.initSlidingSegmented(
  document.getElementById("prModalAngles"),
  { trackSelector: ".cc-angle__track", btnSelector: ".cc-angle-btn" },
);

S.wireUploadModalValidationUX({
  form: prUploadForm,
  dropzone: prDropzone,
  urlInput: document.getElementById("prModalUrl"),
  multiselectIds: ["prModalStroke", "prModalSkill"],
});

document.getElementById("prModalSave").addEventListener("click", function () {
  if (prUploadForm) S.clearFormValidation(prUploadForm);
  var file = prFileInput.files && prFileInput.files[0];
  var url = document.getElementById("prModalUrl").value.trim();
  var ok = true;
  if (!S.validateFileOrUrl(file, url, prDropzone)) ok = false;
  if (
    !S.validateMultiselectHasSelection(
      document.getElementById("prModalStroke"),
      "Please select a stroke type.",
    )
  ) {
    ok = false;
  }
  if (prUploadForm && !S.validateRequiredFormFields(prUploadForm)) ok = false;
  if (!ok) return;
  var titleIn = document.getElementById("prModalTitle").value.trim();
  var playerIn = document.getElementById("prModalPlayerName").value.trim();

  function runProSave() {
    var strokeMs = document.getElementById("prModalStroke");
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
      "#prModalAngles .cc-angle-btn.is-active",
    );
    var angle = angleBtn ? angleBtn.getAttribute("data-val") : "Behind Player";
    var sk = document.getElementById("prModalSkill")._getSelected();
    var skill = sk[0] || "Intermediate";
    var extraTags = collectModalTags();
    var title =
      titleIn || (file ? file.name.replace(/\.[^/.]+$/, "") : "") || "Pro clip";
    var today = new Date();
    var iso =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    var mediaUrl = file ? URL.createObjectURL(file) : S.youtubeThumb(url);
    var isVideo = !!file;

    var grid = document.getElementById("prClipGrid");
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
      S.skillClassPro(skill) +
      '">' +
      skill +
      '</span><span class="badge-tag badge-tag--purple">Pro</span>';
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
      '<button type="button" class="cc-skip-back" aria-label="Back 15 seconds"><i data-lucide="rotate-ccw" width="16" height="16"></i></button>' +
      '<button type="button" class="cc-card__play cc-play-toggle" aria-label="Play"><i data-lucide="play" width="22" height="22"></i></button>' +
      '<button type="button" class="cc-skip-fwd" aria-label="Forward 15 seconds"><i data-lucide="rotate-cw" width="16" height="16"></i></button>' +
      "</div></div>" +
      '<div class="cc-card__body"><h2 class="cc-card__title"></h2>' +
      '<p class="cc-card__pro-name mb-0"></p>' +
      '<div class="cc-card__tags">' +
      tagsHtml +
      '</div><div class="d-flex justify-content-between mt-auto pt-3 border-top"><span class="app-trainee-card__joined">Uploaded</span><span class="app-trainee-card__joined-date"></span></div></div>';

    card.innerHTML = inner;
    card.querySelector(".cc-card__title").textContent = title;
    card.querySelector(".cc-card__pro-name").textContent = playerIn;
    card.querySelector(".app-trainee-card__joined-date").textContent =
      S.formatDisplayDate(iso);
    if (isVideo) card.querySelector("video").src = mediaUrl;
    else card.querySelector("img").src = mediaUrl;

    grid.insertBefore(card, grid.firstChild);
    S.wireCardMedia(card, 15);
    S.initLucideIcons();

    prUploadOverlay.classList.remove("is-open");
    document.getElementById("prModalUrl").value = "";
    document.getElementById("prModalTitle").value = "";
    document.getElementById("prModalPlayerName").value = "";
    document.getElementById("prModalStroke")._reset();
    document.getElementById("prModalSkill")._reset();
    document.getElementById("prModalTagsAdded").innerHTML = "";
    document
      .querySelectorAll("#prModalTagSuggest .app-tag-suggest")
      .forEach(function (s) {
        s.classList.remove("is-selected");
        S.syncTagSuggestSelectionState(s, true);
      });
    S.initLucideIcons();
    prFileInput.value = "";
    hidePrUploadingUI();
    prDropDefault.classList.remove("d-none");
    prDropDone.classList.add("d-none");
    prDropzone.classList.remove("has-file");
    refreshCardVisibility();

    var succ = document.getElementById("prSuccessOverlay");
    succ.classList.add("is-open");
    clearTimeout(window._prSuccT);
    window._prSuccT = setTimeout(function () {
      succ.classList.remove("is-open");
    }, 2200);
  }

  if (file) {
    showPrUploadingUI();
    window._prUploadSim = S.runSimulatedUpload({
      barEl: prProgressBar,
      pctEl: prProgressPct,
      trackEl: prProgressTrack,
      onDone: function () {
        window._prUploadSim = null;
        runProSave();
      },
    });
  } else {
    runProSave();
  }
});

document
  .getElementById("prSuccessOverlay")
  .addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("is-open");
  });

document.querySelectorAll("#prClipGrid .cc-card").forEach(function (c) {
  S.wireCardMedia(c, 15);
});
