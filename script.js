const playButton = document.getElementById('playButton');
const videoModal = document.getElementById('videoModal');
const closeButton = document.getElementById('closeButton');
const videoFrame = document.getElementById('videoFrame');
const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const leadersCarousel = document.getElementById('leadersCarousel');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

// Hero Slideshow Elements
const heroSlides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

// Replace with your actual YouTube or video URL
const videoURL = "https://www.youtube.com/embed/X3SblAXtmrU?autoplay=1";

if (playButton && videoModal && videoFrame) {
  playButton.addEventListener('click', () => {
    videoModal.style.display = 'flex';
    videoFrame.src = videoURL;
    document.body.style.overflow = "hidden";
  });
}

if (closeButton && videoModal && videoFrame) {
  closeButton.addEventListener('click', () => {
    videoModal.style.display = 'none';
    videoFrame.src = "";
    document.body.style.overflow = "auto";
  });
  
  // Close modal when clicking outside
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.style.display = 'none';
      videoFrame.src = "";
      document.body.style.overflow = "auto";
    }
  });
}

// Header scroll detection with smooth transitions
window.addEventListener('scroll', () => {
  if (!siteHeader) return;
  if (window.scrollY > 50) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

// Mobile navigation toggle
if (navToggle) {
  const closeMobileMenu = () => {
    const nav = navToggle.closest('.nav');
    const navLinksList = nav?.querySelector('.nav-links');
    navLinksList?.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
    document.body.classList.remove('menu-open');
  };

  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nav = navToggle.closest('.nav');
    const navLinksList = nav?.querySelector('.nav-links');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      closeMobileMenu();
    } else {
      navToggle.setAttribute('aria-expanded', 'true');
      navLinksList?.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    }
  });
  
  // Close nav when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking on overlay
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('menu-open')) {
      const nav = navToggle.closest('.nav');
      const navLinksList = nav?.querySelector('.nav-links');
      if (!nav?.contains(e.target) && !navLinksList?.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close menu on window resize if it's larger than mobile
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// Hero animations on load
window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }
  
  // Animate hero elements sequentially
  const heroElements = document.querySelectorAll('.hero-eyebrow, .hero h1, .hero .subtitle, .hero-actions, .hero-video-container');
  heroElements.forEach((el, index) => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + (index * 150));
    }
  });
});

const scrollCarouselBy = (direction = 'right') => {
  if (!leadersCarousel) return;
  const card = leadersCarousel.querySelector('.leader-card');
  const gap = 24;
  const scrollAmount = card ? card.offsetWidth + gap : 280;
  leadersCarousel.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
};

scrollLeftBtn?.addEventListener('click', () => scrollCarouselBy('left'));
scrollRightBtn?.addEventListener('click', () => scrollCarouselBy('right'));

let autoScrollInterval;

const startAutoScroll = () => {
  if (!leadersCarousel) return;
  stopAutoScroll();
  autoScrollInterval = setInterval(() => {
    if (!leadersCarousel) return;
    const maxScrollLeft = leadersCarousel.scrollWidth - leadersCarousel.clientWidth;
    const atEnd = leadersCarousel.scrollLeft >= maxScrollLeft - 5;
    leadersCarousel.scrollBy({ left: 1.6, behavior: 'smooth' });
    if (atEnd) {
      leadersCarousel.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 16);
};

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
};

if (leadersCarousel) {
  startAutoScroll();
  leadersCarousel.addEventListener('mouseenter', stopAutoScroll);
  leadersCarousel.addEventListener('mouseleave', startAutoScroll);
}

// Counter Animation
const counters = document.querySelectorAll('.counter');
let started = false;

function startCounter() {
  if (started) return;
  const section = document.querySelector('#numbers');
  if (!section) return;
  const sectionTop = section.getBoundingClientRect().top;

  if (sectionTop < window.innerHeight - 100) {
    started = true;
    counters.forEach(counter => {
      counter.innerText = "0";
      const target = +counter.getAttribute("data-target");
      const speed = 200; // smaller = faster

      const updateCount = () => {
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
  }
}

window.addEventListener('scroll', startCounter);

// Hero Slideshow Functions
function showSlide(index) {
  // Remove active class from all slides and indicators
  heroSlides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  
  // Add active class to current slide and indicator
  if (heroSlides[index]) {
    heroSlides[index].classList.add('active');
  }
  if (indicators[index]) {
    indicators[index].classList.add('active');
  }
  
  currentSlide = index;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  showSlide(currentSlide);
}

function startSlideshow() {
  if (heroSlides.length > 0) {
    slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
  }
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
}

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
  if (heroSlides.length > 0) {
    // Set first slide as active
    showSlide(0);
    
    // Start automatic slideshow
    startSlideshow();
    
    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        stopSlideshow();
        showSlide(index);
        startSlideshow(); // Restart slideshow after manual selection
      });
    });
    
    // Pause slideshow on hover
    const heroSection = document.querySelector('.hero-slideshow');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopSlideshow);
      heroSection.addEventListener('mouseleave', startSlideshow);
    }
  }
});

