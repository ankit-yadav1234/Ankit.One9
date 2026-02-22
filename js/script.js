/**
 * RENDER PROJECTS
 * Dynamically creates HTML for project cards
 */
function renderProjects() {
      const container = document.querySelector(".projects-container");
      if (!container) return;

      const projectsHtml = Object.entries(PROJECT_DATA).map(([key, project]) => {
            const descClass = project.tags.length > 4 ? "desc-3-lines" : "desc-4-lines";
            return `
    <div class="project-card">
      <div class="project-img">
        <img src="${project.img}" alt="${project.title}" />
      </div>
      <div class="project-info">
        <div class="project-title-row">
          <h3>${project.title}</h3>
          <span class="live-badge" onclick="openProjectModal('${key}')">LIVE <span class="live-dot">🔴</span></span>
        </div>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p class="${descClass}">${project.shortDesc}</p>
        <button class="show-more-btn" onclick="openProjectModal('${key}')">
          Show More
        </button>
      </div>
    </div>
  `}).join('');

      container.innerHTML = projectsHtml;
}

/**
 * Component Loader Logic
 * Fetches HTML files from the sections/ folder and injects them into placeholders.
 */
async function loadComponent(id, url) {
      try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const html = await response.text();
            const element = document.getElementById(id);
            if (element) {
                  element.innerHTML = html;
                  return true;
            }
      } catch (error) {
            console.error("Error loading component:", error);
      }
      return false;
}

/**
 * Initialize all site logic after components are loaded
 */
async function initSite() {
      const components = [
            { id: "header-placeholder", url: "sections/header.html" },
            { id: "hero-placeholder", url: "sections/hero.html" },
            { id: "about-placeholder", url: "sections/about.html" },
            { id: "experience-placeholder", url: "sections/experience.html" },
            { id: "skills-placeholder", url: "sections/skills.html" },
            { id: "services-placeholder", url: "sections/services.html" },
            { id: "projects-placeholder", url: "sections/projects.html" },
            { id: "modal-placeholder", url: "sections/modal.html" },
            { id: "education-placeholder", url: "sections/education.html" },
            { id: "contact-placeholder", url: "sections/contact.html" },
      ];

      // Load all components in parallel
      await Promise.all(components.map((c) => loadComponent(c.id, c.url)));

      // Render dynamic content before initializing interactions
      renderProjects();
      // Initialize all interactive features
      initializeInteractions();
}

/**
 * GLOBAL FUNCTIONS (Called from HTML onclick attributes)
 */

window.opentab = function (tabname, event) {
      const tablinks = document.getElementsByClassName("tab-links");
      const tabcontents = document.getElementsByClassName("tab-contents");
      for (let tablink of tablinks) {
            tablink.classList.remove("active-link");
      }
      for (let tabcontent of tabcontents) {
            tabcontent.classList.remove("active-tab");
      }
      event.currentTarget.classList.add("active-link");
      document.getElementById(tabname).classList.add("active-tab");
};

window.openmenu = function () {
      const sidemenu = document.getElementById("sidemenu");
      if (sidemenu) sidemenu.classList.add("menu-open");
};

window.closemenu = function () {
      const sidemenu = document.getElementById("sidemenu");
      if (sidemenu) sidemenu.classList.remove("menu-open");
};

window.openProjectModal = function (projectId) {
      const data = PROJECT_DATA[projectId];
      if (!data) return;

      const modal = document.getElementById("project-modal");
      document.getElementById("modal-title").innerText = data.title;
      document.getElementById("modal-img").src = data.img;
      document.getElementById("modal-desc").innerText = data.desc;

      const tagsContainer = document.getElementById("modal-tags");
      tagsContainer.innerHTML = "";
      data.tags.forEach((tag) => {
            const span = document.createElement("span");
            span.className = "tag";
            span.innerText = tag;
            tagsContainer.appendChild(span);
      });

      document.getElementById("modal-code-link").href = data.code;
      document.getElementById("modal-live-link").href = data.live;
      if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
      }
};

