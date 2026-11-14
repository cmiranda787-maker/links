/* Preview carousels (comics + book): Prev/Next buttons + dots over a
   scroll-snap track. Initializes every .carousel on the page. Without
   JavaScript the tracks still swipe and scroll. */
(function () {
  'use strict';

  document.querySelectorAll('.carousel').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var prev = root.querySelector('.carousel-prev');
    var next = root.querySelector('.carousel-next');
    var dotsWrap = root.querySelector('.dots');
    if (!track || !prev || !next || !dotsWrap) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('figure'));
    if (!slides.length) return;

    var dots = slides.map(function (slide, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(b);
      return b;
    });

    // Leftmost visible slide: first slide whose right edge is past the
    // scroll position. (Using the track center misfires on wide screens,
    // where two slides are visible at once.)
    function currentIndex() {
      var x = track.scrollLeft + 10;
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].offsetLeft + slides[i].offsetWidth > x) return i;
      }
      return slides.length - 1;
    }

    function update() {
      var i = currentIndex();
      dots.forEach(function (dot, j) {
        dot.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }

    function goTo(i) {
      var slide = slides[i];
      track.scrollTo({ left: slide.offsetLeft - 8, behavior: 'smooth' });
    }

    prev.addEventListener('click', function () { goTo(Math.max(0, currentIndex() - 1)); });
    next.addEventListener('click', function () { goTo(Math.min(slides.length - 1, currentIndex() + 1)); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