// Leaders Carousel Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const leadersCarousel = document.getElementById('leadersCarousel');

  console.log('Elements found:', {
    scrollLeftBtn: !!scrollLeftBtn,
    scrollRightBtn: !!scrollRightBtn,
    leadersCarousel: !!leadersCarousel
  });

  if (scrollLeftBtn && scrollRightBtn && leadersCarousel) {
    let currentIndex = 0;
    const images = leadersCarousel.querySelectorAll('img');
    const totalImages = images.length;
    const imageWidth = 530; // Fixed image width
    const gap = 20; // Gap between images
    const scrollAmount = imageWidth + gap;

    // Temporarily enable scrolling for programmatic control
    function enableScroll() {
      leadersCarousel.style.overflowX = 'auto';
    }

    function disableScroll() {
      leadersCarousel.style.overflowX = 'hidden';
    }

    scrollLeftBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Left scroll clicked, current index:', currentIndex);
      
      if (currentIndex > 0) {
        currentIndex--;
        enableScroll();
        leadersCarousel.scrollTo({
          left: currentIndex * scrollAmount,
          behavior: 'smooth'
        });
        setTimeout(disableScroll, 500);
      }
    });

    scrollRightBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Right scroll clicked, current index:', currentIndex);
      
      if (currentIndex < totalImages - 1) {
        currentIndex++;
        enableScroll();
        leadersCarousel.scrollTo({
          left: currentIndex * scrollAmount,
          behavior: 'smooth'
        });
        setTimeout(disableScroll, 500);
      }
    });

    // Update button states based on current index
    function updateScrollButtons() {
      // Hide left button if at the beginning
      if (currentIndex <= 0) {
        scrollLeftBtn.style.opacity = '0.5';
        scrollLeftBtn.style.pointerEvents = 'none';
      } else {
        scrollLeftBtn.style.opacity = '1';
        scrollLeftBtn.style.pointerEvents = 'auto';
      }
      
      // Hide right button if at the end
      if (currentIndex >= totalImages - 1) {
        scrollRightBtn.style.opacity = '0.5';
        scrollRightBtn.style.pointerEvents = 'none';
      } else {
        scrollRightBtn.style.opacity = '1';
        scrollRightBtn.style.pointerEvents = 'auto';
      }
    }

    // Initial button state
    updateScrollButtons();

    // Update button states after each scroll
    scrollLeftBtn.addEventListener('click', function() {
      setTimeout(updateScrollButtons, 100);
    });

    scrollRightBtn.addEventListener('click', function() {
      setTimeout(updateScrollButtons, 100);
    });
  }
});

// JIC Family Carousel Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollLeftBtn = document.getElementById('scrollLeftFamily');
  const scrollRightBtn = document.getElementById('scrollRightFamily');
  const familyCarousel = document.getElementById('familyCarousel');

  console.log('Family carousel elements found:', {
    scrollLeftBtn: !!scrollLeftBtn,
    scrollRightBtn: !!scrollRightBtn,
    familyCarousel: !!familyCarousel
  });

  if (scrollLeftBtn && scrollRightBtn && familyCarousel) {
    let currentIndex = 0;
    const images = familyCarousel.querySelectorAll('img');
    const totalImages = images.length;
    const imageWidth = 530; // Fixed image width
    const gap = 20; // Gap between images
    const scrollAmount = imageWidth + gap;

    // Temporarily enable scrolling for programmatic control
    function enableScroll() {
      familyCarousel.style.overflowX = 'auto';
    }

    function disableScroll() {
      familyCarousel.style.overflowX = 'hidden';
    }

    scrollLeftBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Family left scroll clicked, current index:', currentIndex);
      
      if (currentIndex > 0) {
        currentIndex--;
        enableScroll();
        familyCarousel.scrollTo({
          left: currentIndex * scrollAmount,
          behavior: 'smooth'
        });
        setTimeout(disableScroll, 500);
      }
    });

    scrollRightBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Family right scroll clicked, current index:', currentIndex);
      
      if (currentIndex < totalImages - 1) {
        currentIndex++;
        enableScroll();
        familyCarousel.scrollTo({
          left: currentIndex * scrollAmount,
          behavior: 'smooth'
        });
        setTimeout(disableScroll, 500);
      }
    });

    // Update button states based on current index
    function updateScrollButtons() {
      // Hide left button if at the beginning
      if (currentIndex <= 0) {
        scrollLeftBtn.style.opacity = '0.5';
        scrollLeftBtn.style.pointerEvents = 'none';
      } else {
        scrollLeftBtn.style.opacity = '1';
        scrollLeftBtn.style.pointerEvents = 'auto';
      }
      
      // Hide right button if at the end
      if (currentIndex >= totalImages - 1) {
        scrollRightBtn.style.opacity = '0.5';
        scrollRightBtn.style.pointerEvents = 'none';
      } else {
        scrollRightBtn.style.opacity = '1';
        scrollRightBtn.style.pointerEvents = 'auto';
      }
    }

    // Initial button state
    updateScrollButtons();

    // Update button states after each scroll
    scrollLeftBtn.addEventListener('click', function() {
      setTimeout(updateScrollButtons, 100);
    });

    scrollRightBtn.addEventListener('click', function() {
      setTimeout(updateScrollButtons, 100);
    });
  }
});
