/**
 * BLOSSOM DENTAL & IMPLANT STUDIO - ANIMATIONS SCRIPT
 * IntersectionObserver for scroll slides, cursive draw trigger & micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Scroll Reveals
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));
  } else {
    scrollElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Cursive Welcome Animation Re-trigger on hover
  const cursiveBadge = document.querySelector('.cursive-welcome-badge');
  const cursiveText = document.querySelector('.cursive-welcome-text');

  if (cursiveBadge && cursiveText) {
    cursiveBadge.addEventListener('mouseenter', () => {
      cursiveText.style.animation = 'none';
      void cursiveText.offsetWidth; // Trigger DOM reflow
      cursiveText.style.animation = 'cursiveSlideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
    });
  }

  // 3. Header Scrolled State
  const mainHeader = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }
  }, { passive: true });
});
