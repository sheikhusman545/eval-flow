window.AppShared.initLucideIcons();

/* ====== Video Upload & Preview ====== */
(function () {
  var S = window.AppShared;
  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("videoInput");
  var btnBrowse = document.getElementById("btnBrowse");
  var btnRemove = document.getElementById("btnRemoveVideo");
  var defaultUI = document.getElementById("dropzoneDefault");
  var uploadedUI = document.getElementById("dropzoneUploaded");
  var nameEl = document.getElementById("uploadedFileName");
  var sizeEl = document.getElementById("uploadedFileSize");
  var videoPlayer = document.getElementById("previewVideo");
  var videoEmpty = document.getElementById("videoEmpty");
  var seDragBadgeName = document.getElementById("seDragBadgeName");
  var currentURL = null;

  function loadVideo(file) {
    if (!file || !file.type.startsWith("video/")) {
      S.setFieldInvalid(
        dropzone,
        "Upload failed. Please select a valid video file and try again.",
      );
      return;
    }
    S.clearFieldInvalid(dropzone);
    if (currentURL) URL.revokeObjectURL(currentURL);
    currentURL = URL.createObjectURL(file);

    nameEl.textContent = file.name;
    sizeEl.textContent = S.formatFileSize(file.size);
    defaultUI.classList.add("d-none");
    uploadedUI.classList.remove("d-none");
    dropzone.classList.add("has-file");
    dropzone.classList.remove("is-dragging");

    videoPlayer.src = currentURL;
    videoPlayer.classList.remove("d-none");
    videoEmpty.classList.add("d-none");
    S.initLucideIcons();
  }

  function removeVideo() {
    if (currentURL) {
      URL.revokeObjectURL(currentURL);
      currentURL = null;
    }
    videoPlayer.removeAttribute("src");
    videoPlayer.classList.add("d-none");
    videoEmpty.classList.remove("d-none");
    defaultUI.classList.remove("d-none");
    uploadedUI.classList.add("d-none");
    dropzone.classList.remove("has-file");
    fileInput.value = "";
    S.clearFieldInvalid(dropzone);
    S.initLucideIcons();
  }

  btnBrowse.addEventListener("click", function (e) {
    e.stopPropagation();
    fileInput.click();
  });
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length) loadVideo(fileInput.files[0]);
  });
  btnRemove.addEventListener("click", function (e) {
    e.stopPropagation();
    removeVideo();
  });

  dropzone.addEventListener("click", function () {
    if (!uploadedUI.classList.contains("d-none")) return;
    if (dropzone.classList.contains("is-uploading")) return;
    fileInput.click();
  });
  dropzone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    dropzone.classList.add("is-dragging");
    var nm = S.dragFileNameFromEvent(e);
    if (seDragBadgeName) seDragBadgeName.textContent = nm || "Drop video";
  });
  dropzone.addEventListener("dragleave", function (e) {
    var rel = e.relatedTarget;
    if (rel && dropzone.contains(rel)) return;
    dropzone.classList.remove("is-dragging");
    if (seDragBadgeName) seDragBadgeName.textContent = "Drop video";
  });
  dropzone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropzone.classList.remove("is-dragging");
    if (seDragBadgeName) seDragBadgeName.textContent = "Drop video";
    var files = e.dataTransfer.files;
    if (files.length) loadVideo(files[0]);
  });
})();

/* ====== Stroke & skill (shared multiselect) ====== */
window.AppShared.initMultiselect(document.getElementById("strokeType"));
window.AppShared.initMultiselect(document.getElementById("skillLevel"));
window.AppShared.initMultiselect(document.getElementById("seLocationSelect"));
window.AppShared.bindMultiselectOutsideClose();
window.AppShared.wireUploadModalValidationUX({
  multiselectIds: ["strokeType"],
});
(function () {
  var skOpt = document.querySelector(
    '#skillLevel .app-multiselect__option[data-value="Adult Beginner"]',
  );
  if (skOpt) skOpt.click();
})();
(function () {
  var locOpt = document.querySelector(
    '#seLocationSelect .app-multiselect__option[data-value="Manhattan, NY"]',
  );
  if (locOpt) locOpt.click();
})();

/* ====== Camera Angle — smooth sliding toggle ====== */
window.AppShared.initSlidingSegmented(document.getElementById("cameraAngle"), {
  trackSelector: ".cc-angle__track",
  btnSelector: ".cc-angle-btn",
});

/* ====== General Rate slider ====== */
(function () {
  var slider = document.getElementById("generalRate");
  var display = document.getElementById("rateValue");
  var previewVal = document.getElementById("previewRateVal");
  var previewRange = document.getElementById("previewRateRange");
  function update() {
    var v = parseFloat(slider.value);
    display.textContent = v.toFixed(1);
    var pct = (v / 10) * 100;
    slider.style.setProperty("--fill", pct + "%");
    previewVal.textContent = v.toFixed(1);
    if (previewRange) {
      previewRange.value = String(v);
      previewRange.style.setProperty("--fill", pct + "%");
    }
  }
  slider.addEventListener("input", update);
  update();
})();

/* ====== Checkboxes → live preview ====== */
function syncChecks() {
  var goodEl = document.getElementById("previewGood");
  var attEl = document.getElementById("previewAttention");
  var goodItems = [];
  document.querySelectorAll("#goodChecks input:checked").forEach(function (c) {
    goodItems.push(c.value);
  });
  var attItems = [];
  document
    .querySelectorAll("#attentionChecks input:checked")
    .forEach(function (c) {
      attItems.push(c.value);
    });
  goodEl.innerHTML = goodItems.length
    ? goodItems
        .map(function (t) {
          return "<li>" + t + "</li>";
        })
        .join("")
    : "<li class='text-muted-app'>—</li>";
  attEl.innerHTML = attItems.length
    ? attItems
        .map(function (t) {
          return "<li>" + t + "</li>";
        })
        .join("")
    : "<li class='text-muted-app'>—</li>";
}
document
  .querySelectorAll("#goodChecks input, #attentionChecks input")
  .forEach(function (cb) {
    cb.addEventListener("change", syncChecks);
  });
syncChecks();

/* ====== Coach notes → preview ====== */
document.getElementById("coachNotes").addEventListener("input", function () {
  document.getElementById("previewNotes").textContent = this.value || "—";
});

