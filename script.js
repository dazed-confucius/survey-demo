/**
 * SURVEY INTERFACE PREVIEW - CLINICAL REDESIGN SCRIPT.JS
 * Plain Vanilla JavaScript implementation.
 * Zero external libraries, zero build steps, zero backend dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initCombobox();
  initSkipLogicSurvey();
  initSittingsTimeline();
});

/* ==========================================================================
   STICKY NAV OBSERVER
   ========================================================================== */

function initStickyNav() {
  const sections = document.querySelectorAll('.demo-section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   SECTION 1: SEARCHABLE DROPDOWN WITH BOLD MATCHES & AUTO-TYPE DEMO
   ========================================================================== */

function initCombobox() {
  const inputEl = document.getElementById('combobox-input');
  const listEl = document.getElementById('combobox-list');
  const clearBtn = document.getElementById('combobox-clear-btn');
  const statusEl = document.getElementById('combobox-status');
  const resultDisplay = document.getElementById('selected-answer-display');
  const resultText = document.getElementById('selected-answer-text');
  const autoTypeBtn = document.getElementById('auto-type-btn');

  if (!inputEl || !listEl) return;

  // Generate ~40 placeholder options (Answer A ... Answer AN)
  const optionsData = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < 26; i++) {
    optionsData.push(`Answer ${alphabet[i]}`);
  }
  for (let i = 0; i < 14; i++) {
    optionsData.push(`Answer A${alphabet[i]}`);
  }

  let filteredOptions = [...optionsData];
  let activeIndex = -1;
  let selectedValue = '';
  let autoTypeTimer = null;

  function renderOptions(query = '') {
    listEl.innerHTML = '';
    
    if (filteredOptions.length === 0) {
      const noMatchLi = document.createElement('li');
      noMatchLi.className = 'combobox-option no-matches';
      noMatchLi.setAttribute('role', 'option');
      noMatchLi.textContent = 'No matching answers found';
      listEl.appendChild(noMatchLi);
      updateStatus('No matching answers found.');
      return;
    }

    filteredOptions.forEach((optText, index) => {
      const li = document.createElement('li');
      li.id = `combobox-option-${index}`;
      li.className = 'combobox-option';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', optText === selectedValue ? 'true' : 'false');
      li.dataset.value = optText;

      // Highlight matching query substring in bold
      if (query.trim() !== '') {
        const lowerOpt = optText.toLowerCase();
        const lowerQuery = query.trim().toLowerCase();
        const matchPos = lowerOpt.indexOf(lowerQuery);
        
        if (matchPos !== -1) {
          const before = optText.substring(0, matchPos);
          const matchText = optText.substring(matchPos, matchPos + lowerQuery.length);
          const after = optText.substring(matchPos + lowerQuery.length);
          li.innerHTML = `${before}<strong>${matchText}</strong>${after}`;
        } else {
          li.textContent = optText;
        }
      } else {
        li.textContent = optText;
      }

      if (optText === selectedValue) {
        li.classList.add('is-selected');
      }

      if (index === activeIndex) {
        li.classList.add('is-active');
        inputEl.setAttribute('aria-activedescendant', li.id);
      }

      li.addEventListener('click', () => {
        selectOption(optText);
      });

      li.addEventListener('mouseenter', () => {
        setActiveIndex(index);
      });

      listEl.appendChild(li);
    });

    updateStatus(`${filteredOptions.length} option${filteredOptions.length === 1 ? '' : 's'} available.`);
  }

  function openList() {
    listEl.hidden = false;
    inputEl.setAttribute('aria-expanded', 'true');
    renderOptions(inputEl.value);
  }

  function closeList() {
    listEl.hidden = true;
    inputEl.setAttribute('aria-expanded', 'false');
    inputEl.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  function setActiveIndex(index) {
    activeIndex = index;
    const optionEls = listEl.querySelectorAll('.combobox-option:not(.no-matches)');
    optionEls.forEach((el, i) => {
      if (i === activeIndex) {
        el.classList.add('is-active');
        inputEl.setAttribute('aria-activedescendant', el.id);
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('is-active');
      }
    });
  }

  function selectOption(value) {
    selectedValue = value;
    inputEl.value = value;
    clearBtn.hidden = false;
    
    resultText.textContent = value;
    resultDisplay.hidden = false;

    closeList();
    updateStatus(`Selected answer: ${value}`);
  }

  function updateStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function handleInput() {
    const query = inputEl.value.trim().toLowerCase();
    if (query === '') {
      filteredOptions = [...optionsData];
    } else {
      filteredOptions = optionsData.filter(opt => opt.toLowerCase().includes(query));
    }
    
    activeIndex = filteredOptions.length > 0 ? 0 : -1;
    openList();
    clearBtn.hidden = inputEl.value === '';
  }

  // Event Listeners
  inputEl.addEventListener('focus', () => {
    handleInput();
  });

  inputEl.addEventListener('input', () => {
    handleInput();
  });

  inputEl.addEventListener('keydown', (e) => {
    const isExpanded = inputEl.getAttribute('aria-expanded') === 'true';

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isExpanded) {
          openList();
        } else if (filteredOptions.length > 0) {
          const nextIndex = (activeIndex + 1) % filteredOptions.length;
          setActiveIndex(nextIndex);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isExpanded) {
          openList();
        } else if (filteredOptions.length > 0) {
          const prevIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
          setActiveIndex(prevIndex);
        }
        break;

      case 'Enter':
        if (isExpanded && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          e.preventDefault();
          selectOption(filteredOptions[activeIndex]);
        }
        break;

      case 'Escape':
        if (isExpanded) {
          e.preventDefault();
          closeList();
        }
        break;

      case 'Tab':
        if (isExpanded) {
          closeList();
        }
        break;

      case 'Home':
        if (isExpanded && filteredOptions.length > 0) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;

      case 'End':
        if (isExpanded && filteredOptions.length > 0) {
          e.preventDefault();
          setActiveIndex(filteredOptions.length - 1);
        }
        break;
    }
  });

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    selectedValue = '';
    clearBtn.hidden = true;
    resultDisplay.hidden = true;
    filteredOptions = [...optionsData];
    inputEl.focus();
    openList();
  });

  // Auto-Type Demo Button Handler
  if (autoTypeBtn) {
    autoTypeBtn.addEventListener('click', () => {
      if (autoTypeTimer) clearInterval(autoTypeTimer);
      
      inputEl.value = '';
      selectedValue = '';
      clearBtn.hidden = true;
      resultDisplay.hidden = true;
      inputEl.focus();

      const textToType = 'Answer C';
      let charIndex = 0;

      autoTypeTimer = setInterval(() => {
        if (charIndex < textToType.length) {
          inputEl.value += textToType.charAt(charIndex);
          handleInput();
          charIndex++;
        } else {
          clearInterval(autoTypeTimer);
        }
      }, 150);
    });
  }

  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !listEl.contains(e.target) && !clearBtn.contains(e.target) && !autoTypeBtn.contains(e.target)) {
      closeList();
    }
  });
}

