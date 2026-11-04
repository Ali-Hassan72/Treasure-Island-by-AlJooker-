(() => {
  'use strict';
  const lesson = window.LESSON;
  const storyTranslations = window.STORY_TRANSLATIONS || {};
  if (!lesson) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const futureTitles = [
    'The Black Spot', "The Captain's Papers", 'Long John Silver', 'The Apple Barrel',
    'Murder', 'The Man on the Island', 'The Stockade', 'The Fight with the Pirates',
    "Ben Gunn's Boat", 'Aboard the Hispaniola', "The Pirates' Prisoner",
    'The Search for the Treasure', "Flint's Treasure"
  ];

  // The book outline is shown for orientation only; future lessons are not written yet.
  $('#future-chapters').innerHTML = futureTitles.map((title, index) => {
    const number = String(index + 2).padStart(2, '0');
    return `<div class="chapter-link future" aria-disabled="true" title="سيُضاف هذا الفصل لاحقًا"><span class="chapter-number">${number}</span><span class="chapter-title">${title}</span><span class="chapter-state" aria-hidden="true">⌑</span></div>`;
  }).join('');

  const illustrationsAfter = new Map([
    ['8-3', {
      src: './old-sailor-arrives.webp',
      alt: 'Jim watches the old sailor arrive at the inn with his sea chest.',
      caption: 'The old sailor arrives at the inn.',
      captionAr: 'وصول البحّار العجوز إلى النُزُل.'
    }],
    ['10-1', {
      src: './dr-livesey-confronts-captain.webp',
      alt: 'Dr Livesey tells the Captain to be quiet.',
      caption: 'Dr Livesey stands up to the Captain.',
      captionAr: 'الدكتور ليفزي يواجه الكابتن.'
    }],
    ['11-1', {
      src: './black-dog-meets-captain.webp',
      alt: 'Black Dog meets the Captain at the inn.',
      caption: 'Black Dog meets the Captain.',
      captionAr: 'بلاك دوغ يلتقي بالكابتن.'
    }]
  ]);
  const storyContent = [];
  lesson.pages.forEach(page => {
    storyContent.push(`<section class="source-page" aria-label="Book page ${page.page}"><div class="page-marker" aria-hidden="true">BOOK PAGE ${page.page}</div>`);
    page.paragraphs.forEach((text, index) => {
      const translation = storyTranslations[`${page.page}-${index}`];
storyContent.push(`<p class="story-paragraph">${text}${translation ? `<span class="translation ar-helper" lang="ar" dir="rtl">${translation}</span>` : ''}</p>`);
      const image = illustrationsAfter.get(`${page.page}-${index}`);
      if (image) storyContent.push(`<figure class="story-illustration"><img src="${image.src}" alt="${image.alt}" loading="lazy"><figcaption><span lang="en" dir="ltr">${image.caption}</span><span class="ar-helper" lang="ar" dir="rtl">${image.captionAr}</span></figcaption></figure>`);
    });
    storyContent.push('</section>');
  });
  $('#story-text').innerHTML = storyContent.join('');

  $('#vocab-grid').innerHTML = lesson.vocabulary.map((item, index) => `
    <article class="vocab-card">
      <div class="vocab-top"><span class="vocab-word">${item.word}</span><span class="vocab-type">${item.type}</span></div>
      <p class="vocab-meaning ar-helper">${item.meaning}</p>
      <div class="vocab-example">${item.example}</div>
      <div class="vocab-example-ar ar-helper" lang="ar" dir="rtl">${item.exampleAr}</div>
    </article>`).join('');

  const completedKey = 'treasure-lesson-01-shadowing';
  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem(completedKey) || '[]')); } catch (_) { completed = new Set(); }
  const updateShadowProgress = () => {
    const total = lesson.shadowing.length;
    $('#shadow-progress-label').textContent = `${completed.size} / ${total} عبارات`;
    $('#shadow-progress-fill').style.width = `${(completed.size / total) * 100}%`;
  };
  $('#shadow-list').innerHTML = lesson.shadowing.map((phrase, index) => `
    <div class="shadow-row ${completed.has(index) ? 'done' : ''}" data-shadow-row="${index}">
      <button class="listen-line" type="button" data-speak="${index}" aria-label="استمع إلى العبارة ${index + 1}" title="استمع إلى العبارة">▶</button>
      <span class="shadow-phrase">${phrase}</span>
      <label class="shadow-check"><input type="checkbox" data-complete="${index}" ${completed.has(index) ? 'checked' : ''}><span>تدرّبت</span></label>
    </div>`).join('');
  updateShadowProgress();

  let activeUtterance = null;
  $$('[data-speak]').forEach(button => button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      showToast('ميزة القراءة غير متاحة في هذا المتصفح. استخدم التسجيل الكامل أعلاه.');
      return;
    }
    window.speechSynthesis.cancel();
    const phrase = lesson.shadowing[Number(button.dataset.speak)];
    activeUtterance = new SpeechSynthesisUtterance(phrase);
    activeUtterance.lang = 'en-US';
    activeUtterance.rate = 0.88;
    activeUtterance.pitch = 1;
    button.textContent = '…';
    const currentButton = button;
    activeUtterance.onend = activeUtterance.onerror = () => {
      currentButton.textContent = '▶';
      activeUtterance = null;
    };
    window.speechSynthesis.speak(activeUtterance);
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
      showToast('أجب عن الأسئلة الثمانية أولًا، ثم اعرض نتيجتك.');
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
    const high = score >= 6;
    result.hidden = false;
    result.classList.toggle('low', !high);
    result.innerHTML = `<span class="result-score">${score}/${lesson.quiz.length}</span><span class="result-message">${score === 8 ? 'ممتاز! فهمت تفاصيل الحكاية.' : high ? 'أحسنت! لديك فهم جيد للقصة.' : 'عمل جيد — أعد الاستماع وراجع المفردات.'}<small>إجابات صحيحة: ${score} من ${lesson.quiz.length}. تظهر الإجابة الصحيحة والتفسير تحت كل سؤال.</small></span>`;
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