/* ====== Generate with AI — placeholder (swap for OpenAI when API key is available) ====== */
document.getElementById("btnAI").addEventListener("click", function () {
  var btn = this;
  var textarea = document.getElementById("coachNotes");
  var sampleNotes = [
    "Strong session today. Your rhythm through the ball is more consistent, and recovery between shots looks calmer. Next step: tighten the first move so the racquet path stays on plane through contact. Keep building reps with the same focus next time.",
    "Nice progress on court coverage and intent. The forehand finish is cleaner than last week. Prioritize spacing on the run so you are not jammed at contact. Short targets on the service box will help dial in depth control.",
    "Good energy and focus throughout. You are reading the ball earlier on the backhand side. Work on a slightly wider base on the return so you can drive through low balls without lifting early. Overall trajectory is positive.",
    "Solid fundamentals showing up under light pressure. Toss and tempo on serve are steadier. Emphasize leg load into the court on wide serves to open angles. Keep the same pre-serve routine every ball.",
    "Encouraging work on transition footwork. Volleys are more compact at the net. Drill reaction volleys with a partner to sharpen the first step. Rating reflects steady improvement; keep the same weekly volume.",
    "You competed well in cross-court patterns. Depth on the backhand cross is improving. For the next block, add one down-the-line change-up per rally to keep opponents honest. Recovery steps after the shot are the main growth area.",
  ];

  btn.disabled = true;
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>Generating...';

  window.setTimeout(function () {
    var i = Math.floor(Math.random() * sampleNotes.length);
    textarea.value = sampleNotes[i];
    textarea.dispatchEvent(new Event("input"));
    btn.disabled = false;
    btn.innerHTML =
      '<i data-lucide="sparkles" width="18" height="18"></i> Generate with AI';
    window.AppShared.initLucideIcons();
  }, 650);
});

/* ====== Multi-select component (shared) ====== */
function initMultiselect(el) {
  var trigger = el.querySelector(".app-multiselect__trigger");
  var menu = el.querySelector(".app-multiselect__menu");
  var options = el.querySelectorAll(".app-multiselect__option");
  var placeholder = el.querySelector(".app-multiselect__placeholder");
  var selected = [];

  function getTagColor(val) {
    var opt = el.querySelector(
      '.app-multiselect__option[data-value="' + val.replace(/"/g, '\\"') + '"]',
    );
    return (opt && opt.getAttribute("data-tag")) || "green";
  }

  function renderTags() {
    el.querySelectorAll(".app-multiselect__tag").forEach(function (t) {
      t.remove();
    });
    if (selected.length === 0) {
      if (placeholder) placeholder.style.display = "";
    } else {
      if (placeholder) placeholder.style.display = "none";
      selected.forEach(function (val) {
        var color = getTagColor(val);
        var tag = document.createElement("span");
        tag.className = "app-multiselect__tag app-multiselect__tag--" + color;
        tag.innerHTML =
          val +
          '<button type="button" class="app-multiselect__tag-remove" data-val="' +
          val.replace(/"/g, "&quot;") +
          '"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        trigger.insertBefore(tag, placeholder);
      });
    }
    options.forEach(function (opt) {
      var v = opt.getAttribute("data-value");
      opt.classList.toggle("is-selected", selected.indexOf(v) !== -1);
    });
  }

  trigger.addEventListener("click", function (e) {
    if (e.target.closest(".app-multiselect__tag-remove")) {
      var val = e.target
        .closest(".app-multiselect__tag-remove")
        .getAttribute("data-val");
      selected = selected.filter(function (s) {
        return s !== val;
      });
      renderTags();
      return;
    }
    document.querySelectorAll(".app-multiselect.is-open").forEach(function (o) {
      if (o !== el) o.classList.remove("is-open");
    });
    el.classList.toggle("is-open");
  });

  options.forEach(function (opt) {
    opt.addEventListener("click", function (e) {
      e.stopPropagation();
      var val = opt.getAttribute("data-value");
      var idx = selected.indexOf(val);
      if (idx === -1) {
        selected.push(val);
      } else {
        selected.splice(idx, 1);
      }
      renderTags();
    });
  });

  el._reset = function () {
    selected = [];
    renderTags();
  };
  el._getSelected = function () {
    return selected.slice();
  };
  renderTags();
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".app-multiselect")) {
    document.querySelectorAll(".app-multiselect.is-open").forEach(function (o) {
      o.classList.remove("is-open");
    });
  }
});

