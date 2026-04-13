// ── Copyright year ───────────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav scroll state ─────────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Mobile menu toggle ───────────────────────────────────────────────────────
const burger = document.querySelector('.nav__burger');
const mobileNav = document.getElementById('mobile-nav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Intersection Observer for scroll-reveal ──────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// ── Portfolio filter system ──────────────────────────────────────────────────
// Reads active filters from URL params on load so the state is shareable/
// bookmarkable. Clicking a filter button updates the URL and re-renders.

(function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  if (!filterBtns.length) return;

  const params = new URLSearchParams(window.location.search);
  let activeCats  = new Set((params.get('category') || '').split(',').filter(Boolean));
  let activeTechs = new Set((params.get('tech')     || '').split(',').filter(Boolean));

  // Sync button states to URL on load
  filterBtns.forEach(btn => {
    const type = btn.dataset.filterType;  // 'category' or 'tech'
    const val  = btn.dataset.filter;
    if ((type === 'category' && activeCats.has(val)) ||
        (type === 'tech'     && activeTechs.has(val))) {
      btn.classList.add('active');
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.filterType;
      const val  = btn.dataset.filter;
      const set  = type === 'category' ? activeCats : activeTechs;

      if (set.has(val)) {
        set.delete(val);
        btn.classList.remove('active');
      } else {
        set.add(val);
        btn.classList.add('active');
      }

      // Build new URL
      const newParams = new URLSearchParams();
      if (activeCats.size)  newParams.set('category', [...activeCats].join(','));
      if (activeTechs.size) newParams.set('tech',     [...activeTechs].join(','));

      // Navigate (Django renders the filtered page server-side)
      window.location.search = newParams.toString();
    });
  });
})();