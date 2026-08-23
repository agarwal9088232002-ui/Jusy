/* =========================================================
   jusy_washere — site behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     FALLBACK CONTENT
     Used only if the content API is unreachable or not yet
     set up. The site always renders something — visitors never
     see a loading spinner, an error message, or any sign that
     a backend exists at all. Safe to edit by hand for now; once
     a backend is live, this data is only ever a safety net.
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     FALLBACK CONTENT
     Real items only. This site is public — nothing here should
     read as an instruction to the site owner or a placeholder
     screenshot; an empty category renders a plain "nothing yet"
     state instead (see EMPTY_MESSAGES / renderGrid below).
     Add real entries as work goes up.
  --------------------------------------------------------- */
  const FALLBACK_CONTENT = {
    webdev: [],
    tech: [],
    anime: [
      {
        tag: "channel",
        status: "on YouTube",
        title: "New edits go up here first",
        desc: "The full catalog of edits lives on the channel — new uploads land there before anywhere else.",
        href: "https://www.youtube.com/@jusy_washere",
      },
    ],
    other: [],
  };

  const EMPTY_MESSAGES = {
    webdev: "New projects are on the way.",
    tech: "New write-ups are on the way.",
    anime: "New edits are on the way.",
    other: "New content is on the way.",
  };

  /* ---------------------------------------------------------
     Escape text before it ever reaches innerHTML. Content may
     eventually come from a backend the visitor doesn't see —
     it must never be trusted to contain safe markup.
  --------------------------------------------------------- */
  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value == null ? "" : value);
    return div.innerHTML;
  }

  /* ---------------------------------------------------------
     Skeleton placeholders — shown the instant the page loads,
     swapped out once content is ready. No spinner, no loading
     text, nothing that reads as "waiting on a server."
  --------------------------------------------------------- */
  function renderSkeletons(gridId, count) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = Array.from({ length: count })
      .map(
        () => `
          <div class="card card--skeleton" aria-hidden="true">
            <div class="skeleton-line skeleton-line--tag"></div>
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--body"></div>
            <div class="skeleton-line skeleton-line--body short"></div>
          </div>
        `
      )
      .join("");
  }

  /* ---------------------------------------------------------
     Render content cards
  --------------------------------------------------------- */
  function renderGrid(gridId, items, emptyMessage) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.removeAttribute("aria-busy");

    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = `
        <div class="card card--empty">
          <p class="card--empty__text">${escapeHTML(emptyMessage || "Nothing here yet.")}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const isLink = Boolean(item.href);
        const tagName = isLink ? "a" : "div";
        const linkAttrs = isLink
          ? `href="${escapeHTML(item.href)}" target="_blank" rel="noopener noreferrer"`
          : "";
        const linkMarkup = isLink
          ? `<div class="card__foot"><span class="card__link">watch <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>`
          : "";

        return `
          <${tagName} class="card${isLink ? "" : " card--placeholder"}" ${linkAttrs}>
            <div class="card__top">
              <span class="card__tag">${escapeHTML(item.tag)}</span>
              <span class="card__status">${escapeHTML(item.status)}</span>
            </div>
            <h3 class="card__title">${escapeHTML(item.title)}</h3>
            <p class="card__desc">${escapeHTML(item.desc)}</p>
            ${linkMarkup}
          </${tagName}>
        `;
      })
      .join("");
  }

  /* ---------------------------------------------------------
     Load content — backend first, fallback second, always
     silent. The visitor never sees which one served the page:
     no error banners, no console noise that names an endpoint,
     no visible difference in markup or timing between the two.
  --------------------------------------------------------- */
  const GRIDS = [
    { id: "webdevGrid", category: "webdev" },
    { id: "techGrid", category: "tech" },
    { id: "animeGrid", category: "anime" },
    { id: "otherGrid", category: "other" },
  ];

  GRIDS.forEach((grid) => renderSkeletons(grid.id, 3));

  function renderFallback() {
    GRIDS.forEach((grid) =>
      renderGrid(grid.id, FALLBACK_CONTENT[grid.category], EMPTY_MESSAGES[grid.category])
    );
  }

  async function loadContent() {
    // No backend configured yet: stay on fallback content, no network
    // call attempted, nothing to fail or log.
    if (!window.CONTENT_API_URL) {
      renderFallback();
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(window.CONTENT_API_URL, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error("content unavailable");
      const data = await response.json();

      GRIDS.forEach((grid) => {
        const items = Array.isArray(data?.[grid.category]) ? data[grid.category] : null;
        const finalItems = items && items.length ? items : FALLBACK_CONTENT[grid.category];
        renderGrid(grid.id, finalItems, EMPTY_MESSAGES[grid.category]);
      });
    } catch (err) {
      // Backend missing, slow, or misconfigured — fall back without
      // surfacing anything to the page or the console.
      renderFallback();
    }
  }

  loadContent();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const tabs = document.getElementById("tabs");

  if (menuBtn && tabs) {
    menuBtn.addEventListener("click", () => {
      const isOpen = tabs.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    tabs.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        tabs.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     Active tab highlighting on scroll
  --------------------------------------------------------- */
  const sections = ["webdev", "tech", "anime", "other", "connect"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const tabLinks = Array.from(document.querySelectorAll(".tab"));

  function setActiveTab(id) {
    tabLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.tab === id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------
     Hero typewriter
  --------------------------------------------------------- */
  const typewriterEl = document.getElementById("typewriter");
  const phrases = [
    "content creator.",
    "tech enthusiast.",
    "anime edit maker.",
    "always building something.",
  ];

  if (typewriterEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(tick, deleting ? 35 : 65);
    }

    tick();
  } else if (typewriterEl) {
    typewriterEl.textContent = phrases[0];
  }

  /* ---------------------------------------------------------
     Scroll cue
  --------------------------------------------------------- */
  const scrollCue = document.getElementById("scrollCue");
  if (scrollCue) {
    scrollCue.addEventListener("click", () => {
      const about = document.getElementById("about");
      if (about) about.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Discord handle — copy to clipboard (no WhatsApp, no fake link)
  --------------------------------------------------------- */
  const discordCard = document.getElementById("discordCard");
  const discordHint = document.getElementById("discordHint");

  if (discordCard && discordHint) {
    discordCard.addEventListener("click", async () => {
      const value = discordCard.dataset.copy || "";
      const originalHint = "tap to copy";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const temp = document.createElement("textarea");
          temp.value = value;
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        discordHint.textContent = "copied!";
        discordCard.classList.add("is-copied");
      } catch (err) {
        discordHint.textContent = "copy failed";
      }

      setTimeout(() => {
        discordHint.textContent = originalHint;
        discordCard.classList.remove("is-copied");
      }, 1800);
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