/* ====== Reference Clips Modal ====== */
(function () {
  var overlay = document.getElementById("clipsOverlay");
  var btnOpen = document.getElementById("btnRefClips");
  var btnClose = document.getElementById("clipsClose");
  var btnConfirm = document.getElementById("clipsConfirm");
  var selectedClipsRow = document.getElementById("selectedClips");
  var previewClipsRow = document.getElementById("previewClips");
  var countBadge = document.getElementById("rcCountBadge");
  var clipList = document.getElementById("rcClipList");
  var clipVideoSuccessOverlay = document.getElementById(
    "clipVideoSuccessOverlay",
  );

  function forEachCard(fn) {
    if (!clipList) return;
    clipList.querySelectorAll(".rc-card").forEach(fn);
  }

  function showClipVideoSuccessToast() {
    if (!clipVideoSuccessOverlay) return;
    clipVideoSuccessOverlay.classList.add("is-open");
    clearTimeout(showClipVideoSuccessToast._t);
    showClipVideoSuccessToast._t = setTimeout(function () {
      clipVideoSuccessOverlay.classList.remove("is-open");
    }, 2200);
  }
  if (clipVideoSuccessOverlay) {
    clipVideoSuccessOverlay.addEventListener("click", function (e) {
      if (e.target === clipVideoSuccessOverlay)
        clipVideoSuccessOverlay.classList.remove("is-open");
    });
  }

  function thumbMediaSrc(card) {
    var img = card.querySelector(".rc-card__thumb img");
    if (img) return img.src;
    var vid = card.querySelector(".rc-card__thumb video");
    return vid ? vid.src : "";
  }

  var tabsWrap = document.getElementById("rcLibSourceTabs");
  var tabs = tabsWrap
    ? tabsWrap.querySelectorAll(".app-segmented-tabs__tab[data-tab]")
    : [];
  var sortBtn = document.getElementById("rcSortBtn");
  var sortMenu = document.getElementById("rcSortMenu");
  var sortOptions = sortMenu
    ? sortMenu.querySelectorAll(".dropdown-item[data-sort]")
    : [];
  function hideSortDropdown() {
    if (typeof bootstrap === "undefined" || !sortBtn) return;
    var inst = bootstrap.Dropdown.getInstance(sortBtn);
    if (inst) inst.hide();
  }
  var filterBtn = document.getElementById("rcFilterBtn");
  var filterPro = document.getElementById("rcFilterPro");
  var filterCoach = document.getElementById("rcFilterCoach");
  var addNewBtn = document.getElementById("rcAddNew");
  var searchInput = document.getElementById("rcSearch");
  var autocomplete = document.getElementById("rcAutocomplete");
  var tagAddBtn = document.getElementById("rcTagAddBtn");
  var tagsSuggested = document.getElementById("rcTagsSuggested");
  var rcCoachTagsSuggested = document.getElementById("rcCoachTagsSuggested");

  if (
    !overlay ||
    !clipList ||
    !tabsWrap ||
    !btnOpen ||
    !searchInput ||
    !filterPro ||
    !filterCoach ||
    !addNewBtn ||
    !sortBtn ||
    !sortMenu ||
    !filterBtn ||
    !autocomplete ||
    !tagAddBtn ||
    !tagsSuggested
  ) {
    return;
  }

  var activeTab = "pro";

  function syncRcCardDisplay() {
    var q = searchInput.value.trim().toLowerCase();
    forEachCard(function (c) {
      var matchesTab = c.dataset.tabSrc === activeTab;
      var filteredOut = c.classList.contains("rc-filtered-out");
      var title = c.querySelector(".rc-card__title").textContent.toLowerCase();
      var blob =
        title +
        " " +
        (c.getAttribute("data-tags") || "") +
        " " +
        (c.getAttribute("data-stroke") || "");
      var matchesSearch = !q || blob.toLowerCase().includes(q);
      c.classList.toggle(
        "d-none",
        !matchesTab || filteredOut || !matchesSearch,
      );
    });
  }

  function collectTagTokensFromPanel(panel) {
    var tokens = [];
    panel
      .querySelectorAll(".cc-tags-suggested .app-tag-suggest.is-selected")
      .forEach(function (s) {
        tokens.push(
          (s.getAttribute("data-tag") || s.textContent).trim().toLowerCase(),
        );
      });
    panel
      .querySelectorAll(".cc-tags-added .badge-tag-chip")
      .forEach(function (chip) {
        tokens.push((chip.getAttribute("data-tag") || "").trim().toLowerCase());
      });
    return tokens;
  }

  function applyActiveReferenceFilter(panel) {
    var isCoach = panel.id === "rcFilterCoach";
    var skillEl = document.getElementById(
      isCoach ? "rcFCoachSkill" : "rcFProSkill",
    );
    var angleEl = document.getElementById(
      isCoach ? "rcFCoachAngle" : "rcFProAngle",
    );
    var skills = skillEl._getSelected();
    var angles = angleEl._getSelected();
    var tagTok = collectTagTokensFromPanel(panel);
    forEachCard(function (c) {
      c.classList.remove("rc-filtered-out");
      if (c.dataset.tabSrc !== activeTab) return;
      var ok = true;
      var ds = c.getAttribute("data-skill");
      if (skills.length && ds && skills.indexOf(ds) === -1) ok = false;
      var da = c.getAttribute("data-angle");
      if (angles.length && da && angles.indexOf(da) === -1) ok = false;
      if (tagTok.length) {
        var blob =
          (c.getAttribute("data-tags") || "") +
          " " +
          (c.getAttribute("data-stroke") || "") +
          " " +
          c.querySelector(".rc-card__title").textContent;
        blob = blob.toLowerCase();
        var st = (c.getAttribute("data-stroke") || "").toLowerCase();
        for (var i = 0; i < tagTok.length; i++) {
          if (blob.indexOf(tagTok[i]) === -1 && st !== tagTok[i]) {
            ok = false;
            break;
          }
        }
      }
      c.classList.toggle("rc-filtered-out", !ok);
    });
    closeFilters();
    syncRcCardDisplay();
  }

  function getActiveFilter() {
    return activeTab === "coach" ? filterCoach : filterPro;
  }
  function closeFilters() {
    filterPro.classList.remove("is-open");
    filterCoach.classList.remove("is-open");
  }

  function showTab(tab) {
    activeTab = tab;
    tabs.forEach(function (t) {
      t.classList.toggle("is-active", t.dataset.tab === tab);
    });
    if (tabsWrap && tabsWrap._slidingSegSync) tabsWrap._slidingSegSync();
    forEachCard(function (c) {
      c.classList.remove("rc-filtered-out");
    });
    addNewBtn.classList.toggle("d-none", tab !== "pro");
    closeFilters();
    hideSortDropdown();
    autocomplete.classList.remove("is-open");
    syncRcCardDisplay();
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      showTab(t.dataset.tab);
    });
  });
  btnOpen.addEventListener("click", function () {
    hideAddView();
    overlay.classList.add("is-open");
    showTab(activeTab);
    requestAnimationFrame(function () {
      if (tabsWrap && tabsWrap._slidingSegSync) tabsWrap._slidingSegSync();
    });
  });
  function closeModal() {
    if (isInAddView) hideAddView();
    overlay.classList.remove("is-open");
  }
  btnClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  sortBtn.addEventListener("show.bs.dropdown", function () {
    closeFilters();
  });

  sortOptions.forEach(function (opt) {
    opt.addEventListener("click", function () {
      sortOptions.forEach(function (o) {
        o.classList.remove("active");
      });
      opt.classList.add("active");
    });
  });

  /* Filter toggle — shows the right panel based on active tab */
  filterBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    hideSortDropdown();
    var target = getActiveFilter();
    var wasOpen = target.classList.contains("is-open");
    closeFilters();
    if (!wasOpen) target.classList.add("is-open");
  });
  filterPro.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  filterCoach.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.querySelectorAll(".rc-apply-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var panel = b.closest(
        ".rc-filter-dropdown--pro, .rc-filter-dropdown--coach",
      );
      if (panel) applyActiveReferenceFilter(panel);
    });
  });
  document.querySelectorAll(".rc-reset-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var panel = b.closest(
        ".rc-filter-dropdown--pro, .rc-filter-dropdown--coach",
      );
      if (!panel) return;
      panel.querySelectorAll(".app-multiselect").forEach(function (ms) {
        if (ms._reset) ms._reset();
      });
      panel
        .querySelectorAll(".cc-tags-suggested .app-tag-suggest")
        .forEach(function (b) {
          b.classList.remove("is-selected");
          if (window.AppShared.syncTagSuggestSelectionState)
            window.AppShared.syncTagSuggestSelectionState(b, true);
        });
      panel
        .querySelectorAll(
          '.cc-tags-suggested .app-tag-suggest[data-dynamic="1"]',
        )
        .forEach(function (b) {
          b.remove();
        });
      panel.querySelectorAll(".cc-tags-added").forEach(function (box) {
        box.innerHTML = "";
      });
      forEachCard(function (c) {
        c.classList.remove("rc-filtered-out");
      });
      syncRcCardDisplay();
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".rc-filter-wrap")) closeFilters();
    if (!e.target.closest(".rc-search-wrap"))
      autocomplete.classList.remove("is-open");
  });

  /* Autocomplete on search */
  searchInput.addEventListener("input", function () {
    syncRcCardDisplay();
    var q = searchInput.value.toLowerCase();
    autocomplete.innerHTML = "";
    if (q.length < 1) {
      autocomplete.classList.remove("is-open");
      return;
    }
    var matches = [];
    forEachCard(function (c) {
      if (c.dataset.tabSrc !== activeTab || c.classList.contains("d-none"))
        return;
      var title = c.querySelector(".rc-card__title").textContent;
      if (title.toLowerCase().includes(q) && matches.length < 5) {
        matches.push({ title: title, img: thumbMediaSrc(c) });
      }
    });
    if (matches.length === 0) {
      autocomplete.classList.remove("is-open");
      return;
    }
    matches.forEach(function (m) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rc-autocomplete__item";
      btn.innerHTML = '<img src="' + m.img + '" alt="" />' + m.title;
      btn.addEventListener("click", function () {
        searchInput.value = m.title;
        searchInput.dispatchEvent(new Event("input"));
        autocomplete.classList.remove("is-open");
      });
      autocomplete.appendChild(btn);
    });
    autocomplete.classList.add("is-open");
  });

  searchInput.addEventListener("focus", function () {
    if (searchInput.value.length > 0)
      searchInput.dispatchEvent(new Event("input"));
  });

  var rcSearchBtn = document.getElementById("rcSearchBtn");
  if (rcSearchBtn) {
    rcSearchBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      syncRcCardDisplay();
      searchInput.dispatchEvent(new Event("input"));
    });
  }

  /* Card selection */
  function refreshCount() {
    var count = 0;
    forEachCard(function (c) {
      if (c.classList.contains("is-selected")) count++;
    });
    countBadge.textContent = count;
  }

  function reorderBadges() {
    var idx = 0;
    forEachCard(function (c) {
      var badge = c.querySelector(".rc-card__badge");
      if (c.classList.contains("is-selected")) {
        idx++;
        badge.textContent = idx;
        badge.classList.remove("d-none");
      } else {
        badge.classList.add("d-none");
      }
    });
  }

  function ensureClipRowPlaceholder(row) {
    if (!row) return;
    if (!row.querySelector(".clip-thumb")) {
      row.innerHTML =
        '<span class="small text-muted-app">No clips selected</span>';
    }
  }

  function removeReferenceClipById(idStr) {
    [selectedClipsRow, previewClipsRow].forEach(function (row) {
      if (!row) return;
      row.querySelectorAll(".clip-thumb").forEach(function (thumb) {
        if (thumb.getAttribute("data-clip-id") === idStr) thumb.remove();
      });
    });
    forEachCard(function (c) {
      if (c.dataset.clip === idStr) {
        c.classList.remove("is-selected");
      }
    });
    reorderBadges();
    refreshCount();
    ensureClipRowPlaceholder(selectedClipsRow);
    ensureClipRowPlaceholder(previewClipsRow);
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
  }

  function createClipThumbElement(clipId, src, isVideo) {
    var wrap = document.createElement("div");
    wrap.className = "clip-thumb";
    wrap.setAttribute("data-clip-id", clipId);
    if (isVideo) {
      var v = document.createElement("video");
      v.src = src;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.preload = "metadata";
      wrap.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      wrap.appendChild(img);
    }
    var del = document.createElement("button");
    del.type = "button";
    del.className = "clip-thumb__remove";
    del.setAttribute("aria-label", "Remove clip");
    del.innerHTML = '<i data-lucide="trash-2" width="13" height="13"></i>';
    del.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      removeReferenceClipById(String(clipId));
    });
    wrap.appendChild(del);
    return wrap;
  }

  function attachRcCard(card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-selected");
      reorderBadges();
      refreshCount();
    });
  }
  forEachCard(attachRcCard);

  btnConfirm.addEventListener("click", function () {
    var picked = 0;
    if (selectedClipsRow) selectedClipsRow.innerHTML = "";
    if (previewClipsRow) previewClipsRow.innerHTML = "";
    forEachCard(function (c) {
      if (!c.classList.contains("is-selected")) return;
      picked++;
      var src = thumbMediaSrc(c);
      if (!src) return;
      var isVid = !!c.querySelector(".rc-card__thumb video");
      var id = c.dataset.clip;
      if (selectedClipsRow)
        selectedClipsRow.appendChild(createClipThumbElement(id, src, isVid));
      if (previewClipsRow)
        previewClipsRow.appendChild(createClipThumbElement(id, src, isVid));
    });
    if (picked === 0) {
      ensureClipRowPlaceholder(selectedClipsRow);
      ensureClipRowPlaceholder(previewClipsRow);
    }
    overlay.classList.remove("is-open");
    if (picked > 0) showClipVideoSuccessToast();
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
  });

  /* Init all multiselects inside both filter panels */
  filterPro.querySelectorAll(".app-multiselect").forEach(function (el) {
    initMultiselect(el);
  });
  filterCoach.querySelectorAll(".app-multiselect").forEach(function (el) {
    initMultiselect(el);
  });

  (function initRcLibSourceTabsSeg() {
    if (!tabsWrap || !window.AppShared.initSlidingSegmented) return;
    window.AppShared.initSlidingSegmented(tabsWrap, {
      trackSelector: ".app-segmented-tabs__track",
      btnSelector: ".app-segmented-tabs__tab",
    });
  })();

  if (window.AppShared.bindTagSection) {
    window.AppShared.bindTagSection(
      "rcTagInput",
      "rcTagAddBtn",
      "rcProTagsAdded",
      "rcTagsSuggested",
    );
    window.AppShared.bindTagSection(
      "rcCoachTagInput",
      "rcCoachTagAddBtn",
      "rcCoachTagsAdded",
      "rcCoachTagsSuggested",
    );
  }

  /* ====== Add / upload clip (unified form) ====== */
  var mainView = document.getElementById("rcMainView");
  var addView = document.getElementById("rcAddView");
  var clipsModalFooter = document.getElementById("clipsModalFooter");
  var rcAddVideoFooter = document.getElementById("rcAddVideoFooter");
  var clipsModalTitle = document.getElementById("seClipsModalTitle");
  var backBtn = document.getElementById("rcBackBtn");
  var addVideoSubmit = document.getElementById("rcAddVideoSubmit");
  var addFormPanel = document.getElementById("rcAddFormPanel");
  var uploadZone = document.getElementById("rcUploadZone");
  var uploadInput = document.getElementById("rcUploadInput");
  var uploadBrowse = document.getElementById("rcUploadBrowse");
  var uploadDefault = document.getElementById("rcUploadDefault");
  var uploadDone = document.getElementById("rcUploadDone");
  var uploadName = document.getElementById("rcUploadName");
  var uploadSize = document.getElementById("rcUploadSize");
  var uploadRemove = document.getElementById("rcUploadRemove");
  var rcAddDragBadgeName = document.getElementById("rcAddDragBadgeName");
  var addTagInput = document.getElementById("rcAddTagInput");
  var addTagBtn = document.getElementById("rcAddTagBtn");
  var rcAddTagsAdded = document.getElementById("rcAddTagsAdded");
  var rcAddTagsSuggested = document.getElementById("rcAddTagsSuggested");

  function setupSegmented(container) {
    window.AppShared.initSlidingSegmented(container, {
      trackSelector: ".rc-add-seg__track",
      btnSelector: ".rc-add-seg__btn",
    });
  }

  var rcAddMediaTabs = document.getElementById("rcAddMediaTabs");
  var rcAddPanelVideos = document.getElementById("rcAddPanelVideos");
  var rcAddPanelYoutube = document.getElementById("rcAddPanelYoutube");

  function getActiveAddMediaSource() {
    var a =
      rcAddMediaTabs &&
      rcAddMediaTabs.querySelector(".app-segmented-tabs__tab.is-active");
    return (a && a.getAttribute("data-add-source")) || "videos";
  }

  function syncAddMediaPanels() {
    var src = getActiveAddMediaSource();
    if (rcAddPanelVideos)
      rcAddPanelVideos.classList.toggle("d-none", src !== "videos");
    if (rcAddPanelYoutube)
      rcAddPanelYoutube.classList.toggle("d-none", src !== "youtube");
    if (rcAddMediaTabs) {
      rcAddMediaTabs
        .querySelectorAll(".app-segmented-tabs__tab")
        .forEach(function (b) {
          var on = b.getAttribute("data-add-source") === src;
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
    }
  }

  function resetAddMediaTab() {
    if (!rcAddMediaTabs) return;
    rcAddMediaTabs
      .querySelectorAll(".app-segmented-tabs__tab")
      .forEach(function (b, i) {
        b.classList.toggle("is-active", i === 0);
        b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      });
    if (rcAddMediaTabs._slidingSegSync) rcAddMediaTabs._slidingSegSync();
    syncAddMediaPanels();
  }

  function initAddMediaTabsOnce() {
    if (
      !rcAddMediaTabs ||
      rcAddMediaTabs.getAttribute("data-media-wired") === "1"
    )
      return;
    rcAddMediaTabs.setAttribute("data-media-wired", "1");
    window.AppShared.initSlidingSegmented(rcAddMediaTabs, {
      trackSelector: ".app-segmented-tabs__track",
      btnSelector: ".app-segmented-tabs__tab",
    });
    rcAddMediaTabs
      .querySelectorAll(".app-segmented-tabs__tab")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          requestAnimationFrame(syncAddMediaPanels);
        });
      });
  }

  function refreshVisibleAddSegments() {
    if (!addFormPanel) return;
    addFormPanel.querySelectorAll(".rc-add-seg").forEach(function (seg) {
      if (typeof seg._slidingSegSync === "function") seg._slidingSegSync();
    });
    var camSeg = document.getElementById("rcAddCameraSeg");
    if (camSeg && typeof camSeg._slidingSegSync === "function")
      camSeg._slidingSegSync();
  }

  function initAddStrokeMultiselectOnce() {
    var el = document.getElementById("rcAddStroke");
    if (!el || el.getAttribute("data-ms-init") === "1") return;
    el.setAttribute("data-ms-init", "1");
    if (window.AppShared && window.AppShared.initMultiselect)
      window.AppShared.initMultiselect(el);
  }

  function initAddCameraAngleOnce() {
    var cam = document.getElementById("rcAddCameraSeg");
    if (!cam || cam.getAttribute("data-angle-wired") === "1") return;
    cam.setAttribute("data-angle-wired", "1");
    window.AppShared.initSlidingSegmented(cam, {
      trackSelector: ".cc-angle__track",
      btnSelector: ".cc-angle-btn",
    });
  }

  function formatClipDate() {
    var d = new Date();
    return d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  }

  function libraryTabFromAddForm() {
    var seg = document.getElementById("rcAddLibrarySeg");
    if (!seg) return "pro";
    var active = seg.querySelector(".rc-add-seg__btn.is-active");
    var val = active && active.dataset.val;
    if (val === "Coach Clips") return "coach";
    if (val === "Player Library") return "player";
    return "pro";
  }

  function cameraFromAddForm() {
    var seg = document.getElementById("rcAddCameraSeg");
    if (!seg) return "Behind Player";
    var active = seg.querySelector(".cc-angle-btn.is-active");
    return (active && active.getAttribute("data-val")) || "Behind Player";
  }

  function libraryLabelFromTab(tab) {
    if (tab === "coach") return "Coach Clips";
    if (tab === "player") return "Player Library";
    return "Pro Library";
  }

  function strokeLabelFromAddForm() {
    var ms = document.getElementById("rcAddStroke");
    if (!ms || !ms._getSelected) return "Video";
    var s = ms._getSelected();
    if (!s || !s.length) return "Video";
    return s[0];
  }

  function youtubeThumbFromUrl(url) {
    var m = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
    );
    if (m) return "https://img.youtube.com/vi/" + m[1] + "/mqdefault.jpg";
    return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80";
  }

  function nextClipId() {
    var max = 0;
    forEachCard(function (c) {
      var id = parseInt(c.dataset.clip, 10);
      if (!isNaN(id) && id > max) max = id;
    });
    return max + 1;
  }

  function appendReferenceClipThumb(src, isVideo, clipId) {
    var idStr = String(clipId);
    [selectedClipsRow, previewClipsRow].forEach(function (row) {
      if (!row) return;
      var empty = row.querySelector(".text-muted-app");
      if (empty) row.innerHTML = "";
      row.appendChild(createClipThumbElement(idStr, src, isVideo));
    });
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
  }

  function strokeBadgeClass(stroke) {
    return "badge-tag--" + window.AppShared.strokeBadgeTone(stroke);
  }

  function skillBadgeClass(skill) {
    if (skill === "Beginner") return "badge-tag--orange";
    if (skill === "Intermediate") return "badge-tag--green";
    return "badge-tag--green";
  }

  function appendNewRcCard(opts) {
    var idNum = nextClipId();
    var card = document.createElement("div");
    card.className = "rc-card";
    card.dataset.clip = String(idNum);
    card.dataset.tabSrc = opts.tabSrc;
    card.setAttribute("data-skill", opts.skill || "");
    card.setAttribute("data-stroke", opts.stroke || "");
    card.setAttribute("data-angle", opts.angle || "");
    card.setAttribute(
      "data-tags",
      (opts.extraTags || []).join(",").toLowerCase(),
    );

    var thumbWrap = document.createElement("div");
    thumbWrap.className = "rc-card__thumb";
    if (opts.isVideoThumb) {
      var v = document.createElement("video");
      v.src = opts.thumbSrc;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.preload = "metadata";
      thumbWrap.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = opts.thumbSrc;
      img.alt = "";
      thumbWrap.appendChild(img);
    }

    var body = document.createElement("div");
    body.className = "rc-card__body";
    var h4 = document.createElement("h4");
    h4.className = "rc-card__title";
    h4.textContent = opts.title;
    var dateP = document.createElement("p");
    dateP.className = "rc-card__date";
    dateP.innerHTML =
      '<i data-lucide="calendar" width="15" height="15"></i> ' +
      formatClipDate();
    var tags = document.createElement("div");
    tags.className = "rc-card__tags";
    if (opts.stroke && opts.stroke !== "Video") {
      var ts = document.createElement("span");
      ts.className = "badge-tag " + strokeBadgeClass(opts.stroke);
      ts.textContent = opts.stroke;
      tags.appendChild(ts);
    }
    if (opts.angle) {
      var ta = document.createElement("span");
      ta.className = "badge-tag badge-tag--blue";
      ta.textContent = opts.angle;
      tags.appendChild(ta);
    }
    if (opts.skill) {
      var tsk = document.createElement("span");
      tsk.className = "badge-tag " + skillBadgeClass(opts.skill);
      tsk.textContent = opts.skill;
      tags.appendChild(tsk);
    }
    var tLib = document.createElement("span");
    tLib.className = "badge-tag badge-tag--blue";
    tLib.textContent = opts.libraryLabel;
    tags.appendChild(tLib);
    (opts.extraTags || []).forEach(function (tg) {
      var tx = document.createElement("span");
      tx.className = "badge-tag badge-tag--green";
      tx.textContent = tg;
      tags.appendChild(tx);
    });
    body.appendChild(h4);
    body.appendChild(dateP);
    body.appendChild(tags);

    var badge = document.createElement("span");
    badge.className = "rc-card__badge d-none";
    badge.textContent = "0";

    card.appendChild(thumbWrap);
    card.appendChild(body);
    card.appendChild(badge);
    clipList.appendChild(card);
    attachRcCard(card);
    syncRcCardDisplay();
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
    return idNum;
  }

  var isInAddView = false;

  function showAddView() {
    isInAddView = true;
    mainView.classList.add("d-none");
    addView.classList.remove("d-none");
    if (backBtn) backBtn.classList.remove("d-none");
    if (clipsModalFooter) clipsModalFooter.classList.add("d-none");
    if (rcAddVideoFooter) rcAddVideoFooter.classList.remove("d-none");
    if (clipsModalTitle) clipsModalTitle.textContent = "Add New Video";
    requestAnimationFrame(function () {
      initAddMediaTabsOnce();
      resetAddMediaTab();
      initAddStrokeMultiselectOnce();
      initAddCameraAngleOnce();
      addView.querySelectorAll(".rc-add-seg").forEach(function (seg) {
        setupSegmented(seg);
      });
      refreshVisibleAddSegments();
      if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
    });
  }

  function hideAddView() {
    isInAddView = false;
    addView.classList.add("d-none");
    mainView.classList.remove("d-none");
    if (backBtn) backBtn.classList.add("d-none");
    if (clipsModalFooter) clipsModalFooter.classList.remove("d-none");
    if (rcAddVideoFooter) rcAddVideoFooter.classList.add("d-none");
    if (clipsModalTitle) clipsModalTitle.textContent = "Add Clip";
    resetAddForm();
  }

  function resetAddForm() {
    uploadDefault.classList.remove("d-none");
    uploadDone.classList.add("d-none");
    uploadZone.classList.remove("has-file", "is-dragging");
    uploadInput.value = "";
    if (uploadName) uploadName.textContent = "";
    if (uploadSize) uploadSize.textContent = "";
    if (rcAddDragBadgeName) rcAddDragBadgeName.textContent = "Drop video";
    var urlInput = document.getElementById("rcVideoUrl");
    if (urlInput) urlInput.value = "";
    resetAddMediaTab();
    if (addTagInput) addTagInput.value = "";
    if (rcAddTagsAdded) rcAddTagsAdded.innerHTML = "";
    if (rcAddTagsSuggested) {
      rcAddTagsSuggested
        .querySelectorAll(".app-tag-suggest")
        .forEach(function (b) {
          b.classList.remove("is-selected");
          if (window.AppShared.syncTagSuggestSelectionState)
            window.AppShared.syncTagSuggestSelectionState(b, true);
        });
    }
    var strokeMs = document.getElementById("rcAddStroke");
    if (strokeMs && strokeMs._reset) strokeMs._reset();
    addView.querySelectorAll("select").forEach(function (s) {
      s.selectedIndex = 0;
    });
    requestAnimationFrame(function () {
      refreshVisibleAddSegments();
    });
  }

  addNewBtn.addEventListener("click", function () {
    showAddView();
  });
  backBtn.addEventListener("click", function () {
    hideAddView();
  });

  if (window.AppShared && window.AppShared.bindTagSection) {
    window.AppShared.bindTagSection(
      "rcAddTagInput",
      "rcAddTagBtn",
      "rcAddTagsAdded",
      "rcAddTagsSuggested",
    );
  }

  /* File upload */
  uploadBrowse.addEventListener("click", function (e) {
    e.stopPropagation();
    uploadInput.click();
  });
  uploadZone.addEventListener("click", function () {
    if (!uploadDone.classList.contains("d-none")) return;
    uploadInput.click();
  });

  uploadZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadZone.classList.add("is-dragging");
    if (
      rcAddDragBadgeName &&
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length
    )
      rcAddDragBadgeName.textContent = e.dataTransfer.files[0].name;
  });
  uploadZone.addEventListener("dragleave", function () {
    uploadZone.classList.remove("is-dragging");
    if (rcAddDragBadgeName) rcAddDragBadgeName.textContent = "Drop video";
  });
  uploadZone.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadZone.classList.remove("is-dragging");
    if (rcAddDragBadgeName) rcAddDragBadgeName.textContent = "Drop video";
    if (e.dataTransfer.files.length) handleUploadFile(e.dataTransfer.files[0]);
  });

  uploadInput.addEventListener("change", function () {
    if (uploadInput.files.length) handleUploadFile(uploadInput.files[0]);
  });

  function handleUploadFile(file) {
    if (uploadName) uploadName.textContent = file.name;
    if (uploadSize && window.AppShared && window.AppShared.formatFileSize)
      uploadSize.textContent = window.AppShared.formatFileSize(file.size);
    else if (uploadSize) uploadSize.textContent = "";
    uploadDefault.classList.add("d-none");
    uploadDone.classList.remove("d-none");
    uploadZone.classList.add("has-file");
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
  }

  uploadRemove.addEventListener("click", function (e) {
    e.stopPropagation();
    uploadInput.value = "";
    if (uploadName) uploadName.textContent = "";
    if (uploadSize) uploadSize.textContent = "";
    uploadDefault.classList.remove("d-none");
    uploadDone.classList.add("d-none");
    uploadZone.classList.remove("has-file");
    if (typeof lucide !== "undefined") window.AppShared.initLucideIcons();
  });

  function collectAddFormTags() {
    var list = [];
    if (rcAddTagsSuggested) {
      rcAddTagsSuggested
        .querySelectorAll(".app-tag-suggest.is-selected")
        .forEach(function (s) {
          list.push((s.getAttribute("data-tag") || s.textContent).trim());
        });
    }
    if (rcAddTagsAdded) {
      rcAddTagsAdded.querySelectorAll(".badge-tag-chip").forEach(function (c) {
        list.push((c.getAttribute("data-tag") || "").trim());
      });
    }
    var seen = {};
    return list.filter(function (t) {
      if (!t || seen[t.toLowerCase()]) return false;
      seen[t.toLowerCase()] = true;
      return true;
    });
  }

  /* Submit — add clip to page + modal list, toast, close */
  addVideoSubmit.addEventListener("click", function () {
    var PLACEHOLDER =
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=200&q=80";
    var file = uploadInput.files && uploadInput.files[0];
    var urlEl = document.getElementById("rcVideoUrl");
    var url = urlEl ? urlEl.value.trim() : "";
    var mediaSrc = getActiveAddMediaSource();
    if (mediaSrc === "youtube") {
      if (!url) {
        alert("Please enter a video URL.");
        return;
      }
    } else {
      if (!file) {
        alert("Please upload a video file.");
        return;
      }
    }
    var tabSrc = libraryTabFromAddForm();
    var libraryLabel = libraryLabelFromTab(tabSrc);
    var stroke = strokeLabelFromAddForm();
    var angle = cameraFromAddForm();
    var extraTags = collectAddFormTags();
    var title;
    var thumbSrc;
    var isVideoThumb = false;
    if (mediaSrc === "youtube") {
      title = "YouTube clip";
      thumbSrc = youtubeThumbFromUrl(url);
    } else {
      title = file.name.replace(/\.[^/.]+$/, "") || file.name;
      thumbSrc = URL.createObjectURL(file);
      isVideoThumb = true;
    }

    var newClipId = appendNewRcCard({
      title: title,
      thumbSrc: thumbSrc,
      isVideoThumb: isVideoThumb,
      tabSrc: tabSrc,
      libraryLabel: libraryLabel,
      skill: "",
      stroke: stroke,
      angle: angle,
      extraTags: extraTags,
    });
    appendReferenceClipThumb(thumbSrc, isVideoThumb, newClipId);

    hideAddView();
    closeModal();
    showClipVideoSuccessToast();
  });

  showTab("pro");
})();

