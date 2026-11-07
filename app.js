(() => {
  'use strict';
  const storyTranslations = window.STORY_TRANSLATIONS || {};
  const params = new URLSearchParams(window.location.search);
  const requestedChapter = Number(params.get('chapter')) || 1;
  const lessons = window.LESSONS || {};

const lesson = requestedChapter === 1
  ? (lessons[1] || window.LESSON)
  : lessons[requestedChapter];

if (!lesson) {
  console.error('Chapter data not found:', requestedChapter);
  return;
}

if (!lesson) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const futureTitles = [
  'The Black Spot',
  "The Captain's Papers",
  'Long John Silver',
  'The Apple Barrel',
  'Murder',
  'The Man on the Island',
  'The Stockade',
  'The Fight with the Pirates',
  "Ben Gunn's Boat",
  'Aboard the Hispaniola',
  "The Pirates' Prisoner",
  'The Search for the Treasure',
  "Flint's Treasure"
];

const chapterNav = $('#future-chapters');
  // Update selected chapter information
const chapterNumber = String(lesson.id).padStart(2, '0');

document.title = `${lesson.title} — Treasure Island English Lab`;

$('#lesson-title').innerHTML =
  `${lesson.titleBefore || lesson.title}<em>${lesson.titleAccent || ''}</em>`;

$('.breadcrumbs span:last-child').textContent =
  `Chapter ${chapterNumber}`;

$('.hero-description').textContent = lesson.heroDescription || '';

$('.stamp-caption').innerHTML =
  `CHAPTER<br>${lesson.chapterLabel || chapterNumber}`;

$('.book-count').textContent = `${chapterNumber} / 14`;

const readingToolbar = $('.reading-toolbar span:first-child');

if (readingToolbar) {
  readingToolbar.textContent =
    `FULL TEXT · BOOK PAGES ${lesson.pageStart}–${lesson.pageEnd}`;
}

// Change the main audio when the chapter changes
const audioSource = $('#narration source');

if (audioSource && lesson.audioPath) {
  audioSource.src = lesson.audioPath;
  $('#narration').load();
}

const audioTitle = $('.audio-main h3');

if (audioTitle) {
  audioTitle.textContent = lesson.title;
}

const audioLabel = $('.audio-label');

if (audioLabel) {
  audioLabel.innerHTML =
    `CHAPTER ${chapterNumber} <span class="audio-label-dot">•</span> FULL CHAPTER READING`;
}
const chapterLinks = [];

for (let number = 2; number <= 14; number++) {
  const chapterData = (window.LESSONS || {})[number];
  const title = chapterData?.title || futureTitles[number - 2];
  const available = Boolean(chapterData);
  const active = number === lesson.id;

  chapterLinks.push(`
    <a
      class="chapter-link ${active ? 'active' : ''} ${available ? '' : 'future'}"
      href="${available ? `./?chapter=${number}` : '#'}"
      ${active ? 'aria-current="page"' : ''}
      ${!available ? 'aria-disabled="true"' : ''}
      title="${available ? title : 'سيُضاف هذا الفصل لاحقًا'}"
    >
      <span class="chapter-number">${String(number).padStart(2, '0')}</span>
      <span class="chapter-title">${title}</span>
      <span class="chapter-state" aria-hidden="true">
        ${available ? '●' : '⌑'}
      </span>
    </a>
  `);
}

chapterNav.innerHTML = chapterLinks.join('');

const comingNote = $('.coming-note');
if (comingNote) {
  comingNote.hidden = Object.keys(window.LESSONS || {}).length >= 14;
}

  const illustrationsAfter = lesson.illustrationsAfter || {};
const illustrationsOnPage = lesson.illustrationsOnPage || {};

const storyContent = [];

function addIllustration(image) {
  if (!image) return '';

  return `
    <figure class="story-illustration">
      <img
        src="${image.src}"
        alt="${image.alt || ''}"
        loading="lazy"
      >
      <figcaption>
        <span lang="en" dir="ltr">${image.caption || ''}</span>
        <span class="ar-helper" lang="ar" dir="rtl">
          ${image.captionAr || ''}
        </span>
      </figcaption>
    </figure>
  `;
}

lesson.pages.forEach(page => {
  storyContent.push(`
    <section class="source-page" aria-label="Book page ${page.page}">
      <div class="page-marker">BOOK PAGE ${page.page}</div>
  `);

  // الصور التي تظهر في بداية الصفحة
  storyContent.push(addIllustration(illustrationsOnPage[page.page]));

  page.paragraphs.forEach((paragraph, index) => {
    const key = `${page.page}-${index}`;

    const translation =
      lesson.translationsByPage?.[page.page]?.[index] ||
      (lesson.id === 1 ? storyTranslations[key] : '');

    storyContent.push(`
      <p class="story-paragraph">
        ${paragraph}
        ${translation ? `
          <span class="translation ar-helper" lang="ar" dir="rtl">
            ${translation}
          </span>
        ` : ''}
      </p>
    `);

    // الصور التي تظهر بعد فقرة معينة
    storyContent.push(addIllustration(illustrationsAfter[key]));
  });

  // عرض الرسائل أو المستندات المرفقة بالفصل
  if (page.embeddedDocument) {
    const doc = page.embeddedDocument;

    storyContent.push(`
      <div class="embedded-document">
        ${addIllustration(doc.image)}
        <h3>${doc.title || ''}</h3>
        <p class="ar-helper" lang="ar" dir="rtl">${doc.titleAr || ''}</p>
        <pre>${doc.original || ''}</pre>
        <p class="translation ar-helper" lang="ar" dir="rtl">
          ${doc.translation || ''}
        </p>
      </div>
    `);
  }

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

  const completedKey = `treasure-lesson-${String(lesson.id).padStart(2, '0')}-shadowing`;
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

 const shadowPlayer = new Audio();
shadowPlayer.preload = 'none';

let activeShadowButton = null;

const resetShadowButton = () => {
  if (!activeShadowButton) return;

  activeShadowButton.textContent = '▶';
  activeShadowButton.classList.remove('is-playing');
  activeShadowButton.closest('.shadow-row')?.classList.remove('is-playing');

  activeShadowButton = null;
};

shadowPlayer.addEventListener('ended', resetShadowButton);

shadowPlayer.addEventListener('error', () => {
  resetShadowButton();
  showToast('تعذّر تشغيل هذا المقطع. أعد المحاولة.');
});

$$('[data-speak]').forEach(button => {
  button.addEventListener('click', () => {

    if (activeShadowButton === button && !shadowPlayer.paused) {
      shadowPlayer.pause();
      resetShadowButton();
      return;
    }

    shadowPlayer.pause();
    resetShadowButton();

    activeShadowButton = button;

    button.textContent = 'Ⅱ';
    button.classList.add('is-playing');
    button.closest('.shadow-row')?.classList.add('is-playing');

    const number = String(
      Number(button.dataset.speak) + 1
    ).padStart(2, '0');

    const audioPrefix =
      lesson.shadowingAudioPrefix ||
      './audio/shadowing/phrase-';

    shadowPlayer.src = `${audioPrefix}${number}.mp3`;
    shadowPlayer.load();

    shadowPlayer.play().catch(() => {
      resetShadowButton();
      showToast('تعذّر تشغيل هذا المقطع. أعد المحاولة.');
    });

  });
});
    // Update the page information for the selected chapter
const chapterNumber = String(lesson.id).padStart(2, '0');

document.title = `${lesson.title} — Treasure Island English Lab`;

$('#lesson-title').innerHTML =
  `${lesson.titleBefore || lesson.title} <em>${lesson.titleAccent || ''}</em>`;

$('.breadcrumbs span:last-child').textContent =
  `Chapter ${chapterNumber}`;

$('.hero-description').textContent = lesson.heroDescription || '';

$('.stamp-caption').innerHTML =
  `CHAPTER<br>${lesson.chapterLabel || chapterNumber}`;

$('.book-count').textContent = `${chapterNumber} / 14`;

const readingToolbar = $('.reading-toolbar span:first-child');
if (readingToolbar) {
  readingToolbar.textContent =
    `FULL TEXT · BOOK PAGES ${lesson.pageStart}–${lesson.pageEnd}`;
}

const audioSource = $('#narration source');
if (audioSource && lesson.audioPath) {
  audioSource.src = lesson.audioPath;
  $('#narration').load();
}

const audioTitle = $('.audio-main h3');
if (audioTitle) audioTitle.textContent = lesson.title;

const audioLabel = $('.audio-label');
if (audioLabel) {
  audioLabel.innerHTML =
    `CHAPTER ${chapterNumber} <span class="audio-label-dot">•</span> FULL CHAPTER READING`;
}

    shadowPlayer.pause();
    resetShadowButton();

    activeShadowButton = button;

    button.textContent = 'Ⅱ';
    button.classList.add('is-playing');
    button.closest('.shadow-row')?.classList.add('is-playing');

    const number = String(Number(button.dataset.speak) + 1).padStart(2, '0');

    const audioPrefix =
  lesson.shadowingAudioPrefix || './audio/shadowing/phrase-';

shadowPlayer.src = `${audioPrefix}${number}.mp3`;
    shadowPlayer.load();

    shadowPlayer.play().catch(() => {
      resetShadowButton();
      showToast('تعذّر تشغيل هذا المقطع. أعد المحاولة.');
    });

  });
});
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
