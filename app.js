(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const lessons = window.LESSONS || { 1: window.LESSON };
  const requestedChapter = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  const chapterNumber = lessons[requestedChapter] ? requestedChapter : 1;
  const lesson = lessons[chapterNumber];
  if (!lesson) return;

  const padChapter = value => String(value).padStart(2, '0');
  const chapterTitles = [
    'The Old Pirate', 'The Black Spot', "The Captain's Papers", 'Long John Silver',
    'The Apple Barrel', 'Murder', 'The Man on the Island', 'The Stockade',
    'The Fight with the Pirates', "Ben Gunn's Boat", 'Aboard the Hispaniola',
    "The Pirates' Prisoner", 'The Search for the Treasure', "Flint's Treasure"
  ];

  document.title = `${lesson.title} — Treasure Island English Lab`;
  $('meta[name="description"]').content = `درس إنجليزي تفاعلي للفصل ${chapterNumber} من Treasure Island: استمع، اقرأ، تعلم المفردات، وتدرّب على shadowing.`;
  $('#chapter-breadcrumb').textContent = `Chapter ${padChapter(chapterNumber)}`;
  $('#lesson-title').innerHTML = `${lesson.titleBefore}<em>${lesson.titleAccent}</em>`;
  $('#hero-description').textContent = lesson.heroDescription;
  $('#stamp-word').textContent = lesson.chapterLabel;
  $('#book-count').textContent = `${padChapter(chapterNumber)} / 14`;
  $('#audio-art-number').textContent = padChapter(chapterNumber);
  $('#audio-chapter-label').textContent = `CHAPTER ${padChapter(chapterNumber)}`;
  $('#audio-title').textContent = lesson.title;
  $('#reading-range').innerHTML = `<span class="reading-dot"></span> FULL TEXT · BOOK PAGES ${lesson.pageStart}–${lesson.pageEnd}`;
  $('#story-text').setAttribute('aria-label', `${lesson.title} — original English chapter text`);
  $('#footer-lesson-note').textContent = `درس تفاعلي مقتبس من النص الأصلي للفصل ${chapterNumber} «${lesson.title}» من رواية Treasure Island لروبرت لويس ستيفنسون.`;

  const audio = $('#narration');
  $('#narration-source').src = lesson.audioPath;
  audio.setAttribute('aria-label', `استمع إلى قراءة النص الأصلي الكامل للفصل ${chapterNumber} باللغة الإنجليزية`);
  audio.load();

  const audioCard = $('.audio-card');
  const audioDock = $('#audio-dock');
  const audioDockToggle = $('#audio-dock-toggle');
  const audioDockBack = $('#audio-dock-back');
  const audioDockBack5 = $('#audio-dock-back-5');
  const audioDockForward5 = $('#audio-dock-forward-5');
  const audioDockForward = $('#audio-dock-forward');
  const audioDockTitle = $('#audio-dock-title');
  const audioDockTime = $('#audio-dock-time');
  const audioDockProgress = $('#audio-dock-progress');
  audioDockTitle.textContent = lesson.title;
  let narrationStarted = false;
  const formatAudioTime = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const wholeSeconds = Math.floor(seconds);
    return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
  };
  const updateAudioDock = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    audioDockProgress.max = duration || 1;
    audioDockProgress.value = duration ? audio.currentTime : 0;
    audioDockTime.textContent = `${formatAudioTime(audio.currentTime)} / ${formatAudioTime(duration)}`;
    audioDockToggle.textContent = audio.paused ? '▶' : 'Ⅱ';
    audioDockToggle.setAttribute('aria-label', audio.paused ? 'تشغيل تسجيل الفصل' : 'إيقاف تسجيل الفصل مؤقتًا');
  };
  const syncAudioDock = () => {
    const topbarBottom = $('.topbar').getBoundingClientRect().bottom;
    audioDock.hidden = !(narrationStarted && audioCard.getBoundingClientRect().bottom <= topbarBottom + 4);
  };
  audioDockToggle.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => showToast('تعذّر تشغيل التسجيل. أعد المحاولة بعد لحظة.'));
    else audio.pause();
  });
  const skipNarration = seconds => {
    if (!Number.isFinite(audio.currentTime)) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    const wasEnded = audio.ended;
    try {
      audio.currentTime = Math.min(duration, Math.max(0, audio.currentTime + seconds));
      if (wasEnded && seconds < 0) audio.play().catch(() => showToast('تعذّر تشغيل التسجيل. أعد المحاولة بعد لحظة.'));
      updateAudioDock();
    } catch (_) {
      showToast('تعذّر تغيير موضع التسجيل في هذا المتصفح.');
    }
  };
  audioDockBack.addEventListener('click', () => skipNarration(-10));
  audioDockBack5.addEventListener('click', () => skipNarration(-5));
  audioDockForward5.addEventListener('click', () => skipNarration(5));
  audioDockForward.addEventListener('click', () => skipNarration(10));
  ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended'].forEach(eventName => {
    audio.addEventListener(eventName, updateAudioDock);
  });
  window.addEventListener('scroll', syncAudioDock, { passive: true });
  window.addEventListener('resize', syncAudioDock);
  syncAudioDock();

  $('#chapter-nav').innerHTML = chapterTitles.map((title, index) => {
    const number = index + 1;
    const numberText = padChapter(number);
    const currentLesson = lessons[number];
    const chapterTitle = currentLesson?.title || title;
    if (currentLesson) {
      const active = number === chapterNumber;
      return `<a class="chapter-link ${active ? 'active' : 'available'}" href="./?chapter=${number}" ${active ? 'aria-current="page"' : ''}><span class="chapter-number">${numberText}</span><span class="chapter-title">${chapterTitle}</span><span class="chapter-state" aria-hidden="true">${active ? '●' : '→'}</span></a>`;
    }
    return `<div class="chapter-link future" aria-disabled="true" title="سيُضاف هذا الفصل لاحقًا"><span class="chapter-number">${numberText}</span><span class="chapter-title">${title}</span><span class="chapter-state" aria-hidden="true">⌑</span></div>`;
  }).join('');
  const chapterNav = $('#chapter-nav');
  const activeChapterLink = $('.chapter-link.active', chapterNav);
  if (activeChapterLink && window.matchMedia('(max-width: 700px)').matches) {
    requestAnimationFrame(() => {
      const navRect = chapterNav.getBoundingClientRect();
      const linkRect = activeChapterLink.getBoundingClientRect();
      chapterNav.scrollLeft += linkRect.left - navRect.left - (navRect.width - linkRect.width) / 2;
    });
  }

  const storyContent = [];
  const illustrationMarkup = image => `<figure class="story-illustration"><img src="${image.src}" alt="${image.alt}" loading="lazy"><figcaption><span lang="en" dir="ltr">${image.caption}</span><span class="ar-helper" lang="ar" dir="rtl">${image.captionAr}</span></figcaption></figure>`;
  lesson.pages.forEach(page => {
    if (page.illustrationOnly) {
      const image = lesson.illustrationsOnPage?.[page.page];
      storyContent.push(`<section class="source-page source-page-art" aria-label="Book page ${page.page}"><div class="page-marker" aria-hidden="true">BOOK PAGE ${page.page} · ILLUSTRATION</div>${image ? illustrationMarkup(image) : ''}</section>`);
      return;
    }
    storyContent.push(`<section class="source-page" aria-label="Book page ${page.page}"><div class="page-marker" aria-hidden="true">BOOK PAGE ${page.page}</div>`);
    page.paragraphs.forEach((text, index) => {
      const translation = lesson.translationsByPage?.[page.page]?.[index];
      const translationMarkup = translation ? `<span class="translation ar-helper" lang="ar" dir="rtl">${translation}</span>` : '';
      storyContent.push(`<p class="story-paragraph">${text}${translationMarkup}</p>`);
      const image = lesson.illustrationsAfter?.[`${page.page}-${index}`];
      if (image) storyContent.push(illustrationMarkup(image));
    });
    if (page.embeddedDocument) {
      const embedded = page.embeddedDocument;
      storyContent.push(`<section class="embedded-document" aria-label="${embedded.titleAr}"><div class="embedded-document-heading"><span lang="en" dir="ltr">${embedded.title}</span><span class="ar-helper" lang="ar" dir="rtl">${embedded.titleAr}</span></div>${illustrationMarkup(embedded.image)}<p class="embedded-document-original" lang="en" dir="ltr">${embedded.original}</p><p class="embedded-document-translation ar-helper" lang="ar" dir="rtl">${embedded.translation}</p></section>`);
    }
    storyContent.push('</section>');
  });
  $('#story-text').innerHTML = storyContent.join('');

  $('#vocab-grid').innerHTML = lesson.vocabulary.map(item => `
    <article class="vocab-card">
      <div class="vocab-top"><span class="vocab-word">${item.word}</span><span class="vocab-type">${item.type}</span></div>
      <p class="vocab-meaning ar-helper">${item.meaning}</p>
      <div class="vocab-example">${item.example}</div>
      <div class="vocab-example-ar ar-helper" lang="ar" dir="rtl">${item.exampleAr}</div>
    </article>`).join('');

  const completedKey = `treasure-lesson-${padChapter(chapterNumber)}-shadowing`;
  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem(completedKey) || '[]')); } catch (_) { completed = new Set(); }
  const updateShadowProgress = () => {
    const total = lesson.shadowing.length;
    $('#shadow-progress-label').textContent = `${completed.size} / ${total} عبارات`;
    $('#shadow-progress-fill').style.width = `${total ? (completed.size / total) * 100 : 0}%`;
  };
  const shadowSpeedChoices = [0.25, 0.5, 0.75, 1];
  $('#shadow-list').innerHTML = lesson.shadowing.map((phrase, index) => `
    <div class="shadow-row ${completed.has(index) ? 'done' : ''}" data-shadow-row="${index}">
      <div class="shadow-row-main">
        <button class="listen-line" type="button" data-speak="${index}" data-audio="${lesson.shadowingAudioPrefix}${String(index + 1).padStart(2, '0')}.mp3" aria-label="استمع إلى العبارة ${index + 1} من التسجيل الأصلي" title="استمع إلى المقطع الأصلي">▶</button>
        <div class="shadow-line"><span class="shadow-number">${String(index + 1).padStart(2, '0')}</span><span class="shadow-phrase">${phrase}</span></div>
        <label class="shadow-check"><input type="checkbox" data-complete="${index}" ${completed.has(index) ? 'checked' : ''}><span>تدرّبت</span></label>
      </div>
      <div class="shadow-speed-panel">
        <span class="shadow-speed-label">سرعة هذا المقطع</span>
        <div class="shadow-speed-buttons" role="group" aria-label="سرعة العبارة ${index + 1}">
          ${shadowSpeedChoices.map(speed => `<button class="shadow-speed-button" type="button" data-shadow-index="${index}" data-shadow-speed="${speed}" aria-pressed="false">${speed}×</button>`).join('')}
        </div>
      </div>
    </div>`).join('');
  updateShadowProgress();

  const shadowPlayer = new Audio();
  shadowPlayer.preload = 'none';
  const shadowSpeedStorageKey = `treasure-shadow-speeds-${padChapter(chapterNumber)}`;
  let legacyDefaultSpeed = 1;
  try {
    const legacySpeed = Number(localStorage.getItem('treasure-shadow-speed'));
    if (shadowSpeedChoices.includes(legacySpeed)) legacyDefaultSpeed = legacySpeed;
  } catch (_) { /* speed preference is optional */ }
  const shadowSpeeds = Array(lesson.shadowing.length).fill(legacyDefaultSpeed);
  try {
    const savedSpeeds = JSON.parse(localStorage.getItem(shadowSpeedStorageKey) || '{}');
    Object.entries(savedSpeeds).forEach(([index, speed]) => {
      const phraseIndex = Number(index);
      if (Number.isInteger(phraseIndex) && phraseIndex >= 0 && phraseIndex < shadowSpeeds.length && shadowSpeedChoices.includes(Number(speed))) {
        shadowSpeeds[phraseIndex] = Number(speed);
      }
    });
  } catch (_) { /* per-phrase speed preferences are optional */ }
  let activeShadowButton = null;
  let shadowPlaybackRequest = 0;
  const renderShadowSpeed = index => {
    const row = $(`[data-shadow-row="${index}"]`);
    const speed = shadowSpeeds[index];
    $$('[data-shadow-speed]', row).forEach(button => {
      const active = Number(button.dataset.shadowSpeed) === speed;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  shadowSpeeds.forEach((_, index) => renderShadowSpeed(index));
  const persistShadowSpeeds = () => {
    try {
      localStorage.setItem(shadowSpeedStorageKey, JSON.stringify(Object.fromEntries(shadowSpeeds.map((speed, index) => [index, speed]))));
    } catch (_) { /* per-phrase speed preferences are optional */ }
  };
  const setPitchPreservation = () => {
    if ('preservesPitch' in shadowPlayer) shadowPlayer.preservesPitch = true;
    if ('mozPreservesPitch' in shadowPlayer) shadowPlayer.mozPreservesPitch = true;
    if ('webkitPreservesPitch' in shadowPlayer) shadowPlayer.webkitPreservesPitch = true;
  };
  const resetShadowButton = () => {
    shadowPlaybackRequest += 1;
    if (!activeShadowButton) return;
    activeShadowButton.textContent = '▶';
    activeShadowButton.classList.remove('is-playing');
    activeShadowButton.closest('.shadow-row')?.classList.remove('is-playing');
    activeShadowButton.setAttribute('aria-label', `استمع إلى العبارة ${Number(activeShadowButton.dataset.speak) + 1} من التسجيل الأصلي`);
    activeShadowButton = null;
  };
  audio.addEventListener('play', () => {
    narrationStarted = true;
    shadowPlayer.pause();
    resetShadowButton();
    syncAudioDock();
  });
  shadowPlayer.addEventListener('play', () => audio.pause());
  shadowPlayer.addEventListener('ended', resetShadowButton);
  shadowPlayer.addEventListener('error', () => {
    if (!activeShadowButton) return;
    resetShadowButton();
    showToast('تعذّر تشغيل هذا المقطع. أعد المحاولة بعد لحظة.');
  });
  $$('[data-shadow-speed]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.shadowIndex);
    const speed = Number(button.dataset.shadowSpeed);
    if (!Number.isInteger(index) || !shadowSpeedChoices.includes(speed)) return;
    shadowSpeeds[index] = speed;
    renderShadowSpeed(index);
    persistShadowSpeeds();
    if (activeShadowButton && Number(activeShadowButton.dataset.speak) === index) {
      shadowPlayer.playbackRate = speed;
      shadowPlayer.defaultPlaybackRate = speed;
      setPitchPreservation();
    }
  }));
  $$('[data-speak]').forEach(button => button.addEventListener('click', () => {
    if (activeShadowButton === button && !shadowPlayer.paused) {
      shadowPlayer.pause();
      resetShadowButton();
      return;
    }
    shadowPlayer.pause();
    resetShadowButton();
    audio.pause();
    activeShadowButton = button;
    button.textContent = 'Ⅱ';
    button.classList.add('is-playing');
    button.closest('.shadow-row')?.classList.add('is-playing');
    button.setAttribute('aria-label', `أوقف مقطع العبارة ${Number(button.dataset.speak) + 1}`);
    const index = Number(button.dataset.speak);
    const speed = shadowSpeeds[index];
    shadowPlayer.src = button.dataset.audio;
    shadowPlayer.playbackRate = speed;
    shadowPlayer.defaultPlaybackRate = speed;
    setPitchPreservation();
    shadowPlayer.load();
    const request = ++shadowPlaybackRequest;
    shadowPlayer.play().catch(error => {
      if (request !== shadowPlaybackRequest || error?.name === 'AbortError') return;
      resetShadowButton();
      showToast('تعذّر تشغيل هذا المقطع. أعد المحاولة بعد لحظة.');
    });
  }));
  $$('[data-complete]').forEach(input => input.addEventListener('change', () => {
    const index = Number(input.dataset.complete);
    if (input.checked) completed.add(index); else completed.delete(index);
    try { localStorage.setItem(completedKey, JSON.stringify([...completed])); } catch (_) { /* local progress is optional */ }
    input.closest('.shadow-row').classList.toggle('done', input.checked);
    updateShadowProgress();
  }));

  $('#quiz-form').innerHTML = lesson.quiz.map((question, index) => `
    <fieldset class="quiz-question" data-question="${index}">
      <div class="quiz-q-head"><span class="quiz-q-number">Q${String(index + 1).padStart(2, '0')}</span><div>
        <h3 lang="en" dir="ltr">${question.q}</h3>
        <p class="translation ar-helper" lang="ar" dir="rtl">${question.qAr}</p>
      </div></div>
      <div class="quiz-options" role="radiogroup" aria-label="${question.q}">
        ${question.options.map((option, optionIndex) => `<button class="quiz-option" type="button" role="radio" aria-checked="false" data-option="${optionIndex}" lang="en" dir="ltr"><span>${option}</span><span class="option-ar ar-helper" lang="ar" dir="rtl">${question.optionsAr[optionIndex]}</span></button>`).join('')}
      </div>
      <p class="quiz-explanation" hidden></p>
    </fieldset>`).join('');

  let selectedAnswers = Array(lesson.quiz.length).fill(null);
  let submitted = false;
  $$('.quiz-question').forEach((questionEl, questionIndex) => {
    $$('.quiz-option', questionEl).forEach(option => option.addEventListener('click', () => {
      if (submitted) return;
      selectedAnswers[questionIndex] = Number(option.dataset.option);
      $$('.quiz-option', questionEl).forEach(button => {
        const selected = button === option;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-checked', selected ? 'true' : 'false');
      });
    }));
  });

  $('#submit-quiz').addEventListener('click', () => {
    if (submitted) return;
    if (selectedAnswers.includes(null)) {
      showToast(`أجب عن الأسئلة الـ${lesson.quiz.length} أولًا، ثم اعرض نتيجتك.`);
      const firstUnanswered = selectedAnswers.indexOf(null);
      $(`[data-question="${firstUnanswered}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    submitted = true;
    let score = 0;
    lesson.quiz.forEach((question, index) => {
      const questionEl = $(`[data-question="${index}"]`);
      const explanation = $('.quiz-explanation', questionEl);
      $$('.quiz-option', questionEl).forEach((button, optionIndex) => {
        button.disabled = true;
        if (optionIndex === question.answer) button.classList.add('correct');
        else if (optionIndex === selectedAnswers[index]) button.classList.add('incorrect');
      });
      if (selectedAnswers[index] === question.answer) score += 1;
      explanation.hidden = false;
      explanation.textContent = question.why;
      questionEl.classList.add('answered');
    });
    const result = $('#quiz-result');
    const high = score >= Math.ceil(lesson.quiz.length * 0.75);
    result.hidden = false;
    result.classList.toggle('low', !high);
    result.innerHTML = `<span class="result-score">${score}/${lesson.quiz.length}</span><span class="result-message">${score === lesson.quiz.length ? 'ممتاز! فهمت تفاصيل الحكاية.' : high ? 'أحسنت! لديك فهم جيد للقصة.' : 'عمل جيد — أعد الاستماع وراجع المفردات.'}<small>إجابات صحيحة: ${score} من ${lesson.quiz.length}. تظهر الإجابة الصحيحة والتفسير تحت كل سؤال.</small></span>`;
    $('#submit-quiz').textContent = 'اكتمل الاختبار';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('#reset-quiz').addEventListener('click', () => {
    selectedAnswers = Array(lesson.quiz.length).fill(null);
    submitted = false;
    $('#quiz-result').hidden = true;
    $('#submit-quiz').innerHTML = 'اعرض نتيجتي <span aria-hidden="true">←</span>';
    $$('.quiz-question').forEach(questionEl => {
      questionEl.classList.remove('answered');
      $('.quiz-explanation', questionEl).hidden = true;
      $$('.quiz-option', questionEl).forEach(button => {
        button.disabled = false;
        button.classList.remove('selected', 'correct', 'incorrect');
        button.setAttribute('aria-checked', 'false');
      });
    });
    $('#quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const toggleButton = $('#assist-toggle');
  const assistLabel = $('#assist-label');
  toggleButton.addEventListener('click', () => {
    const enabled = toggleButton.getAttribute('aria-pressed') !== 'true';
    toggleButton.setAttribute('aria-pressed', String(enabled));
    document.body.classList.toggle('assist-off', !enabled);
    assistLabel.textContent = `المساعدة العربية: ${enabled ? 'مفعّلة' : 'مخفية'}`;
  });

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
})();