/* ====== Selectable Cards (Classes & Coaches) ====== */
(function () {
  var selections = { classes: [], coaches: [] };

  function refresh(group) {
    var cards = document.querySelectorAll(
      '.se-selectable[data-group="' + group + '"]',
    );
    var countEl = document.getElementById(
      group === "classes" ? "classCount" : "coachCount",
    );
    selections[group] = [];
    cards.forEach(function (card) {
      var badge = card.querySelector(".se-order-badge");
      if (card.classList.contains("is-selected")) {
        selections[group].push(card);
        badge.classList.remove("d-none");
      } else {
        badge.classList.add("d-none");
        card.classList.remove(
          "app-class-card--selected",
          "app-coach-compact--selected",
        );
        card.classList.add("app-class-card--muted", "app-coach-compact--muted");
      }
    });
    selections[group].forEach(function (card, i) {
      card.querySelector(".se-order-badge").textContent = i + 1;
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
        if (selections[group].length > 0) {
          card.classList.add(
            group === "classes"
              ? "app-class-card--muted"
              : "app-coach-compact--muted",
          );
        }
      }
    });
    countEl.textContent = selections[group].length + " Added";
    updatePreviewCards(group);
  }

  function updatePreviewCards(group) {
    var container = document.getElementById(
      group === "classes" ? "previewClasses" : "previewCoaches",
    );
    if (selections[group].length === 0) {
      container.innerHTML =
        '<span class="small text-muted-app px-2">None selected</span>';
      return;
    }
    if (group === "classes") {
      container.innerHTML = "";
      selections[group].forEach(function (card) {
        var col = document.createElement("div");
        col.className = "col-6 d-flex";
        var clone = card.cloneNode(true);
        clone.classList.remove(
          "se-selectable",
          "is-selected",
          "app-class-card--selected",
          "app-class-card--muted",
          "h-100",
        );
        clone.classList.add("app-class-card--preview", "h-100", "w-100");
        clone.removeAttribute("data-group");
        var badge = clone.querySelector(".se-order-badge");
        if (badge) badge.classList.add("d-none");
        col.appendChild(clone);
        container.appendChild(col);
      });
      if (typeof lucide !== "undefined" && window.AppShared) {
        window.AppShared.initLucideIcons();
      }
      return;
    }
    if (group === "coaches") {
      container.innerHTML = "";
      selections[group].forEach(function (card) {
        var col = document.createElement("div");
        col.className = "col-6 d-flex";
        var clone = card.cloneNode(true);
        clone.classList.remove(
          "se-selectable",
          "is-selected",
          "app-coach-compact--selected",
          "app-coach-compact--muted",
        );
        clone.classList.add("app-coach-compact--preview", "h-100", "w-100");
        clone.removeAttribute("data-group");
        var badge = clone.querySelector(".se-order-badge");
        if (badge) badge.classList.add("d-none");
        var img = clone.querySelector("img");
        var coachDiv = clone.querySelector(".app-recommended-coach");
        if (img && coachDiv) {
          img.remove();
          coachDiv.remove();
          var top = document.createElement("div");
          top.className =
            "d-flex align-items-center gap-3 w-100 app-coach-compact__preview-top";
          top.appendChild(img);
          top.appendChild(coachDiv);
          if (badge) {
            badge.insertAdjacentElement("afterend", top);
          } else {
            clone.prepend(top);
          }
        }
        var actions = document.createElement("div");
        actions.className =
          "d-flex gap-2 w-100 app-coach-compact__preview-actions";
        var btnBook = document.createElement("button");
        btnBook.type = "button";
        btnBook.className = "btn btn-secondary flex-grow-1";
        btnBook.textContent = "Book Now";
        var btnView = document.createElement("button");
        btnView.type = "button";
        btnView.className = "btn btn-primary-outline flex-grow-1";
        btnView.textContent = "View Profile";
        actions.appendChild(btnBook);
        actions.appendChild(btnView);
        clone.appendChild(actions);
        col.appendChild(clone);
        container.appendChild(col);
      });
      if (typeof lucide !== "undefined" && window.AppShared) {
        window.AppShared.initLucideIcons();
      }
      return;
    }
  }

  document.querySelectorAll(".se-selectable").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-selected");
      refresh(card.getAttribute("data-group"));
    });
  });
})();

