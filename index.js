function initScrollEffects() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    reduceMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  // แต่ละกลุ่มจะปรากฏไล่กัน
  const groups = [
    ".profile-hero__content, .profile-hero__visual",
    ".about-experience .info-card",
    ".skills-heading, .skills-row",
    ".certificates-heading",
    ".certificates-grid .certificate-card",
    ".projects-heading",
    ".projects-grid .project-card",
    ".portfolio-footer__contact, .footer-links"
  ];

  const elements = new Set();

  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");

      // จำกัดเวลาหน่วงไม่ให้รอนาน
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 100, 300)}ms`
      );

      elements.add(element);
    });
  });

  if (elements.size === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1
    }
  );

  document.documentElement.classList.add("reveal-enabled");

  elements.forEach((element) => {
    observer.observe(element);
  });

  // หากผู้ใช้เปิดลดการเคลื่อนไหวระหว่างดูเว็บ
  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-enabled");
    }
  });
}

function initCarousels() {
  document.querySelectorAll("[data-carousel-target]").forEach((button) => {
    const track = document.getElementById(button.dataset.carouselTarget);
    if (!track) return;

    const direction = Number(button.dataset.carouselDirection);
    const updateButton = () => {
      const hasOverflow = track.scrollWidth > track.clientWidth + 1;
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      button.disabled = !hasOverflow || (direction < 0 ? atStart : atEnd);
    };

    button.addEventListener("click", () => {
      track.scrollBy({
        left: direction * track.clientWidth * 0.85,
        behavior: "auto"
      });
    });

    track.addEventListener("scroll", updateButton, { passive: true });
    window.addEventListener("resize", updateButton);
    updateButton();
  });
}

function initNavigation() {
  const links = Array.from(document.querySelectorAll(".site-menu a"));
  const updateActive = () => {
    const target = window.location.hash || "#home";
    links.forEach((link) => {
      const active = link.getAttribute("href") === target;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  window.addEventListener("hashchange", updateActive);
  updateActive();
}

function initSkillsToggle() {
  const button = document.querySelector(".skills-toggle");
  const extra = document.getElementById("skills-extra");
  if (!button || !extra) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") !== "true";
    extra.hidden = !expanded;
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Show less" : "Show all";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollEffects();
    initCarousels();
    initSkillsToggle();
    initNavigation();
  });
} else {
  initScrollEffects();
  initCarousels();
  initSkillsToggle();
  initNavigation();
}