/* ==========================================================================
   SECTION 2: AUTOMATIC SKIP LOGIC & SHORTCUT AUTO-PLAY DEMOS
   ========================================================================== */

function initSkipLogicSurvey() {
  const surveyContainer = document.getElementById('skip-survey-container');
  const backBtn = document.getElementById('survey-back-btn');
  const nextBtn = document.getElementById('survey-next-btn');
  const restartBtn = document.getElementById('survey-restart-btn');

  const autoplayProfABtn = document.getElementById('autoplay-prof-a');
  const autoplayProfBBtn = document.getElementById('autoplay-prof-b');

  const stepCounterEl = document.getElementById('widget-step-counter');
  const percentEl = document.getElementById('widget-progress-percent');
  const progressBarEl = document.getElementById('widget-progress-bar');
  const flowStatusText = document.getElementById('flow-status-text');

  if (!surveyContainer) return;

  const SURVEY_DATA = {
    q2: {
      id: 'q2',
      number: 'Demo Question 2 of 4',
      title: 'Which profession category applies to you?',
      subtitle: 'Selecting Profession B will automatically skip Demo Question 3.',
      stepIndex: '1 of 3',
      progressPercent: 33,
      options: [
        { label: 'Profession A (Standard path including Q3)', value: 'profession_a', next: 'q3' },
        { label: 'Profession B (Skips Demo Question 3 directly to Q4)', value: 'profession_b', next: 'q4' }
      ]
    },
    q3: {
      id: 'q3',
      number: 'Demo Question 3 of 4',
      title: 'Specialized Demographic Question (Only for Profession A)',
      subtitle: 'This question is automatically hidden when Profession B is selected.',
      stepIndex: '2 of 3',
      progressPercent: 66,
      options: [
        { label: 'Specialized Answer A-1', value: 'answer_a1', next: 'q4' },
        { label: 'Specialized Answer A-2', value: 'answer_a2', next: 'q4' }
      ]
    },
    q4: {
      id: 'q4',
      number: 'Demo Question 4 of 4',
      title: 'General Feedback Question (Relevant for All Respondents)',
      subtitle: 'Both Profession A and Profession B paths converge here.',
      stepIndex: '3 of 3',
      progressPercent: 90,
      options: [
        { label: 'General Answer 1', value: 'gen_1', next: 'end' },
        { label: 'General Answer 2', value: 'gen_2', next: 'end' }
      ]
    },
    end: {
      id: 'end',
      number: 'Demo Complete',
      title: 'End of Mini-Survey Flow',
      subtitle: 'You have experienced automatic skip-logic routing.',
      stepIndex: 'Complete',
      progressPercent: 100
    }
  };

  let currentQuestionId = 'q2';
  let historyStack = ['q2'];
  let userAnswers = {};
  let autoplayTimeouts = [];

  function clearAutoplayTimers() {
    autoplayTimeouts.forEach(t => clearTimeout(t));
    autoplayTimeouts = [];
  }

  function renderCurrentStep() {
    const qData = SURVEY_DATA[currentQuestionId];
    surveyContainer.innerHTML = '';

    if (stepCounterEl) stepCounterEl.textContent = qData.stepIndex === 'Complete' ? 'Complete' : `Question ${qData.stepIndex}`;
    if (percentEl) percentEl.textContent = `${qData.progressPercent}% Complete`;
    if (progressBarEl) progressBarEl.style.width = `${qData.progressPercent}%`;

    if (currentQuestionId === 'end') {
      renderEndScreen();
      backBtn.disabled = false;
      nextBtn.disabled = true;
      nextBtn.textContent = 'Completed';
    } else {
      renderQuestionCard(qData);
      backBtn.disabled = historyStack.length <= 1;
      nextBtn.disabled = !userAnswers[currentQuestionId];
      nextBtn.textContent = 'Next →';
    }

    updateDiagramState();
  }

  function renderQuestionCard(qData) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'question-card-anim';

    const qNumber = document.createElement('span');
    qNumber.className = 'question-badge';
    qNumber.textContent = qData.number;

    const qTitle = document.createElement('h3');
    qTitle.className = 'question-text';
    qTitle.textContent = qData.title;

    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'radio-options-group';
    optionsGroup.setAttribute('role', 'radiogroup');
    optionsGroup.setAttribute('aria-label', qData.title);

    qData.options.forEach((opt) => {
      const radioCard = document.createElement('label');
      radioCard.className = 'radio-card';
      if (userAnswers[qData.id] === opt.value) {
        radioCard.classList.add('is-selected');
      }

      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = `survey-opt-${qData.id}`;
      radioInput.value = opt.value;
      radioInput.checked = userAnswers[qData.id] === opt.value;

      radioInput.addEventListener('change', () => {
        clearAutoplayTimers();
        userAnswers[qData.id] = opt.value;
        
        const allCards = optionsGroup.querySelectorAll('.radio-card');
        allCards.forEach(c => c.classList.remove('is-selected'));
        radioCard.classList.add('is-selected');

        nextBtn.disabled = false;
        updateDiagramState();
      });

      const labelText = document.createElement('span');
      labelText.className = 'radio-card-label';
      labelText.textContent = opt.label;

      radioCard.appendChild(radioInput);
      radioCard.appendChild(labelText);
      optionsGroup.appendChild(radioCard);
    });

    cardDiv.appendChild(qNumber);
    cardDiv.appendChild(qTitle);
    cardDiv.appendChild(optionsGroup);

    surveyContainer.appendChild(cardDiv);
  }

  function renderEndScreen() {
    const endDiv = document.createElement('div');
    endDiv.className = 'question-card-anim';
    endDiv.style.textAlign = 'center';

    const isProfB = userAnswers['q2'] === 'profession_b';

    endDiv.innerHTML = `
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;" aria-hidden="true">🎉</div>
      <h3 class="question-text" style="margin-bottom: 0.5rem;">Mini-Survey Flow Complete</h3>
      <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 500px; margin: 0 auto;">
        ${isProfB 
          ? 'You selected <strong>Profession B</strong>, so <strong>Demo Question 3 was automatically skipped</strong>. Path taken: Q2 &rarr; Q4 &rarr; End.' 
          : 'You selected <strong>Profession A</strong>, so you answered all questions. Path taken: Q2 &rarr; Q3 &rarr; Q4 &rarr; End.'}
      </p>
    `;

    surveyContainer.appendChild(endDiv);
  }

  function updateDiagramState() {
    const isProfB = userAnswers['q2'] === 'profession_b';

    const nodeQ2 = document.getElementById('node-q2');
    const nodeQ3 = document.getElementById('node-q3');
    const nodeQ4 = document.getElementById('node-q4');
    const nodeEnd = document.getElementById('node-end');

    const checkQ2 = document.getElementById('check-q2');
    const checkQ3 = document.getElementById('check-q3');
    const checkQ4 = document.getElementById('check-q4');
    const checkEnd = document.getElementById('check-end');

    const pathQ2Q3 = document.getElementById('path-q2-q3');
    const pathQ2Q4Bypass = document.getElementById('path-q2-q4-bypass');
    const pathQ3Q4 = document.getElementById('path-q3-q4');
    const pathQ4End = document.getElementById('path-q4-end');

    // Reset Diagram Node Classes & Checks
    [nodeQ2, nodeQ3, nodeQ4, nodeEnd].forEach(node => {
      if (node) node.className = 'diagram-node';
    });
    [checkQ2, checkQ3, checkQ4, checkEnd].forEach(chk => {
      if (chk) chk.hidden = true;
    });

    // Reset Flow Lines
    [pathQ2Q3, pathQ2Q4Bypass, pathQ3Q4, pathQ4End].forEach(line => {
      if (line) line.className.baseVal = 'flow-line';
    });

    // Visited history nodes & checkmarks
    historyStack.forEach(qId => {
      const map = { q2: nodeQ2, q3: nodeQ3, q4: nodeQ4, end: nodeEnd };
      const chkMap = { q2: checkQ2, q3: checkQ3, q4: checkQ4, end: checkEnd };
      if (map[qId]) map[qId].classList.add('is-visited');
      if (chkMap[qId] && userAnswers[qId]) chkMap[qId].hidden = false;
    });

    if (historyStack.includes('end') && checkEnd) checkEnd.hidden = false;

    // Q3 Skipped state
    if (isProfB && nodeQ3) {
      nodeQ3.classList.remove('is-visited');
      nodeQ3.classList.add('is-skipped');
      if (checkQ3) checkQ3.hidden = true;
      if (pathQ2Q3) pathQ2Q3.classList.add('is-skipped');
      if (pathQ3Q4) pathQ3Q4.classList.add('is-skipped');
    }

    // Active Node Highlight
    const activeMap = { q2: nodeQ2, q3: nodeQ3, q4: nodeQ4, end: nodeEnd };
    if (activeMap[currentQuestionId]) {
      activeMap[currentQuestionId].classList.remove('is-visited');
      activeMap[currentQuestionId].classList.add('is-active');
    }

    // Active Connector Lines
    if (userAnswers['q2'] === 'profession_a') {
      if (pathQ2Q3) pathQ2Q3.classList.add('is-active');
      if (historyStack.includes('q4')) if (pathQ3Q4) pathQ3Q4.classList.add('is-active');
    } else if (isProfB) {
      if (pathQ2Q4Bypass) pathQ2Q4Bypass.classList.add('is-active');
    }

    if (historyStack.includes('end') && pathQ4End) {
      pathQ4End.classList.add('is-active');
    }

    // Flow Status Footer
    if (flowStatusText) {
      const statusMap = {
        q2: 'Active Step: <strong>Demo Question 2</strong> (Branch Decision Point)',
        q3: 'Active Step: <strong>Demo Question 3</strong> (Standard Profession A Path)',
        q4: 'Active Step: <strong>Demo Question 4</strong> (Branch Paths Converge)',
        end: 'Status: <strong>Mini-Survey Completed</strong>'
      };
      flowStatusText.innerHTML = statusMap[currentQuestionId] || '';
    }
  }

  function advanceStep() {
    const selectedVal = userAnswers[currentQuestionId];
    if (!selectedVal) return;

    const currentQ = SURVEY_DATA[currentQuestionId];
    const chosenOpt = currentQ.options.find(opt => opt.value === selectedVal);

    if (chosenOpt && chosenOpt.next) {
      const nextQId = chosenOpt.next;
      currentQuestionId = nextQId;
      historyStack.push(nextQId);
      renderCurrentStep();
    }
  }

  // Button Listeners
  nextBtn.addEventListener('click', () => {
    clearAutoplayTimers();
    advanceStep();
  });

  backBtn.addEventListener('click', () => {
    clearAutoplayTimers();
    if (historyStack.length > 1) {
      historyStack.pop();
      currentQuestionId = historyStack[historyStack.length - 1];
      renderCurrentStep();
    }
  });

  restartBtn.addEventListener('click', () => {
    clearAutoplayTimers();
    currentQuestionId = 'q2';
    historyStack = ['q2'];
    userAnswers = {};
    renderCurrentStep();
  });

  // SHORTCUT AUTO-PLAY DEMOS
  if (autoplayProfABtn) {
    autoplayProfABtn.addEventListener('click', () => {
      clearAutoplayTimers();
      currentQuestionId = 'q2';
      historyStack = ['q2'];
      userAnswers = {};
      renderCurrentStep();

      // Step 1: Select Profession A
      const t1 = setTimeout(() => {
        userAnswers['q2'] = 'profession_a';
        renderCurrentStep();
        
        // Step 2: Next -> Q3
        const t2 = setTimeout(() => {
          advanceStep();
          
          // Step 3: Select Q3 Specialized Answer
          const t3 = setTimeout(() => {
            userAnswers['q3'] = 'answer_a1';
            renderCurrentStep();

            // Step 4: Next -> Q4
            const t4 = setTimeout(() => {
              advanceStep();

              // Step 5: Select Q4 General Answer
              const t5 = setTimeout(() => {
                userAnswers['q4'] = 'gen_1';
                renderCurrentStep();

                // Step 6: Next -> End
                const t6 = setTimeout(() => {
                  advanceStep();
                }, 1000);
                autoplayTimeouts.push(t6);
              }, 1000);
              autoplayTimeouts.push(t5);
            }, 1000);
            autoplayTimeouts.push(t4);
          }, 1000);
          autoplayTimeouts.push(t3);
        }, 1000);
        autoplayTimeouts.push(t2);
      }, 500);
      autoplayTimeouts.push(t1);
    });
  }

  if (autoplayProfBBtn) {
    autoplayProfBBtn.addEventListener('click', () => {
      clearAutoplayTimers();
      currentQuestionId = 'q2';
      historyStack = ['q2'];
      userAnswers = {};
      renderCurrentStep();

      // Step 1: Select Profession B (Skip Q3)
      const t1 = setTimeout(() => {
        userAnswers['q2'] = 'profession_b';
        renderCurrentStep();

        // Step 2: Next -> Q4 (Skips Q3!)
        const t2 = setTimeout(() => {
          advanceStep();

          // Step 3: Select Q4 General Answer
          const t3 = setTimeout(() => {
            userAnswers['q4'] = 'gen_1';
            renderCurrentStep();

            // Step 4: Next -> End
            const t4 = setTimeout(() => {
              advanceStep();
            }, 1000);
            autoplayTimeouts.push(t4);
          }, 1000);
          autoplayTimeouts.push(t3);
        }, 1000);
        autoplayTimeouts.push(t2);
      }, 500);
      autoplayTimeouts.push(t1);
    });
  }

  // Initial Render
  renderCurrentStep();
}

