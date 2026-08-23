/* =========================================================
   jusy_washere — site behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     EDITABLE CONTENT DATA
     Replace/extend these arrays with real items whenever you
     have real projects, videos, or posts to show. Each entry
     with a `href` renders as a link; leave `href` out (or set
     to "#") to render as a plain placeholder card.
  --------------------------------------------------------- */
  const CONTENT = {
    webdev: [
      {
        tag: "project",
        status: "add your work",
        title: "Your latest build",
        desc: "Swap this card for a real project — title, one-line summary, and a link to the live site or repo.",
      },
      {
        tag: "project",
        status: "add your work",
        title: "Another project",
        desc: "This grid is built to hold as many cards as you need — duplicate the pattern in main.js.",
      },
      {
        tag: "project",
        status: "add your work",
        title: "Client / freelance work",
        desc: "Case studies, dashboards, landing pages — whatever you want visitors to see first.",
      },
    ],
    tech: [
      {
        tag: "write-up",
        status: "add your work",
        title: "Your latest tech post",
        desc: "A breakdown, a review, or notes on something you've been testing recently.",
      },
      {
        tag: "write-up",
        status: "add your work",
        title: "Another tech piece",
        desc: "Keep these short and specific — one idea per card reads better than a wall of text.",
      },
      {
        tag: "write-up",
        status: "add your work",
        title: "Tool / setup notes",
        desc: "Your desk setup, dev environment, or a stack you'd recommend.",
      },
    ],
    anime: [
      {
        tag: "edit",
        status: "on YouTube",
        title: "Latest edit",
        desc: "Link this card straight to the YouTube upload once it's live.",
        href: "https://www.youtube.com/@jusy_washere",
      },
      {
        tag: "edit",
        status: "on YouTube",
        title: "Fan favourite",
        desc: "Pin whichever edit you want new visitors to see first.",
        href: "https://www.youtube.com/@jusy_washere",
      },
      {
        tag: "edit",
        status: "on YouTube",
        title: "More on the channel",
        desc: "The full cut list lives on the channel — this is just a preview.",
        href: "https://www.youtube.com/@jusy_washere",
      },
    ],
    other: [
      {
        tag: "misc",
        status: "add your work",
        title: "Whatever's on your mind",
        desc: "Not tech, not an edit, not client work — still worth a card.",
      },
      {
        tag: "misc",
        status: "add your work",
        title: "One-off drop",
        desc: "Good for one-time posts that don't need their own category.",
      },
    ],
  };

  /* ---------------------------------------------------------
     Render content cards
  --------------------------------------------------------- */
  function renderGrid(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = items
      .map((item) => {
        const isLink = Boolean(item.href);
        const tagName = isLink ? "a" : "div";
        const linkAttrs = isLink
          ? `href="${item.href}" target="_blank" rel="noopener noreferrer"`
          : "";
        const linkMarkup = isLink
          ? `<div class="card__foot"><span class="card__link">watch <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>`
          : "";

        return `
          <${tagName} class="card${isLink ? "" : " card--placeholder"}" ${linkAttrs}>
            <div class="card__top">
              <span class="card__tag">${item.tag}</span>
              <span class="card__status">${item.status}</span>
            </div>
            <h3 class="card__title">${item.title}</h3>
            <p class="card__desc">${item.desc}</p>
            ${linkMarkup}
          </${tagName}>
        `;
      })
      .join("");
  }

  renderGrid("webdevGrid", CONTENT.webdev);
  renderGrid("techGrid", CONTENT.tech);
  renderGrid("animeGrid", CONTENT.anime);
  renderGrid("otherGrid", CONTENT.other);

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
