/**
 * BLOSSOM DENTAL & IMPLANT STUDIO - MAIN SCRIPT
 * Problem Navigator, Testimonial Carousel, Quiz, Modal & WhatsApp Deep-Linking
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. GOAL / PROBLEM NAVIGATOR TABS ("I'm looking for help with...")
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.goal-tab-btn');
  const tabPanes = document.querySelectorAll('.goal-pane-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 2. DOCTOR SPOTLIGHT SWITCHER & TESTIMONIAL CAROUSEL
  // --------------------------------------------------------------------------
  const doctorCards = document.querySelectorAll('.doctor-spotlight-card');
  const testimonialTexts = [
    {
      quote: "After weeks of unbearable throbbing toothache, Dr. Julian diagnosed an acute pulp infection and performed a single-sitting root canal with zero pain. The Carl Zeiss microscope is pure magic!",
      author: "Marcus Henderson — Financial Analyst",
      doctorTarget: "doc-julian"
    },
    {
      quote: "My gums used to be swollen and bled every time I brushed. Dr. Elena's gentle laser therapy eliminated the inflammation in just two sessions without any cutting or stitches. Remarkable expertise!",
      author: "Charlotte Becker — Creative Director",
      doctorTarget: "doc-elena"
    },
    {
      quote: "I was terrified of root canals from childhood trauma. Dr. Julian made me feel completely relaxed. I literally dozed off during the procedure. Can't recommend Blossom enough!",
      author: "Emily Watson — University Professor",
      doctorTarget: "doc-julian"
    },
    {
      quote: "Aesthetic laser gum contouring with Dr. Elena completely transformed my smile line before my wedding. She is an absolute artist with periodontal care.",
      author: "Sophia & Liam Miller — Architects",
      doctorTarget: "doc-elena"
    }
  ];

  let currentReviewIndex = 0;
  const reviewQuoteEl = document.getElementById('spotlightReviewQuote');
  const reviewAuthorEl = document.getElementById('spotlightReviewAuthor');
  const reviewDots = document.querySelectorAll('.testimonial-dot');

  function updateReview(index) {
    currentReviewIndex = index;
    const review = testimonialTexts[index];
    
    if (reviewQuoteEl && reviewAuthorEl) {
      reviewQuoteEl.style.opacity = '0';
      setTimeout(() => {
        reviewQuoteEl.textContent = '"' + review.quote + '"';
        reviewAuthorEl.textContent = '— ' + review.author;
        reviewQuoteEl.style.opacity = '1';
      }, 150);
    }

    reviewDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    const targetDoc = review.doctorTarget;
    doctorCards.forEach(card => {
      if (card.id === targetDoc) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  reviewDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => updateReview(idx));
  });

  setInterval(() => {
    const nextIdx = (currentReviewIndex + 1) % testimonialTexts.length;
    updateReview(nextIdx);
  }, 7000);

  // --------------------------------------------------------------------------
  // 3. 60-SECOND DENTAL SYMPTOM ASSESSMENT QUIZ
  // --------------------------------------------------------------------------
  const quizStepDots = document.querySelectorAll('.quiz-step-dot');
  const quizQuestionTitle = document.getElementById('quizQuestionTitle');
  const quizQuestionSubtitle = document.getElementById('quizQuestionSubtitle');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');
  const quizResultBox = document.getElementById('quizResultBox');

  let currentQuizStep = 1;
  let userQuizAnswers = {
    symptom: '',
    duration: '',
    specialist: ''
  };

  const step1Options = [
    { id: 'sharp-pain', text: '⚡ Sharp throbbing toothache (worse with hot/cold or at night)', specialist: 'Root Canal Specialist (Dr. Julian Vance)' },
    { id: 'bleeding-gums', text: '🩸 Bleeding, swollen, or tender gums while brushing', specialist: 'Gum & Periodontal Specialist (Dr. Elena Rostova)' },
    { id: 'loose-tooth', text: '🦷 Receding gums, bad breath, or loose tooth sensation', specialist: 'Gum & Periodontal Specialist (Dr. Elena Rostova)' },
    { id: 'broken-tooth', text: '✨ Chipped tooth, old crown fallen, or smile makeover', specialist: 'Restorative Endodontist (Dr. Julian Vance)' }
  ];

  const step2Options = [
    { id: 'few-days', text: '⏱️ Started recently (1–3 days ago)' },
    { id: 'few-weeks', text: '📅 Ongoing for 1–2 weeks' },
    { id: 'chronic', text: '⚠️ Recurring chronic pain for over a month' },
    { id: 'routine', text: '🛡️ Preventive / seeking a second opinion' }
  ];

  function renderQuizStep(step) {
    if (!quizOptionsGrid) return;
    currentQuizStep = step;
    quizStepDots.forEach((dot, i) => dot.classList.toggle('active', i === step - 1));

    if (step === 1) {
      quizQuestionTitle.textContent = 'Step 1 of 2: What is your primary dental concern?';
      quizQuestionSubtitle.textContent = 'Select the symptom that best describes what you are feeling right now:';
      quizOptionsGrid.innerHTML = step1Options.map(opt => `
        <div class="quiz-option-card" data-symptom="${opt.id}" data-spec="${opt.specialist}">
          <span>${opt.text}</span>
        </div>
      `).join('');
      quizResultBox.style.display = 'none';
      quizOptionsGrid.style.display = 'grid';

      document.querySelectorAll('.quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
          userQuizAnswers.symptom = card.getAttribute('data-symptom');
          userQuizAnswers.specialist = card.getAttribute('data-spec');
          card.classList.add('selected');
          setTimeout(() => renderQuizStep(2), 250);
        });
      });
    } else if (step === 2) {
      quizQuestionTitle.textContent = 'Step 2 of 2: How long have you had this symptom?';
      quizQuestionSubtitle.textContent = 'This helps our specialists determine the urgency of your consultation:';
      quizOptionsGrid.innerHTML = step2Options.map(opt => `
        <div class="quiz-option-card" data-duration="${opt.text}">
          <span>${opt.text}</span>
        </div>
      `).join('');

      document.querySelectorAll('.quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
          userQuizAnswers.duration = card.getAttribute('data-duration');
          card.classList.add('selected');
          setTimeout(showQuizResult, 300);
        });
      });
    }
  }

  function showQuizResult() {
    quizStepDots.forEach(dot => dot.classList.add('active'));
    quizQuestionTitle.textContent = '🎯 Your Personalized Dental Assessment Result';
    quizQuestionSubtitle.textContent = 'Based on your symptoms, here is our specialist clinical recommendation:';
    quizOptionsGrid.style.display = 'none';

    const isRootCanal = userQuizAnswers.symptom === 'sharp-pain' || userQuizAnswers.symptom === 'broken-tooth';
    const doctorName = isRootCanal ? 'Dr. Julian Vance (DMD Endodontics)' : 'Dr. Elena Rostova (DDS Periodontics)';
    const treatmentName = isRootCanal ? 'Microscopic Root Canal & Tooth Preservation' : 'Laser Periodontal Gum Therapy & Deep Scaling';
    const doctorImg = isRootCanal ? 'assets/images/dr-julian-vance-endodontist.jpg' : 'assets/images/dr-elena-rostova-periodontist.jpg';

    quizResultBox.innerHTML = `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; margin-bottom: 24px;">
        <img src="${doctorImg}" alt="${doctorName}" style="width: 100px; height: 120px; border-radius: 12px; object-fit: cover; border: 2px solid var(--coral-300);">
        <div style="flex: 1; min-width: 240px;">
          <span class="badge badge-coral" style="margin-bottom: 6px;">Recommended Specialist</span>
          <h3 style="font-size: var(--fs-xl); color: var(--text-heading-dark); margin-bottom: 4px;">${doctorName}</h3>
          <p style="font-size: var(--fs-sm); color: var(--plum-800); font-weight: 600; margin-bottom: 4px;">Recommended Procedure: ${treatmentName}</p>
          <p style="font-size: var(--fs-xs); color: var(--text-muted); margin-bottom: 0;">Reported Timeline: ${userQuizAnswers.duration}</p>
        </div>
      </div>
      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <button class="btn btn-coral" id="quizBookNowBtn">Book Priority Appointment with ${isRootCanal ? 'Dr. Julian' : 'Dr. Elena'} →</button>
        <button class="btn btn-outline-plum" id="quizRetakeBtn">Retake Assessment ↺</button>
      </div>
    `;
    quizResultBox.style.display = 'block';

    document.getElementById('quizBookNowBtn')?.addEventListener('click', () => {
      openAppointmentModal(doctorName, treatmentName);
    });

    document.getElementById('quizRetakeBtn')?.addEventListener('click', () => {
      renderQuizStep(1);
    });
  }

  renderQuizStep(1);

  // --------------------------------------------------------------------------
  // 4. DOCUMENTED CLINICAL TRANSFORMATION CASE STUDY SLIDER
  // --------------------------------------------------------------------------
  const caseTabs = document.querySelectorAll('.case-tab-btn');
  const caseSlides = document.querySelectorAll('.case-study-slide');
  const casePrevBtn = document.getElementById('casePrevBtn');
  const caseNextBtn = document.getElementById('caseNextBtn');
  const caseCounterText = document.getElementById('caseCounterText');
  const caseDots = document.querySelectorAll('.case-dot');

  let currentCaseIndex = 0;

  function setCaseSlide(index) {
    if (!caseSlides.length) return;
    currentCaseIndex = (index + caseSlides.length) % caseSlides.length;

    caseSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentCaseIndex);
    });

    caseTabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === currentCaseIndex);
      tab.setAttribute('aria-selected', idx === currentCaseIndex ? 'true' : 'false');
    });

    caseDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentCaseIndex);
    });

    if (caseCounterText) {
      caseCounterText.textContent = `Case 0${currentCaseIndex + 1} of 0${caseSlides.length}`;
    }
  }

  caseTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => setCaseSlide(idx));
  });

  caseDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => setCaseSlide(idx));
  });

  casePrevBtn?.addEventListener('click', () => setCaseSlide(currentCaseIndex - 1));
  caseNextBtn?.addEventListener('click', () => setCaseSlide(currentCaseIndex + 1));

  // Toggle button inside each case card
  const caseToggleBtns = document.querySelectorAll('.case-card-toggle-btn');
  caseToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => setCaseSlide(currentCaseIndex + 1));
  });

  // Initialize Before/After Draggable Comparison Sliders for each case card
  const comparisonCards = document.querySelectorAll('.case-comparison-card');
  comparisonCards.forEach(card => {
    const beforePane = card.querySelector('.case-image-before');
    const handle = card.querySelector('.case-slider-handle');
    if (!beforePane || !handle) return;

    let isDragging = false;

    const setHandlePosition = (clientX) => {
      const rect = card.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const pct = (offsetX / rect.width) * 100;
      beforePane.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setHandlePosition(e.clientX);
    });

    card.addEventListener('click', (e) => {
      setHandlePosition(e.clientX);
    });

    handle.addEventListener('touchstart', () => {
      isDragging = true;
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      setHandlePosition(e.touches[0].clientX);
    }, { passive: true });
  });

  // --------------------------------------------------------------------------
  // 4B. CLINICAL VIDEO EMBED & ERROR 153 MITIGATION
  // --------------------------------------------------------------------------
  const videoFacade = document.getElementById('videoFacade');
  const videoIframeSlot = document.getElementById('videoIframeSlot');
  const fileProtocolHint = document.getElementById('fileProtocolHint');
  const forceInlineVideoBtn = document.getElementById('forceInlineVideoBtn');

  // Detect local file protocol (file://) where browsers block HTTP Referer headers
  const isFileProtocol = window.location.protocol === 'file:';
  if (isFileProtocol && fileProtocolHint) {
    fileProtocolHint.classList.add('visible');
  }

  const loadInlineVideo = () => {
    if (!videoIframeSlot) return;
    if (videoFacade) {
      videoFacade.style.opacity = '0';
      setTimeout(() => {
        videoFacade.style.display = 'none';
      }, 300);
    }
    videoIframeSlot.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/7w0-4jIOpqQ?autoplay=1&rel=0" 
        title="Essential Dental Instrument Sterilization: Best Practices & Products" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
      </iframe>
    `;
  };

  if (videoFacade) {
    const handleFacadeClick = () => {
      if (isFileProtocol) {
        // Direct open on YouTube guarantees zero Error 153 when double-clicked locally
        window.open('https://youtu.be/7w0-4jIOpqQ?si=wzM5XbSG7d7K8W7u', '_blank', 'noopener,noreferrer');
      } else {
        // On http: / https: / localhost, load inline with strict referrer policy
        loadInlineVideo();
      }
    };

    videoFacade.addEventListener('click', handleFacadeClick);
    videoFacade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFacadeClick();
      }
    });
  }

  if (forceInlineVideoBtn) {
    forceInlineVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadInlineVideo();
    });
  }

  // --------------------------------------------------------------------------
  // 5. FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const isActive = parentItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. APPOINTMENT MODAL & WHATSAPP DEEP-LINK DISPATCH
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('appointmentModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoctorSelect = document.getElementById('modalDoctorSelect');
  const modalServiceSelect = document.getElementById('modalServiceSelect');
  const modalForm = document.getElementById('modalAppointmentForm');

  function openAppointmentModal(prefDoctor, prefService, customTitle) {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const modalTitleEl = document.getElementById('modalTitle');
    if (modalTitleEl) {
      if (customTitle) {
        modalTitleEl.textContent = customTitle;
      } else if (prefDoctor && (prefDoctor.indexOf('Julian') !== -1 || prefDoctor.indexOf('Vance') !== -1)) {
        modalTitleEl.textContent = 'Book with Dr. Julian Vance';
      } else if (prefDoctor && (prefDoctor.indexOf('Elena') !== -1 || prefDoctor.indexOf('Rostova') !== -1)) {
        modalTitleEl.textContent = 'Book with Dr. Elena Rostova';
      } else if (prefService) {
        modalTitleEl.textContent = 'Request Treatment Plan';
      } else {
        modalTitleEl.textContent = 'Schedule Your Consultation';
      }
    }

    if (modalDoctorSelect && prefDoctor) {
      modalDoctorSelect.value = (prefDoctor.indexOf('Julian') !== -1 || prefDoctor.indexOf('Vance') !== -1 || prefDoctor.indexOf('Root') !== -1) ? 'Dr. Julian Vance (Root Canal)' : 'Dr. Elena Rostova (Gum Care)';
    }
    if (modalServiceSelect && prefService) {
      // Find matching option or default
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        const optVal = modalServiceSelect.options[i].value.toLowerCase();
        const searchVal = prefService.toLowerCase();
        if (optVal.includes(searchVal) || searchVal.includes(optVal) || (searchVal.includes('root') && optVal.includes('root')) || (searchVal.includes('gum') && optVal.includes('gum'))) {
          modalServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function closeAppointmentModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeAppointmentModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeAppointmentModal();
  });

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const doc = trigger.getAttribute('data-doc') || '';
      const svc = trigger.getAttribute('data-service') || '';
      const title = trigger.getAttribute('data-modal-title') || '';
      openAppointmentModal(doc, svc, title);
    });
  });

  const heroBookingForm = document.getElementById('heroBookingForm');
  heroBookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('heroPatientName')?.value.trim() || 'Patient';
    const phone = document.getElementById('heroPatientPhone')?.value.trim() || '';
    const service = document.getElementById('heroServiceSelect')?.value || 'Root Canal / Gum Consultation';
    const date = document.getElementById('heroDateInput')?.value || 'Earliest available slot';

    dispatchWhatsAppBooking(name, phone, service, date);
  });

  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('modalPatientName')?.value.trim() || 'Patient';
    const phone = document.getElementById('modalPatientPhone')?.value.trim() || '';
    const service = document.getElementById('modalServiceSelect')?.value || 'Dental Consultation';
    const doctor = document.getElementById('modalDoctorSelect')?.value || 'Chief Dental Specialist';
    const date = document.getElementById('modalDateInput')?.value || 'Earliest available slot';

    dispatchWhatsAppBooking(name, phone, service + ' with ' + doctor, date);
    closeAppointmentModal();
  });

  function dispatchWhatsAppBooking(name, phone, service, date) {
    const clinicWhatsApp = '919820012345';
    const message = encodeURIComponent(
      'Hello Blossom Dental Studio, I would like to request an appointment:\n\n' +
      '• Patient Name: ' + name + '\n' +
      '• Contact Number: ' + phone + '\n' +
      '• Treatment / Specialist: ' + service + '\n' +
      '• Preferred Date: ' + date + '\n\n' +
      'Please confirm the available consultation slot.'
    );

    window.open('https://wa.me/' + clinicWhatsApp + '?text=' + message, '_blank');
  }

  // --------------------------------------------------------------------------
  // 6B. IN-PAGE BLOG READER MODAL
  // --------------------------------------------------------------------------
  const blogReaderModal = document.getElementById('blogReaderModal');
  const openBlogReaderLink = document.getElementById('openBlogReaderLink');
  const openBlogModalBtn = document.getElementById('openBlogModalBtn');
  const blogReaderCloseBtn = document.getElementById('blogReaderCloseBtn');
  const blogReaderDoneBtn = document.getElementById('blogReaderDoneBtn');

  function openBlogReader(e) {
    if (e) e.preventDefault();
    if (blogReaderModal) {
      blogReaderModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBlogReader() {
    if (blogReaderModal) {
      blogReaderModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openBlogReaderLink?.addEventListener('click', openBlogReader);
  openBlogModalBtn?.addEventListener('click', openBlogReader);
  blogReaderCloseBtn?.addEventListener('click', closeBlogReader);
  blogReaderDoneBtn?.addEventListener('click', closeBlogReader);
  blogReaderModal?.addEventListener('click', (e) => {
    if (e.target === blogReaderModal) closeBlogReader();
  });

  // --------------------------------------------------------------------------
  // 7. MOBILE HAMBURGER MENU TOGGLE
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('is-active');
    const expanded = navMenu?.classList.contains('is-active');
    mobileToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('is-active');
    });
  });
});
