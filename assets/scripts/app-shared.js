/* Shared UI helpers — load after Lucide, before page scripts */
(function (global) {
  "use strict";

  var AS = {};
  var multiselectOutsideBound = false;

  /** Modifier classes for .badge-tag (suggested tags + chips). */
  var TAG_COLOR_MODS = [
    "green",
    "red",
    "blue",
    "yellow",
    "orange",
    "purple",
    "dark-green",
  ];

  function stripTagColorMods(el) {
    if (!el || !el.classList) return;
    TAG_COLOR_MODS.forEach(function (name) {
      el.classList.remove("badge-tag--" + name);
    });
  }

  AS.initLucideIcons = function () {
    if (typeof lucide === "undefined") return;
    lucide.createIcons({ attrs: { "stroke-width": 1.5 } });
  };

  /** Keep aria-expanded in sync when multiselects use toggle + input (autocomplete). */
  AS.syncMultiselectAria = function (o, open) {
    if (!o) return;
    var tb = o.querySelector(".app-multiselect__toggle");
    if (tb) tb.setAttribute("aria-expanded", open ? "true" : "false");
    var inp = o.querySelector(".app-multiselect__input");
    if (inp) inp.setAttribute("aria-expanded", open ? "true" : "false");
  };

  AS.initMultiselect = function (el) {
    if (!el) return;
    var trigger = el.querySelector(".app-multiselect__trigger");
    var options = el.querySelectorAll(".app-multiselect__option");
    var placeholder = el.querySelector(".app-multiselect__placeholder");
    var input = el.querySelector(".app-multiselect__input");
    var clearBtn = el.querySelector(".app-multiselect__clear");
    var toggleBtn = el.querySelector(".app-multiselect__toggle");
    var selected = [];

    if (input && el.classList.contains("app-multiselect--autocomplete")) {
      var actionsEl = el.querySelector(".app-multiselect__actions");
      if (!clearBtn && actionsEl) {
        clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "app-multiselect__clear";
        clearBtn.setAttribute("aria-label", "Clear all");
        clearBtn.innerHTML = '<i data-lucide="x" width="14" height="14"></i>';
        clearBtn.hidden = true;
        actionsEl.appendChild(clearBtn);
      }

      var inputPh = input.getAttribute("placeholder") || "Select...";
      var menu = el.querySelector(".app-multiselect__menu");
      var noResults = menu && menu.querySelector(".app-multiselect__noresults");
      if (menu && !noResults) {
        noResults = document.createElement("p");
        noResults.className = "app-multiselect__noresults";
        noResults.setAttribute("role", "status");
        noResults.textContent = "No results to show";
        noResults.hidden = true;
        menu.insertBefore(noResults, menu.firstChild);
      }

      function setOpen(open) {
        if (open) {
          document
            .querySelectorAll(".app-multiselect.is-open")
            .forEach(function (o) {
              if (o !== el) {
                o.classList.remove("is-open");
                AS.syncMultiselectAria(o, false);
              }
            });
        }
        el.classList.toggle("is-open", open);
        AS.syncMultiselectAria(el, open);
      }

      function showAllOptions() {
        options.forEach(function (opt) {
          opt.hidden = false;
        });
        if (noResults) noResults.hidden = true;
        updateClearVisibility();
      }

      function applyFilterFromInput() {
        var qRaw = (input.value || "").trim();
        var q = qRaw.toLowerCase();
        var visibleCount = 0;
        options.forEach(function (opt) {
          var txt = (opt.textContent || "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
          var match = !q || txt.indexOf(q) !== -1;
          opt.hidden = !match;
          if (match) visibleCount++;
        });
        if (noResults) {
          noResults.hidden = !(q.length > 0 && visibleCount === 0);
        }
        updateClearVisibility();
      }

      function getTagColor(val) {
        var opt = el.querySelector(
          '.app-multiselect__option[data-value="' +
            val.replace(/"/g, '\\"') +
            '"]',
        );
        return (opt && opt.getAttribute("data-tag")) || "green";
      }

      function updateClearVisibility() {
        if (!clearBtn) return;
        var hasQuery = (input.value || "").trim() !== "";
        clearBtn.hidden = selected.length === 0 && !hasQuery;
      }

      function renderTags() {
        el.querySelectorAll(".badge-tag").forEach(function (t) {
          t.remove();
        });
        selected.forEach(function (val) {
          var color = getTagColor(val);
          var tag = document.createElement("span");
          tag.className = "badge-tag badge-tag--" + color;
          tag.innerHTML =
            val +
            '<button type="button" class="badge-tag-remove" data-val="' +
            val.replace(/"/g, "&quot;") +
            '"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
          trigger.insertBefore(tag, input);
        });
        input.placeholder = selected.length === 0 ? inputPh : "";
        options.forEach(function (opt) {
          var v = opt.getAttribute("data-value");
          opt.classList.toggle("is-selected", selected.indexOf(v) !== -1);
        });
        updateClearVisibility();
      }

      trigger.addEventListener("click", function (e) {
        if (e.target.closest(".badge-tag-remove")) {
          var rm = e.target.closest(".badge-tag-remove");
          var val = rm.getAttribute("data-val");
          selected = selected.filter(function (s) {
            return s !== val;
          });
          renderTags();
          return;
        }
        if (e.target.closest(".app-multiselect__actions")) return;
        /* Click the input while open → close dropdown (toggle). */
        if (
          (e.target === input || e.target.closest(".app-multiselect__input")) &&
          el.classList.contains("is-open")
        ) {
          setOpen(false);
          return;
        }
        setOpen(true);
        showAllOptions();
        input.focus();
      });

      if (toggleBtn) {
        toggleBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var next = !el.classList.contains("is-open");
          if (next) {
            setOpen(true);
            showAllOptions();
          } else {
            setOpen(false);
          }
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          selected = [];
          input.value = "";
          renderTags();
          showAllOptions();
          setOpen(false);
          input.focus();
        });
      }

      input.addEventListener("input", function () {
        applyFilterFromInput();
        if (!el.classList.contains("is-open")) setOpen(true);
      });

      input.addEventListener("focus", function () {
        document
          .querySelectorAll(".app-multiselect.is-open")
          .forEach(function (o) {
            if (o !== el) {
              o.classList.remove("is-open");
              AS.syncMultiselectAria(o, false);
            }
          });
        /* Do not open on focus alone — avoids reopening right after Clear / click-to-close. */
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          setOpen(false);
        }
        if (e.key === "ArrowDown" && !el.classList.contains("is-open")) {
          setOpen(true);
          applyFilterFromInput();
        }
      });

      options.forEach(function (opt) {
        opt.addEventListener("click", function (e) {
          e.stopPropagation();
          var val = opt.getAttribute("data-value");
          var idx = selected.indexOf(val);
          if (idx === -1) selected.push(val);
          else selected.splice(idx, 1);
          renderTags();
          showAllOptions();
        });
      });

      el._reset = function () {
        selected = [];
        input.value = "";
        renderTags();
        showAllOptions();
      };
      el._getSelected = function () {
        return selected.slice();
      };

      renderTags();
      showAllOptions();
      return;
    }

    var single = el.classList.contains("app-multiselect--single");

    function getTagColor(val) {
      var opt = el.querySelector(
        '.app-multiselect__option[data-value="' +
          val.replace(/"/g, '\\"') +
          '"]',
      );
      return (opt && opt.getAttribute("data-tag")) || "green";
    }

    var singlePlain =
      single && el.classList.contains("app-multiselect--single-plain");

    function renderTags() {
      el.querySelectorAll(".badge-tag").forEach(function (t) {
        t.remove();
      });
      var prevPlain = trigger.querySelector(".app-multiselect__selected-plain");
      if (prevPlain) prevPlain.remove();

      if (singlePlain) {
        if (selected.length === 0) {
          if (placeholder) placeholder.style.display = "";
        } else {
          if (placeholder) placeholder.style.display = "none";
          var plain = document.createElement("span");
          plain.className = "app-multiselect__selected-plain";
          plain.textContent = selected[0];
          trigger.insertBefore(plain, placeholder);
        }
        options.forEach(function (opt) {
          var v = opt.getAttribute("data-value");
          opt.classList.toggle("is-selected", selected.indexOf(v) !== -1);
        });
        return;
      }

      if (selected.length === 0) {
        if (placeholder) placeholder.style.display = "";
      } else {
        if (placeholder) placeholder.style.display = "none";
        selected.forEach(function (val) {
          var color = getTagColor(val);
          var tag = document.createElement("span");
          tag.className = "badge-tag badge-tag--" + color;
          tag.innerHTML =
            val +
            '<button type="button" class="badge-tag-remove" data-val="' +
            val.replace(/"/g, "&quot;") +
            '"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
          trigger.insertBefore(tag, placeholder);
        });
      }
      options.forEach(function (opt) {
        var v = opt.getAttribute("data-value");
        opt.classList.toggle("is-selected", selected.indexOf(v) !== -1);
      });
    }

    trigger.addEventListener("click", function (e) {
      if (e.target.closest(".badge-tag-remove")) {
        var rm = e.target.closest(".badge-tag-remove");
        var val = rm.getAttribute("data-val");
        selected = selected.filter(function (s) {
          return s !== val;
        });
        renderTags();
        return;
      }
      document
        .querySelectorAll(".app-multiselect.is-open")
        .forEach(function (o) {
          if (o !== el) o.classList.remove("is-open");
        });
      el.classList.toggle("is-open");
    });

    options.forEach(function (opt) {
      opt.addEventListener("click", function (e) {
        e.stopPropagation();
        var val = opt.getAttribute("data-value");
        if (single) {
          var ix = selected.indexOf(val);
          if (ix !== -1) {
            if (!el.classList.contains("app-multiselect--single-plain")) {
              selected = [];
            }
          } else {
            selected = [val];
          }
          renderTags();
          el.classList.remove("is-open");
          return;
        }
        var idx = selected.indexOf(val);
        if (idx === -1) selected.push(val);
        else selected.splice(idx, 1);
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
  };

  AS.bindMultiselectOutsideClose = function () {
    if (multiselectOutsideBound) return;
    multiselectOutsideBound = true;
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".app-multiselect")) {
        document
          .querySelectorAll(".app-multiselect.is-open")
          .forEach(function (o) {
            o.classList.remove("is-open");
            AS.syncMultiselectAria(o, false);
          });
      }
    });
  };

  AS.initMultiselectsIn = function (root) {
    (root || document)
      .querySelectorAll(".app-multiselect")
      .forEach(function (el) {
        AS.initMultiselect(el);
      });
    AS.bindMultiselectOutsideClose();
  };

  AS.escAttr = function (s) {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  };

  AS.escapeHtml = function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  };

  /** Best-effort filename while dragging over a dropzone (may be empty until drop). */
  AS.dragFileNameFromEvent = function (e) {
    try {
      var dt = e.dataTransfer;
      if (!dt) return "";
      if (dt.items && dt.items.length) {
        var it = dt.items[0];
        if (it.kind === "file" && typeof it.getAsFile === "function") {
          var f = it.getAsFile();
          if (f && f.name) return f.name;
        }
      }
      if (dt.files && dt.files.length) return dt.files[0].name;
    } catch (err) {}
    return "";
  };

  /** Fake progress for demo upload UI; returns { cancel: fn }. */
  AS.runSimulatedUpload = function (opts) {
    var bar = opts.barEl;
    var pctEl = opts.pctEl;
    var track = opts.trackEl;
    var onDone = opts.onDone;
    var step = opts.step != null ? opts.step : 2;
    var intervalMs = opts.intervalMs != null ? opts.intervalMs : 45;
    var pct = 0;
    var cancelled = false;
    var timer = setInterval(function () {
      if (cancelled) return;
      pct = Math.min(100, pct + step);
      if (bar) bar.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct + "%";
      if (track) track.setAttribute("aria-valuenow", String(pct));
      if (pct >= 100) {
        clearInterval(timer);
        if (onDone) onDone();
      }
    }, intervalMs);
    return {
      cancel: function () {
        cancelled = true;
        clearInterval(timer);
      },
    };
  };

  /** Toggle check icon + optional color on filter/upload tag suggest buttons. */
  AS.syncTagSuggestSelectionState = function (el, skipIcons) {
    if (!el || !el.classList) return;
    var selected = el.classList.contains("is-selected");
    stripTagColorMods(el);
    if (selected) {
      var c = (el.getAttribute("data-tag-color") || "").trim();
      if (c && TAG_COLOR_MODS.indexOf(c) !== -1) {
        el.classList.add("badge-tag--" + c);
      }
    }
    if (el.setAttribute) {
      el.setAttribute("aria-pressed", selected ? "true" : "false");
    }
    var ch = el.querySelector(".badge-tag__check");
    if (selected) {
      if (!ch) {
        var wrap = document.createElement("span");
        wrap.className = "badge-tag__check";
        wrap.setAttribute("aria-hidden", "true");
        wrap.innerHTML = '<i data-lucide="check" width="12" height="12"></i>';
        el.insertBefore(wrap, el.firstChild);
      }
    } else if (ch) {
      ch.remove();
    }
    if (!skipIcons) AS.initLucideIcons();
  };

  AS.bindTagSection = function (inputId, addBtnId, addedEl, suggestEl) {
    var input = document.getElementById(inputId);
    var btn = document.getElementById(addBtnId);
    var added = document.getElementById(addedEl);
    var suggest = document.getElementById(suggestEl);
    if (!input || !btn || !added || !suggest) return;

    function addChip(text) {
      var t = text.trim();
      if (!t) return;
      var norm = t.toLowerCase();
      if (
        added.querySelector(
          '.badge-tag-chip[data-tag-norm="' + AS.escAttr(norm) + '"]',
        )
      )
        return;
      var color =
        TAG_COLOR_MODS[Math.floor(Math.random() * TAG_COLOR_MODS.length)];
      var chip = document.createElement("span");
      chip.className = "badge-tag badge-tag-chip badge-tag--" + color;
      chip.setAttribute("data-tag", t);
      chip.setAttribute("data-tag-norm", norm);
      var checkWrap = document.createElement("span");
      checkWrap.className = "badge-tag__check";
      checkWrap.setAttribute("aria-hidden", "true");
      checkWrap.innerHTML =
        '<i data-lucide="check" width="12" height="12"></i>';
      chip.appendChild(checkWrap);
      chip.appendChild(document.createTextNode(t));
      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "badge-tag-remove";
      rm.setAttribute("aria-label", "Remove tag");
      rm.innerHTML = '<i data-lucide="x" width="12" height="12"></i>';
      rm.addEventListener("click", function () {
        chip.remove();
        AS.initLucideIcons();
      });
      chip.appendChild(rm);
      added.appendChild(chip);
      AS.initLucideIcons();
    }

    btn.addEventListener("click", function () {
      var v = input.value.trim();
      if (!v) return;
      input.value = "";
      var match = suggest.querySelector(
        '.app-tag-suggest[data-tag="' + AS.escAttr(v) + '"]',
      );
      if (match) {
        match.classList.add("is-selected");
        AS.syncTagSuggestSelectionState(match);
      } else addChip(v);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        btn.click();
      }
    });

    suggest.querySelectorAll(".app-tag-suggest").forEach(function (st) {
      st.addEventListener("click", function (e) {
        e.preventDefault();
        st.classList.toggle("is-selected");
        AS.syncTagSuggestSelectionState(st);
      });
      AS.syncTagSuggestSelectionState(st, true);
    });
    AS.initLucideIcons();
  };

  AS.parseCardDate = function (s) {
    if (!s) return 0;
    if (String(s).indexOf("-") !== -1) {
      var iso = String(s).split("-");
      if (iso.length !== 3) return 0;
      return new Date(+iso[0], +iso[1] - 1, +iso[2]).getTime();
    }
    var p = String(s).split("/");
    if (p.length !== 3) return 0;
    return new Date(+p[2], +p[0] - 1, +p[1]).getTime();
  };

  AS.formatDisplayDate = function (iso) {
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    return +p[1] + "/" + +p[2] + "/" + p[0];
  };

  /** Human-readable file size for upload UI (bytes → B / KB / MB / GB). */
  AS.formatFileSize = function (bytes) {
    var n = Number(bytes);
    if (!isFinite(n) || n < 0) return "0 B";
    var u = ["B", "KB", "MB", "GB", "TB"];
    var i = 0;
    var v = n;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    var rounded = i === 0 ? Math.round(v) : Math.round(v * 10) / 10;
    return rounded + " " + u[i];
  };

  AS.youtubeThumb = function (url) {
    var m = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
    );
    if (m) return "https://img.youtube.com/vi/" + m[1] + "/mqdefault.jpg";
    return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=640&q=80";
  };

  AS.strokeClass = function (stroke) {
    return stroke ? "badge-tag--orange" : "";
  };

  AS.skillClass = function (skill) {
    if (skill === "Beginner") return "badge-tag--yellow";
    if (skill === "Intermediate") return "badge-tag--blue";
    return "badge-tag--green";
  };

  AS.skillClassPro = function (skill) {
    if (skill === "Beginner") return "badge-tag--yellow";
    if (skill === "Intermediate") return "badge-tag--blue";
    return "badge-tag--green";
  };

  /** Side filter: .app-side-panel + .app-side-panel__backdrop + is-open */
  AS.bindSideFilter = function (opts) {
    var openBtn = opts.openBtnId && document.getElementById(opts.openBtnId);
    var panel = opts.panelId && document.getElementById(opts.panelId);
    var backdrop = opts.backdropId && document.getElementById(opts.backdropId);
    var closeBtnIds = opts.closeBtnIds || [];
    if (!openBtn || !panel || !backdrop) return null;
    function open() {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
    }
    function close() {
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
    }
    openBtn.addEventListener("click", open);
    backdrop.addEventListener("click", close);
    closeBtnIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", close);
    });
    return { open: open, close: close };
  };

  /** Centered .app-overlay modal / dialog — closes on backdrop click */
  AS.bindCenterOverlay = function (opts) {
    var overlay =
      opts.overlay ||
      (opts.overlayId && document.getElementById(opts.overlayId));
    var openBtn = opts.openBtnId && document.getElementById(opts.openBtnId);
    var closeBtn = opts.closeBtnId && document.getElementById(opts.closeBtnId);
    if (!overlay) return null;
    function open() {
      overlay.classList.add("is-open");
    }
    function close() {
      overlay.classList.remove("is-open");
    }
    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    return { open: open, close: close };
  };

  /** Stroke label → badge-tone (session-evaluation Reference Clips / coach-clips style tags). */
  AS.strokeBadgeTone = function (stroke) {
    var m = {
      Forehand: "green",
      Backhand: "blue",
      Volley: "red",
      Serve: "orange",
      Smash: "orange",
    };
    return m[stroke] || "orange";
  };

  /**
   * Exclusive stroke pills: .badge-tag.pc-stroke-badge + data-stroke + optional data-stroke-color mirror.
   */
  AS.bindExclusiveStrokeBadges = function (containerSelector) {
    var root = document.querySelector(containerSelector);
    if (!root) return;

    function strokeLabel(btn) {
      return (btn.getAttribute("data-stroke") || "").trim();
    }

    function strip(btn) {
      var s = strokeLabel(btn);
      btn.className = "badge-tag pc-stroke-badge";
      btn.textContent = s;
    }

    function applySelected(btn) {
      var s = strokeLabel(btn);
      var tone = AS.strokeBadgeTone(s);
      btn.className =
        "badge-tag badge-tag--" + tone + " is-selected pc-stroke-badge";
      btn.innerHTML =
        '<span class="badge-tag__check"><i data-lucide="check" width="12" height="12"></i></span> ' +
        AS.escapeHtml(s);
      AS.initLucideIcons();
    }

    root.querySelectorAll(".pc-stroke-badge").forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.querySelectorAll(".pc-stroke-badge").forEach(strip);
        applySelected(btn);
      });
    });
  };

  /** Player level: unselected = .badge-tag only; selected = .badge-tag.badge-tag--{color}.is-selected + check icon */
  AS.bindExclusiveLevelBadges = function (containerSelector) {
    var root = document.querySelector(containerSelector);
    if (!root) return;

    function labelText(btn) {
      return (
        btn.getAttribute("data-label") ||
        btn.getAttribute("data-value") ||
        ""
      ).trim();
    }

    function stripToUnselected(btn) {
      btn.className = "badge-tag";
      btn.textContent = labelText(btn);
    }

    function applySelected(btn) {
      var color = btn.getAttribute("data-level-color");
      if (!color) return;
      btn.className = "badge-tag badge-tag--" + color + " is-selected";
      var t = labelText(btn);
      btn.innerHTML =
        '<span class="badge-tag__check"><i data-lucide="check" width="14" height="14"></i></span> ' +
        AS.escapeHtml(t);
      AS.initLucideIcons();
    }

    root.querySelectorAll(".badge-tag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.querySelectorAll(".badge-tag").forEach(stripToUnselected);
        applySelected(btn);
      });
    });
  };

  /** One selected chip per group (e.g. player level) */
  AS.bindExclusiveChips = function (containerSelector) {
    var root = document.querySelector(containerSelector);
    if (!root) return;
    root.querySelectorAll(".app-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        root.querySelectorAll(".app-chip").forEach(function (c) {
          c.classList.remove("is-selected");
        });
        chip.classList.add("is-selected");
      });
    });
  };

  /** Multi-select chips (e.g. training groups) */
  AS.bindToggleChips = function (containerSelector) {
    var root = document.querySelector(containerSelector);
    if (!root) return;
    root.querySelectorAll(".app-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("is-selected");
      });
    });
  };

  /**
   * Training group (multi-select): unselected = .badge-tag + label text;
   * selected = .badge-tag.badge-tag--{data-group-color}.is-selected + check.
   * Supports legacy .app-chip + .app-chip--grp-* in the same container.
   */
  AS.bindToggleGroupChips = function (containerSelector) {
    var root = document.querySelector(containerSelector);
    if (!root) return;

    function labelText(btn) {
      return (
        btn.getAttribute("data-label") ||
        btn.getAttribute("data-value") ||
        ""
      ).trim();
    }

    function strip(btn) {
      if (btn.classList.contains("badge-tag")) {
        btn.className = "badge-tag";
      } else {
        btn.className = "app-chip";
      }
      btn.textContent = labelText(btn);
    }

    function select(btn) {
      var grp = btn.getAttribute("data-group-color");
      if (!grp) return;
      var t = labelText(btn);
      if (btn.matches(".badge-tag")) {
        btn.className = "badge-tag badge-tag--" + grp + " is-selected";
        btn.innerHTML =
          '<span class="badge-tag__check"><i data-lucide="check" width="14" height="14"></i></span> ' +
          AS.escapeHtml(t);
      } else {
        btn.className = "app-chip app-chip--grp-" + grp + " is-selected";
        btn.innerHTML =
          '<span class="app-chip__check"><i data-lucide="check" width="14" height="14"></i></span> ' +
          AS.escapeHtml(t);
      }
      AS.initLucideIcons();
    }

    root
      .querySelectorAll(
        ".badge-tag[data-group-color], .app-chip[data-group-color]",
      )
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (btn.classList.contains("is-selected")) {
            strip(btn);
          } else {
            select(btn);
          }
        });
      });
  };

  AS.resetMultiselectsIn = function (root) {
    (root || document)
      .querySelectorAll(".app-multiselect")
      .forEach(function (ms) {
        if (ms._reset) ms._reset();
      });
  };

  /** Show .app-overlay then auto-hide after ms (0 = no timer) */
  AS.flashOverlay = function (overlayOrId, ms) {
    var t = ms == null ? 2000 : ms;
    var el =
      typeof overlayOrId === "string"
        ? document.getElementById(overlayOrId)
        : overlayOrId;
    if (!el) return;
    el.classList.add("is-open");
    if (t > 0) {
      setTimeout(function () {
        el.classList.remove("is-open");
      }, t);
    }
  };

  /**
   * Sliding pill indicator for segmented controls (camera angle, library pickers, etc.).
   * @param {HTMLElement|null} root
   * @param {{ trackSelector?: string, btnSelector?: string }} [opts]
   */
  AS.initSlidingSegmented = function (root, opts) {
    opts = opts || {};
    if (!root) return;
    if (root.getAttribute("data-sliding-seg-bound") === "1") return;
    var trackSel = opts.trackSelector || ".app-sliding-seg__track";
    var btnSel = opts.btnSelector || ".app-sliding-seg__btn";
    var track = root.querySelector(trackSel);
    var btns = root.querySelectorAll(btnSel);
    if (!track || !btns.length) return;
    root.setAttribute("data-sliding-seg-bound", "1");

    function sync() {
      var active = root.querySelector(btnSel + ".is-active");
      if (!active) {
        active = btns[0];
        if (active) active.classList.add("is-active");
      }
      if (!active) return;
      var pad = parseFloat(getComputedStyle(root).paddingLeft) || 0;
      track.style.width = active.offsetWidth + "px";
      track.style.transform = "translateX(" + (active.offsetLeft - pad) + "px)";
    }

    root._slidingSegSync = sync;

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) {
          x.classList.remove("is-active");
        });
        b.classList.add("is-active");
        sync();
      });
    });

    window.addEventListener("resize", sync);
    function runLayout() {
      requestAnimationFrame(function () {
        requestAnimationFrame(sync);
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runLayout);
    } else {
      runLayout();
    }
    window.addEventListener("load", sync);
  };

  /**
   * One-time wiring for #clipVideoExpandOverlay / #clipVideoExpandPlayer / #clipVideoExpandClose.
   * Include the modal markup on the page (same pattern as full-evaluation video modal).
   */
  AS.bindClipVideoExpandModal = function () {
    var overlay = document.getElementById("clipVideoExpandOverlay");
    var player = document.getElementById("clipVideoExpandPlayer");
    var closeBtn = document.getElementById("clipVideoExpandClose");
    if (!overlay || !player || overlay.getAttribute("data-clip-expand-bound") === "1") {
      return;
    }
    overlay.setAttribute("data-clip-expand-bound", "1");

    function closeModal() {
      player.pause();
      player.removeAttribute("src");
      player.removeAttribute("poster");
      player.load();
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
      }
    });
  };

  /** Open shared clip expand modal from an inline card video (syncs time, pauses card). */
  AS.openClipVideoExpandModal = function (videoEl) {
    AS.bindClipVideoExpandModal();
    var overlay = document.getElementById("clipVideoExpandOverlay");
    var player = document.getElementById("clipVideoExpandPlayer");
    if (!overlay || !player || !videoEl || videoEl.tagName !== "VIDEO") return;
    var src = videoEl.currentSrc || videoEl.src || videoEl.getAttribute("src");
    if (!src) return;
    var poster = videoEl.getAttribute("poster");
    if (poster) player.setAttribute("poster", poster);
    else player.removeAttribute("poster");
    player.src = src;
    player.currentTime = videoEl.currentTime || 0;
    videoEl.pause();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    AS.initLucideIcons();
    var p = player.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  };

  AS.wireCardMedia = function (card, skipSeconds) {
    var sec = skipSeconds == null ? 10 : skipSeconds;
    var mediaWrap = card.querySelector(".cc-card__media");
    var media = card.querySelector("video") || card.querySelector("img");
    var playBtn = card.querySelector(".cc-play-toggle");
    var skipB = card.querySelector(".cc-skip-back");
    var skipF = card.querySelector(".cc-skip-fwd");
    var expandBtn = card.querySelector(".cc-card__expand");

    if (!media || media.tagName !== "VIDEO") {
      if (playBtn && media) {
        playBtn.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }
      return;
    }
    var video = media;

    function setControlsHidden(hidden) {
      if (mediaWrap) {
        mediaWrap.classList.toggle("is-controls-hidden", hidden);
      }
    }

    video.addEventListener("play", function () {
      setControlsHidden(true);
    });
    video.addEventListener("pause", function () {
      setControlsHidden(false);
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" width="22" height="22"></i>';
        AS.initLucideIcons();
      }
    });
    video.addEventListener("ended", function () {
      setControlsHidden(false);
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" width="22" height="22"></i>';
        AS.initLucideIcons();
      }
    });

    if (playBtn) {
      playBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }

    video.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!video.paused) {
        video.pause();
      } else {
        video.play();
      }
    });

    function skip(delta) {
      video.currentTime = Math.max(
        0,
        Math.min(video.duration || 1e9, (video.currentTime || 0) + delta),
      );
    }
    if (skipB) {
      skipB.addEventListener("click", function (e) {
        e.stopPropagation();
        skip(-sec);
      });
    }
    if (skipF) {
      skipF.addEventListener("click", function (e) {
        e.stopPropagation();
        skip(sec);
      });
    }

    if (expandBtn) {
      expandBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        AS.openClipVideoExpandModal(video);
      });
    }

    AS.bindClipVideoExpandModal();
  };

  /**
   * Filter recommendation cards by search text. The container should be a row whose
   * direct children are column wrappers, each containing an article (or similar card).
   */
  /**
   * Remove inline validation UI under root (feedback nodes + .is-invalid).
   * @param {ParentNode|null|undefined} root
   */
  AS.clearFormValidation = function (root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(".app-form-feedback").forEach(function (n) {
      n.remove();
    });
    root.querySelectorAll(".is-invalid").forEach(function (n) {
      n.classList.remove("is-invalid");
    });
  };

  /**
   * Clear validation for one control (input in .app-form-group, dropzone, or .app-multiselect).
   * @param {Element|null|undefined} el
   */
  AS.clearFieldInvalid = function (el) {
    if (!el) return;
    var group = el.closest && el.closest(".app-form-group");
    if (group && el !== group && group.contains(el)) {
      group.classList.remove("is-invalid");
      group.querySelectorAll(".app-form-feedback").forEach(function (n) {
        n.remove();
      });
      group
        .querySelectorAll(".app-form-input, textarea, select")
        .forEach(function (inp) {
          inp.classList.remove("is-invalid");
        });
      return;
    }
    el.classList.remove("is-invalid");
    var next = el.nextElementSibling;
    if (next && next.classList.contains("app-form-feedback")) {
      next.remove();
    }
  };

  /**
   * Show orange border + helper text. For inputs inside .app-form-group, feedback is appended to the group.
   * @param {Element|null|undefined} el
   * @param {string} message
   */
  AS.setFieldInvalid = function (el, message) {
    if (!el) return;
    AS.clearFieldInvalid(el);
    message = message || "This field is required.";
    var group = el.closest && el.closest(".app-form-group");
    if (
      group &&
      el !== group &&
      group.contains(el) &&
      (el.classList.contains("app-form-input") ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT")
    ) {
      group.classList.add("is-invalid");
      el.classList.add("is-invalid");
      var p1 = document.createElement("p");
      p1.className = "app-form-feedback";
      p1.setAttribute("role", "alert");
      p1.innerHTML =
        '<i data-lucide="alert-circle" width="16" height="16" aria-hidden="true"></i><span></span>';
      var s1 = p1.querySelector("span");
      if (s1) s1.textContent = message;
      group.appendChild(p1);
      AS.initLucideIcons();
      return;
    }
    el.classList.add("is-invalid");
    var p = document.createElement("p");
    p.className = "app-form-feedback";
    p.setAttribute("role", "alert");
    p.innerHTML =
      '<i data-lucide="alert-circle" width="16" height="16" aria-hidden="true"></i><span></span>';
    var span = p.querySelector("span");
    if (span) span.textContent = message;
    el.insertAdjacentElement("afterend", p);
    AS.initLucideIcons();
  };

  /**
   * @param {HTMLFormElement|null|undefined} form
   * @returns {boolean}
   */
  AS.validateRequiredFormFields = function (form) {
    if (!form) return false;
    var ok = true;
    form.querySelectorAll("input[required], textarea[required], select[required]").forEach(
      function (inp) {
        if (inp.type === "checkbox" || inp.type === "radio") {
          if (!inp.checkValidity()) {
            AS.setFieldInvalid(
              inp,
              inp.getAttribute("data-invalid-msg") ||
                inp.validationMessage ||
                "This field is required.",
            );
            ok = false;
          }
          return;
        }
        var v = (inp.value || "").trim();
        if (!v || !inp.checkValidity()) {
          AS.setFieldInvalid(
            inp,
            inp.getAttribute("data-invalid-msg") ||
              (!v
                ? "This field is required."
                : inp.validationMessage || "Invalid value."),
          );
          ok = false;
        }
      },
    );
    return ok;
  };

  /**
   * @param {Element|null|undefined} msRoot .app-multiselect element with _getSelected
   * @param {string} message
   * @returns {boolean}
   */
  AS.validateMultiselectHasSelection = function (msRoot, message) {
    if (!msRoot || typeof msRoot._getSelected !== "function") return false;
    var sel = msRoot._getSelected();
    if (sel && sel.length) return true;
    AS.setFieldInvalid(
      msRoot,
      message || "Please select a stroke type.",
    );
    return false;
  };

  /**
   * @param {File|undefined|null} file
   * @param {string} urlTrimmed
   * @param {Element} dropzoneEl
   * @param {string} [bothEmptyMsg]
   * @returns {boolean}
   */
  AS.validateFileOrUrl = function (file, urlTrimmed, dropzoneEl, bothEmptyMsg) {
    if (file || (urlTrimmed && urlTrimmed.length)) return true;
    AS.setFieldInvalid(
      dropzoneEl,
      bothEmptyMsg ||
        "Upload failed. Please select a valid video file or enter a video URL and try again.",
    );
    return false;
  };

  /**
   * Clears native invalid state when the user edits fields.
   * @param {HTMLFormElement|null|undefined} form
   */
  AS.bindLiveFormValidationReset = function (form) {
    if (!form) return;
    form.addEventListener(
      "input",
      function (e) {
        var t = e.target;
        if (t && t.matches && t.matches("input, textarea, select")) {
          AS.clearFieldInvalid(t);
        }
      },
      true,
    );
    form.addEventListener(
      "change",
      function (e) {
        var t = e.target;
        if (t && t.matches && t.matches("input, textarea, select")) {
          AS.clearFieldInvalid(t);
        }
      },
      true,
    );
  };

  /**
   * Library upload modals: live field reset, optional URL input clears dropzone error, multiselect clicks clear their invalid state.
   * @param {{ form?: HTMLFormElement|null, dropzone?: Element|null, urlInput?: HTMLInputElement|null, multiselectIds?: string[] }} opts
   */
  AS.wireUploadModalValidationUX = function (opts) {
    opts = opts || {};
    var form = opts.form;
    var dropzone = opts.dropzone;
    var urlInput = opts.urlInput;
    var multiselectIds = opts.multiselectIds || [];
    if (form) {
      AS.bindLiveFormValidationReset(form);
    }
    if (dropzone && urlInput) {
      urlInput.addEventListener("input", function () {
        AS.clearFieldInvalid(dropzone);
      });
    }
    multiselectIds.forEach(function (id) {
      var ms = document.getElementById(id);
      if (!ms) return;
      ms.addEventListener("click", function () {
        AS.clearFieldInvalid(ms);
      });
    });
  };

  AS.bindRecommendationCardSearch = function (inputId, buttonId, containerId) {
    var input = document.getElementById(inputId);
    var btn = buttonId ? document.getElementById(buttonId) : null;
    var container = document.getElementById(containerId);
    if (!input || !container) return;

    function apply() {
      var q = (input.value || "").trim().toLowerCase();
      var cols = container.children;
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        var article =
          col.tagName === "ARTICLE" ? col : col.querySelector("article");
        if (!article) {
          col.classList.remove("d-none");
          continue;
        }
        var blob = (article.textContent || "").toLowerCase();
        var match = !q || blob.indexOf(q) !== -1;
        var hideRoot = col.tagName === "ARTICLE" ? col : col;
        hideRoot.classList.toggle("d-none", !match);
      }
    }

    input.addEventListener("input", apply);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        apply();
      }
    });
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        apply();
      });
    }
  };

  global.AppShared = AS;
})(typeof window !== "undefined" ? window : this);
