/* 
  =========================================
  Nexus Tech Startup Website - Custom JS
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Navigation Bar
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
    // Trigger on page load to check initial position
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    }
  }

  // 2. Back To Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Smooth Scrolling for Navigation Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Animated Counters (Intersection Observer)
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length > 0) {
    const counterOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -50px 0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetValue = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000; // 2 seconds
          const frameDuration = 1000 / 60; // 60fps
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out expo formula
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(targetValue * easeProgress);

            counter.textContent = currentValue + suffix;

            if (frame < totalFrames) {
              requestAnimationFrame(animate);
            } else {
              counter.textContent = targetValue + suffix;
            }
          };

          animate();
          observer.unobserve(counter);
        }
      });
    }, counterOptions);

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // 5. Blog Page: Search and Category Filter
  const blogSearch = document.getElementById('blogSearch');
  const categoryLinks = document.querySelectorAll('.category-list-link, .tag-link');
  const blogCards = document.querySelectorAll('.blog-post-card');
  let activeCategory = 'all';

  if (blogCards.length > 0) {
    
    // Category Filtering function
    const filterBlogPosts = () => {
      const searchQuery = blogSearch ? blogSearch.value.toLowerCase().trim() : '';

      blogCards.forEach(card => {
        const category = card.getAttribute('data-category').toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase().split(',');
        const title = card.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();

        const matchesCategory = (activeCategory === 'all' || category === activeCategory || tags.includes(activeCategory));
        const matchesSearch = (title.includes(searchQuery) || excerpt.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
          card.style.display = 'block';
          // Fade in animation trigger
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    };

    // Listen to Search input
    if (blogSearch) {
      blogSearch.addEventListener('input', filterBlogPosts);
    }

    // Listen to Category and Tag filter clicks
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from previous
        categoryLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to current click
        link.classList.add('active');
        
        activeCategory = link.getAttribute('data-filter').toLowerCase();
        filterBlogPosts();
      });
    });
  }

  // 6. Contact Form client-side validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

    // Helper functions to show success/error state
    const setInvalid = (input, message) => {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      
      let feedback = input.nextElementSibling;
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.appendChild(feedback);
      }
      feedback.textContent = message;
    };

    const setValid = (input) => {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    };

    // Live validation listeners
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length < 2) {
        setInvalid(nameInput, 'Name must be at least 2 characters long.');
      } else {
        setValid(nameInput);
      }
    });

    emailInput.addEventListener('input', () => {
      if (!emailRegex.test(emailInput.value.trim())) {
        setInvalid(emailInput, 'Please enter a valid email address.');
      } else {
        setValid(emailInput);
      }
    });

    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
        setInvalid(phoneInput, 'Please enter a valid phone number or leave blank.');
      } else {
        setValid(phoneInput);
      }
    });

    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim().length < 3) {
        setInvalid(subjectInput, 'Subject must be at least 3 characters.');
      } else {
        setValid(subjectInput);
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length < 10) {
        setInvalid(messageInput, 'Message must be at least 10 characters.');
      } else {
        setValid(messageInput);
      }
    });

    // Form Submit Event
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Final manual validation check before submitting
      if (nameInput.value.trim().length < 2) {
        setInvalid(nameInput, 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        setValid(nameInput);
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        setInvalid(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        setValid(emailInput);
      }

      if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
        setInvalid(phoneInput, 'Please enter a valid phone number.');
        isValid = false;
      } else {
        setValid(phoneInput);
      }

      if (subjectInput.value.trim().length < 3) {
        setInvalid(subjectInput, 'Subject must be at least 3 characters.');
        isValid = false;
      } else {
        setValid(subjectInput);
      }

      if (messageInput.value.trim().length < 10) {
        setInvalid(messageInput, 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        setValid(messageInput);
      }

      if (isValid) {
        // Change submit button state to show submitting status
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;

        // Simulate API call and success popup
        setTimeout(() => {
          // Success Feedback
          const responseContainer = document.getElementById('formResponse');
          if (responseContainer) {
            responseContainer.innerHTML = `
              <div class="alert alert-success alert-dismissible fade show border-glow-class" role="alert" style="background-color: rgba(25, 135, 84, 0.15); color: #2ecc71; border-color: rgba(46, 204, 113, 0.3);">
                <strong>Thank you!</strong> Your message has been sent successfully. We will get back to you shortly.
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            `;
          }

          // Reset Form
          contactForm.reset();
          nameInput.classList.remove('is-valid');
          emailInput.classList.remove('is-valid');
          phoneInput.classList.remove('is-valid');
          subjectInput.classList.remove('is-valid');
          messageInput.classList.remove('is-valid');

          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }, 1500);
      }
    });
  }
});