window.AppShared.bindRecommendationCardSearch(
  "seRecClassSearch",
  "seRecClassSearchBtn",
  "classCards",
);
window.AppShared.bindRecommendationCardSearch(
  "seRecCoachSearch",
  "seRecCoachSearchBtn",
  "coachCards",
);

/* ====== Save → Success ====== */
document.getElementById("btnSaveEval").addEventListener("click", function () {
  var S = window.AppShared;
  var seRoot = document.querySelector("main.app-main") || document.body;
  S.clearFormValidation(seRoot);
  var ok = true;
  var dz = document.getElementById("dropzone");
  var file =
    document.getElementById("videoInput").files &&
    document.getElementById("videoInput").files[0];
  if (
    !S.validateFileOrUrl(
      file,
      "",
      dz,
      "Upload failed. Please select a valid video file and try again.",
    )
  ) {
    ok = false;
  }
  if (
    !S.validateMultiselectHasSelection(
      document.getElementById("strokeType"),
      "Please select a stroke type.",
    )
  ) {
    ok = false;
  }
  if (!ok) return;
  document.getElementById("successOverlay").classList.add("is-open");
  if (typeof lucide !== "undefined" && window.AppShared) {
    window.AppShared.initLucideIcons();
  }
});
var successOverlay = document.getElementById("successOverlay");
successOverlay.addEventListener("click", function (e) {
  if (e.target === this) this.classList.remove("is-open");
});
document
  .getElementById("evalSuccessClose")
  .addEventListener("click", function () {
    successOverlay.classList.remove("is-open");
  });
document.getElementById("btnCopyLink").addEventListener("click", function () {
  var el = document.getElementById("evalLink");
  if (!el) return;
  el.focus();
  el.select();
  if (el.setSelectionRange) el.setSelectionRange(0, el.value.length);
  var text = el.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
  }
  var btn = this;
  if (btn._copyResetTimer) clearTimeout(btn._copyResetTimer);
  btn.innerHTML =
    '<span class="d-inline-flex align-items-center justify-content-center gap-2">' +
    "<span>Copied</span>" +
    '<i data-lucide="circle-check-big" width="16" height="16" aria-hidden="true"></i>' +
    "</span>";
  btn.setAttribute("aria-label", "Link copied");
  if (typeof lucide !== "undefined" && window.AppShared) {
    window.AppShared.initLucideIcons();
  }
  btn._copyResetTimer = setTimeout(function () {
    btn.textContent = "Copy Link";
    btn.removeAttribute("aria-label");
    btn._copyResetTimer = null;
  }, 2000);
});