/* ==========================================================================
   SECTION 3: MULTIPLE SHORT SITTINGS VISUALIZATION & INTERACTIVE SLIDER
   ========================================================================== */

function initSittingsTimeline() {
  const timelineEl = document.getElementById('sittings-segmented-bar');
  const sliderEl = document.getElementById('sittings-slider');
  const sliderCountEl = document.getElementById('slider-count');
  const sliderPercentEl = document.getElementById('slider-percent');
  const replayBtn = document.getElementById('replay-sittings-btn');
  
  const detailMsg = document.getElementById('sitting-detail-msg');
  const detailBadge = document.getElementById('detail-badge-text');

  if (!timelineEl || !sliderEl) return;

  const segmentBtns = timelineEl.querySelectorAll('.sitting-segment');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let replayTimer = null;

  function setCompletedSittings(count, isManualClick = false) {
    count = Math.max(0, Math.min(6, parseInt(count, 10) || 0));
    sliderEl.value = count;

    const percent = Math.round((count / 6) * 100);
    if (sliderCountEl) sliderCountEl.textContent = `Sittings Completed: ${count} of 6`;
    if (sliderPercentEl) sliderPercentEl.textContent = `${percent}% Complete`;

    segmentBtns.forEach((btn, index) => {
      const segIndex = index + 1;
      const checkEl = btn.querySelector('.seg-check');
      
      if (segIndex <= count) {
        btn.classList.add('animate-in');
        if (checkEl) checkEl.hidden = false;
      } else {
        btn.classList.remove('animate-in');
        if (checkEl) checkEl.hidden = true;
      }

      if (isManualClick && segIndex === count) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    if (count > 0) {
      updateTooltip(count);
    } else {
      if (detailBadge) detailBadge.textContent = 'Not Started';
      if (detailMsg) detailMsg.innerHTML = 'Drag slider or click any segment above to simulate completing sittings.';
    }
  }

  function updateTooltip(segNum) {
    if (detailBadge) detailBadge.textContent = `Sitting ${segNum} of 6`;
    if (detailMsg) {
      const isLast = segNum === 6;
      detailMsg.innerHTML = `
        <strong>Sitting ${segNum}:</strong> about 5 minutes, then pause and continue later when convenient. ${isLast ? '(Final sitting complete!)' : ''}
      `;
    }
  }

  // Slider Input Listener
  sliderEl.addEventListener('input', (e) => {
    if (replayTimer) clearInterval(replayTimer);
    setCompletedSittings(e.target.value);
  });

  // Replay Animation Handler
  function runReplayAnimation() {
    if (replayTimer) clearInterval(replayTimer);
    setCompletedSittings(0);

    if (prefersReducedMotion) {
      setCompletedSittings(6);
      return;
    }

    let step = 1;
    replayTimer = setInterval(() => {
      if (step <= 6) {
        setCompletedSittings(step);
        step++;
      } else {
        clearInterval(replayTimer);
      }
    }, 200);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runReplayAnimation();
    });
  }

  // IntersectionObserver to auto-animate on scroll into view
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runReplayAnimation();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(timelineEl);

  // Segment Click Handler
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (replayTimer) clearInterval(replayTimer);
      const segNum = parseInt(btn.dataset.segment, 10);
      setCompletedSittings(segNum, true);
    });
  });

  // Initial State
  setCompletedSittings(0);
}
