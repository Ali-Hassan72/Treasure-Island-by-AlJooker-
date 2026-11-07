const chapterOne = window.LESSON;
chapterOne.id = 1;
chapterOne.title = "The Old Pirate";
chapterOne.titleBefore = "The Old ";
chapterOne.titleAccent = "Pirate";
chapterOne.chapterLabel = "ONE";
chapterOne.pageStart = 8;
chapterOne.pageEnd = 11;
chapterOne.audioPath = "/audio/the-old-pirate-original.wav";
chapterOne.shadowingAudioPrefix = "/audio/shadowing/phrase-";
chapterOne.heroDescription = "استمع إلى حكاية جيم هوكنز، وتعلّم الإنجليزية من خلال المغامرة.";
chapterOne.illustrationsAfter = {
  "8-3": {
    src: "/manus-storage/async-images/QiJseE6I1lwEgygQDtpeC2/image-1.webp",
    alt: "جيم يشاهد البحّار العجوز يصل إلى النُزُل ومعه صندوقه البحري",
    caption: "The old sailor arrives at the inn.",
    captionAr: "وصول البحّار العجوز إلى النُزُل."
  },
  "10-1": {
    src: "/manus-storage/async-images/h1DmaoxxTJWfUnzonmZOME/image-1.webp",
    alt: "الدكتور ليفزي يطلب من الكابتن الهدوء قرب الدرج إلى غرفة والد جيم",
    caption: "Dr Livesey stands up to the Captain.",
    captionAr: "الدكتور ليفزي يواجه الكابتن."
  },
  "11-1": {
    src: "/manus-storage/async-images/h1DmaoxxTJWfUnzonmZOME/image-2.webp",
    alt: "جيم يشاهد الكابتن يتعرف على بلاك دوغ في النُزُل",
    caption: "Black Dog meets the Captain.",
    captionAr: "بلاك دوغ يلتقي بالكابتن."
  }
};
window.LESSONS = {
  1: chapterOne,
  2: window.CHAPTER_02,
  3: window.CHAPTER_03,
  4: window.CHAPTER_04
};