window.closeProjectModal = function () {
      const modal = document.getElementById("project-modal");
      if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
      }
};

/**
 * INTERACTIVE LOGIC (Carousels, Typewriter, Observers)
 */
function initializeInteractions() {
      // Typewriter effect logic
      const typedTextSpan = document.getElementById("type-text");
      if (typedTextSpan) {
            const toType = ["Fullstack Developer", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Android Developer"];
            const typingSpeed = 100;
            const erasingSpeed = 50;
            const newTextDelay = 1000;
            let textArrayIndex = 0;
            let charIndex = 0;

            function type() {
                  if (charIndex < toType[textArrayIndex].length) {
                        typedTextSpan.textContent += toType[textArrayIndex].charAt(charIndex);
                        charIndex++;
                        setTimeout(type, typingSpeed);
                  } else {
                        setTimeout(erase, newTextDelay);
                  }
            }

            function erase() {
                  if (charIndex > 0) {
                        typedTextSpan.textContent = toType[textArrayIndex].substring(0, charIndex - 1);
                        charIndex--;
                        setTimeout(erase, erasingSpeed);
                  } else {
                        textArrayIndex++;
                        if (textArrayIndex >= toType.length) textArrayIndex = 0;
                        setTimeout(type, typingSpeed + 1100);
                  }
            }
            setTimeout(type, newTextDelay + 250);
      }

      // Contact Form Submission
      const scriptURL = "https://script.google.com/macros/s/AKfycbw28vvDrsSf8VR6bNrK5QRe16S3I6a5oL5elHANmkqNXry3VPyS-U-OktJllZTyBJkA/exec";
      const form = document.forms["submit-to-google-sheet"];
      const msg = document.getElementById("msg");

      if (form) {
            form.addEventListener("submit", (e) => {
                  e.preventDefault();
                  const submitBtn = form.querySelector(".send-btn");
                  const originalBtnText = submitBtn.innerHTML;
                  submitBtn.disabled = true;
                  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

                  fetch(scriptURL, { method: "POST", body: new FormData(form) })
                        .then((response) => {
                              msg.innerHTML = "Message sent successfully!";
                              setTimeout(() => (msg.innerHTML = ""), 5000);
                              form.reset();
                        })
                        .catch((error) => {
                              msg.innerHTML = "Error sending message.";
                              console.error("Error!", error.message);
                        })
                        .finally(() => {
                              submitBtn.disabled = false;
                              submitBtn.innerHTML = originalBtnText;
                        });
            });
      }

      // Projects Carousel Logic
      const projectsContainer = document.querySelector(".projects-container");
      const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");

      if (projectsContainer) {
            const originalCards = Array.from(projectsContainer.children);
            originalCards.forEach((card) => {
                  const clone = card.cloneNode(true);
                  projectsContainer.appendChild(clone);
            });

            let scrollAmount = 0;
            let autoplayInterval;

            const getScrollParams = () => {
                  const card = projectsContainer.firstElementChild;
                  if (!card) return { cardWidth: 0, totalWidth: 0 };
                  // Using getBoundingClientRect for more precision with decimals/gaps
                  const cardWidth = card.getBoundingClientRect().width + 30;
                  return { cardWidth, totalWidth: cardWidth * originalCards.length };
            };

            const scrollNext = () => {
                  const { cardWidth, totalWidth } = getScrollParams();
                  if (cardWidth === 0) return;

                  scrollAmount += cardWidth;
                  projectsContainer.style.transition = "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
                  projectsContainer.style.transform = `translateX(-${scrollAmount}px)`;

                  if (scrollAmount >= totalWidth) {
                        setTimeout(() => {
                              projectsContainer.style.transition = "none";
                              scrollAmount = 0;
                              projectsContainer.style.transform = `translateX(0)`;
                        }, 500); // Wait for transition to finish
                  }
            };

            const scrollPrev = () => {
                  const { cardWidth, totalWidth } = getScrollParams();
                  if (cardWidth === 0) return;

                  if (scrollAmount <= 0) {
                        projectsContainer.style.transition = "none";
                        scrollAmount = totalWidth;
                        projectsContainer.style.transform = `translateX(-${scrollAmount}px)`;
                        projectsContainer.offsetHeight; // force reflow
                  }

                  setTimeout(() => {
                        scrollAmount -= cardWidth;
                        projectsContainer.style.transition = "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
                        projectsContainer.style.transform = `translateX(-${scrollAmount}px)`;
                  }, 10);
            };

            if (nextBtn) nextBtn.addEventListener("click", () => { stopAutoplay(); scrollNext(); startAutoplay(); });
            if (prevBtn) prevBtn.addEventListener("click", () => { stopAutoplay(); scrollPrev(); startAutoplay(); });

            const startAutoplay = () => {
                  stopAutoplay();
                  autoplayInterval = setInterval(scrollNext, 3000);
            };
            const stopAutoplay = () => { clearInterval(autoplayInterval); };

            startAutoplay();
            window.addEventListener("resize", () => {
                  stopAutoplay();
                  projectsContainer.style.transition = "none";
                  scrollAmount = 0;
                  projectsContainer.style.transform = `translateX(0)`;
                  startAutoplay();
            });
      }

      // Education Carousel logic
      const eduTrack = document.getElementById("edu-carousel-track");
      const eduDotsContainer = document.getElementById("edu-carousel-dots");
      if (eduTrack) {
            const originalEduSlides = Array.from(eduTrack.children);
            let eduCurrentIndex = 1;
            let eduIsTransitioning = false;

            const firstClone = originalEduSlides[0].cloneNode(true);
            const lastClone = originalEduSlides[originalEduSlides.length - 1].cloneNode(true);
            eduTrack.appendChild(firstClone);
            eduTrack.insertBefore(lastClone, originalEduSlides[0]);

            const eduSlides = Array.from(eduTrack.children);
            eduTrack.style.transition = "none";
            eduTrack.style.transform = `translateX(-100%)`;

            originalEduSlides.forEach((_, idx) => {
                  const dot = document.createElement("div");
                  dot.classList.add("dot-indicator");
                  if (idx === 0) dot.classList.add("active");
                  dot.addEventListener("click", () => {
                        if (eduIsTransitioning) return;
                        eduCurrentIndex = idx + 1;
                        updateEduCarousel();
                        resetEduAutoplay();
                  });
                  if (eduDotsContainer) eduDotsContainer.appendChild(dot);
            });

            const eduDots = Array.from(eduDotsContainer.children);

            function updateEduCarousel(animate = true) {
                  if (!animate) eduTrack.style.transition = "none";
                  else {
                        eduIsTransitioning = true;
                        eduTrack.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
                  }
                  eduTrack.style.transform = `translateX(-${eduCurrentIndex * 100}%)`;
                  let dotIndex = eduCurrentIndex - 1;
                  if (eduCurrentIndex === 0) dotIndex = originalEduSlides.length - 1;
                  if (eduCurrentIndex === eduSlides.length - 1) dotIndex = 0;
                  eduDots.forEach((dot, idx) => dot.classList.toggle("active", idx === dotIndex));
            }

            eduTrack.addEventListener("transitionend", () => {
                  eduIsTransitioning = false;
                  if (eduCurrentIndex === 0) { eduCurrentIndex = eduSlides.length - 2; updateEduCarousel(false); }
                  else if (eduCurrentIndex === eduSlides.length - 1) { eduCurrentIndex = 1; updateEduCarousel(false); }
            });

            const nextEduSlide = () => { if (!eduIsTransitioning) { eduCurrentIndex++; updateEduCarousel(); } };
            const prevEduSlide = () => { if (!eduIsTransitioning) { eduCurrentIndex--; updateEduCarousel(); } };

            document.getElementById("edu-next-btn").addEventListener("click", () => { nextEduSlide(); resetEduAutoplay(); });
            document.getElementById("edu-prev-btn").addEventListener("click", () => { prevEduSlide(); resetEduAutoplay(); });

            let eduAutoplayInterval = setInterval(nextEduSlide, 3500);
            const resetEduAutoplay = () => { clearInterval(eduAutoplayInterval); eduAutoplayInterval = setInterval(nextEduSlide, 3500); };
      }

      // --- Contact Form Direction-Aware 180° Flip + Slide ---
      (function () {
            const formCard = document.querySelector(".contact-form-col .contact-card");
            const contactSection = document.getElementById("contact");
            if (!formCard || !contactSection) return;

            let scrollDir = "down";
            let lastScrollY = window.scrollY;
            let hasPlayedDown = false;
            let hasPlayedUp = false;

            window.addEventListener("scroll", () => {
                  scrollDir = window.scrollY > lastScrollY ? "down" : "up";
                  lastScrollY = window.scrollY;
            }, { passive: true });

            function playAnim(startClass) {
                  formCard.classList.remove("anim-visible", "hidden-from-right", "hidden-from-left");
                  formCard.style.transition = "none";
                  formCard.classList.add(startClass);
                  formCard.offsetHeight; // Force reflow
                  formCard.style.transition = "";

                  requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                              formCard.classList.add("anim-visible");
                        });
                  });
            }

            const observer = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                              if (scrollDir === "down" && !hasPlayedDown) {
                                    playAnim("hidden-from-right");
                                    hasPlayedDown = true;
                                    hasPlayedUp = false;
                              } else if (scrollDir === "up" && !hasPlayedUp) {
                                    playAnim("hidden-from-left");
                                    hasPlayedUp = true;
                                    hasPlayedDown = false;
                              }
                        } else {
                              hasPlayedDown = false;
                              hasPlayedUp = false;
                              formCard.classList.remove("anim-visible", "hidden-from-right", "hidden-from-left");
                              if (scrollDir === "down") formCard.classList.add("hidden-from-left");
                              else formCard.classList.add("hidden-from-right");
                        }
                  });
            }, { threshold: 0.1 });

            observer.observe(contactSection);
      })();

      // Counter and Skill Bar animations
      const animateCounters = () => {
            document.querySelectorAll(".skill-item").forEach(item => {
                  const counter = item.querySelector(".counter");
                  const progressSpan = item.querySelector(".progress-line span");
                  if (!counter || !progressSpan) return;

                  const target = +counter.getAttribute("data-target");
                  const duration = 2000;
                  const increment = target / (duration / 16);
                  let current = 0;

                  const update = () => {
                        current += increment;
                        if (current < target) {
                              counter.innerText = Math.ceil(current);
                              progressSpan.style.width = current + "%";
                              requestAnimationFrame(update);
                        } else {
                              counter.innerText = target;
                              progressSpan.style.width = target + "%";
                        }
                  };
                  update();
            });

            // Generic counters (stats)
            document.querySelectorAll(".stat-box .counter").forEach(counter => {
                  const target = +counter.getAttribute("data-target");
                  const duration = 2000;
                  const increment = target / (duration / 16);
                  let current = 0;
                  const update = () => {
                        current += increment;
                        if (current < target) {
                              counter.innerText = Math.ceil(current);
                              requestAnimationFrame(update);
                        } else {
                              counter.innerText = target;
                        }
                  };
                  update();
            });
      };

      const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
      }, { threshold: 0.2 });

      const statsContainer = document.querySelector(".stats-container");
      const skillBars = document.querySelector(".skill-bars");
      if (statsContainer) statsObserver.observe(statsContainer);
      if (skillBars) statsObserver.observe(skillBars);
}

// Start everything
document.addEventListener("DOMContentLoaded", initSite);
