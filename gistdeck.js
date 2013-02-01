(function($) {
if ($) {
  var slides = [];
  var host = window.location.hostname;
  if (host === 'gist.github.com') {
    // We're on gist.github.com
    slides = $('#owner, .markdown-body h1, .markdown-body h2');
  } else if (host === 'gist.io') {
    // We're on gist.io
    slides = $('#description, #gistbody .file > h1:not(:first-child), #gistbody .file > h2');
  } else {
    // We're not on a deckable page.
  }

  function prevSlide() {
    displaySlide(getCurrentSlideIdx() - 1);
  }
  function nextSlide() {
    displaySlide(getCurrentSlideIdx() + 1);
  }

  function getCurrentSlideIdx() {
    var idx = 0;
    var viewportBottom = $window.scrollTop() + $window.height();

    for (var i = 0; i < slides.length; i++) {
      if (slides.eq(i).offset().top > viewportBottom) break;
      idx = i;
    }

    return idx;
  }

  function displaySlide(n) {
    n = Math.min(n, slides.length - 1);
    n = Math.max(n, 0);

    var s = slides.eq(n);
    var top = s.offset().top;

    // To vertically center the H1 slides, we must calculate the height of the
    // slide content. To do this, get the difference between the bottom of the
    // last and top of the first slide element. We should only do this if there
    // is a next slide.
    var lastSlideELement = slides.eq(n + 1).prev();
    var titleTop = 150;
    var contentHeight = 0;
    if (lastSlideELement.length === 0) {
      // lastSlideELement will be empty if we are at the last slide. In that case
      // find the last element. .nextAll().andSelf() ensures we don't end up with
      // an empty set since nextAll() will return empty if at the last element.
      lastSlideELement = s.nextAll().andSelf().last();
    }
    contentHeight = (lastSlideELement.offset().top + lastSlideELement.height()) - top;
    // The top line is half the window plus half the content height.
    titleTop = ($window.height() / 2) - (contentHeight / 2);

    var padding = {
      'DIV': top,
      'H1': titleTop,
      'H2': 20
    }[slides[n].tagName];

    $(document).scrollTop(top - padding);
  }

  // Only run if we have found some slides.
  if (slides.length > 0) {
    // Cache the window jQuery object.
    $window = $(window);
    // Set a gap between each slide equal to the window height to stop slides
    // intruding on each other. But don't do it for the first slide.
    slides.not(slides.first()).css('margin-top', $window.height());
    // Also set this gap between the last slide element and the slides container.
    // This stops the end slide always being at the bottom of the window.
    $('.markdown-body').css('margin-bottom', $window.height());

    $(document).keydown(function(e) {
      var key = e.which || e.keyCode || e.charCode;
      switch (key) {
        case 37:
          prevSlide();
          break;
        case 39:
          nextSlide();
          break;
        default:
          break;
      }
    });

    displaySlide(0);

    return true;
  } else {
    return false;
  }
} else {
  return false;
}
})(jQuery);
