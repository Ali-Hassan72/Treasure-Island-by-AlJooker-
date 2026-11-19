const chapterOne = window.LESSON;
chapterOne.id = 1;
chapterOne.title = "The Old Pirate";
chapterOne.titleBefore = "The Old ";
chapterOne.titleAccent = "Pirate";
chapterOne.chapterLabel = "ONE";
chapterOne.pageStart = 8;
chapterOne.pageEnd = 11;
chapterOne.audioPath = "/audio/the-old-pirate-original.mp3";
chapterOne.shadowingAudioPrefix = "/audio/shadowing/phrase-";
chapterOne.heroDescription = "استمع إلى حكاية جيم هوكنز، وتعلّم الإنجليزية من خلال المغامرة.";
chapterOne.illustrationsAfter = {
  "8-3": {
    src: "./images/optimized/chapter-01-old-sailor-arrives.webp",
    alt: "جيم وأبوه يشاهدان البحّار العجوز يصل إلى نُزُل أميرال بنبو مع صندوقه البحري",
    caption: "The old sailor arrives at the inn with his sea-chest.",
    captionAr: "وصول البحّار العجوز إلى النُزُل ومعه صندوقه البحري."
  },
  "11-4": {
    src: "./images/optimized/chapter-01-black-dog-inn-color.webp",
    alt: "جيم يراقب بحذر المواجهة بين بيلي بونز وبلاك دوغ في النزل",
    caption: "Jim watches as Black Dog confronts Billy Bones at the inn.",
    captionAr: "يراقب جيم مواجهة بلاك دوغ لبيلي بونز في النزل."
  }
};
window.LESSONS = {
  1: chapterOne,
  2: window.CHAPTER_02,
  3: window.CHAPTER_03,
  4: window.CHAPTER_04,
  5: window.CHAPTER_05,
  6: window.CHAPTER_06,
  7: window.CHAPTER_07,
  8: window.CHAPTER_08,
  9: window.CHAPTER_09,
  10: window.CHAPTER_10,
  11: window.CHAPTER_11,
  12: window.CHAPTER_12,
  13: window.CHAPTER_13,
  14: window.CHAPTER_14
};
