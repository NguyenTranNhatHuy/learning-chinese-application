export const topics = [
  {
    id: "family",
    title: "Gia đình",
    description: "Người thân, nhà cửa và sinh hoạt hằng ngày.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    accent: "#E53935",
    vocabularyCount: 3
  },
  {
    id: "school",
    title: "Trường học",
    description: "Lớp học, môn học và câu nói quen thuộc ở trường.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    accent: "#2563EB",
    vocabularyCount: 2
  },
  {
    id: "travel",
    title: "Du lịch",
    description: "Đi lại, hỏi đường, khách sạn và trải nghiệm thành phố.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    accent: "#059669",
    vocabularyCount: 2
  },
  {
    id: "work",
    title: "Công việc",
    description: "Văn phòng, nghề nghiệp, lịch họp và trao đổi công việc.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    accent: "#F59E0B",
    vocabularyCount: 1
  }
];

export const vocabularies = [
  {
    id: "ni-hao",
    topicId: "family",
    chinese: "你好",
    pinyin: "nǐ hǎo",
    meaning: "Xin chào",
    type: "Cụm từ",
    example: "你好！很高兴见到你。",
    examplePinyin: "Nǐ hǎo! Hěn gāoxìng jiàndào nǐ.",
    exampleMeaning: "Xin chào! Rất vui được gặp bạn.",
    radical: "亻",
    strokes: 13,
    hskLevel: 1,
    synonyms: ["您好"],
    antonyms: [],
    relatedWords: ["再见", "谢谢"],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "jia",
    topicId: "family",
    chinese: "家",
    pinyin: "jiā",
    meaning: "Nhà, gia đình",
    type: "Danh từ",
    example: "我家有四口人。",
    examplePinyin: "Wǒ jiā yǒu sì kǒu rén.",
    exampleMeaning: "Nhà tôi có bốn người.",
    radical: "宀",
    strokes: 10,
    hskLevel: 1,
    synonyms: [],
    antonyms: [],
    relatedWords: ["爸爸", "妈妈", "孩子"],
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "xi-huan",
    topicId: "family",
    chinese: "喜欢",
    pinyin: "xǐ huān",
    meaning: "Thích",
    type: "Động từ",
    example: "我喜欢喝茶。",
    examplePinyin: "Wǒ xǐhuān hē chá.",
    exampleMeaning: "Tôi thích uống trà.",
    radical: "口",
    strokes: 27,
    hskLevel: 2,
    synonyms: ["爱"],
    antonyms: ["讨厌"],
    relatedWords: ["爱好"],
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "xue-xiao",
    topicId: "school",
    chinese: "学校",
    pinyin: "xué xiào",
    meaning: "Trường học",
    type: "Danh từ",
    example: "学校在图书馆旁边。",
    examplePinyin: "Xuéxiào zài túshūguǎn pángbiān.",
    exampleMeaning: "Trường học ở cạnh thư viện.",
    radical: "子",
    strokes: 18,
    hskLevel: 1,
    synonyms: [],
    antonyms: [],
    relatedWords: ["老师", "学生", "教室"],
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "xue-xi",
    topicId: "school",
    chinese: "学习",
    pinyin: "xué xí",
    meaning: "Học tập",
    type: "Động từ",
    example: "我每天学习中文。",
    examplePinyin: "Wǒ měitiān xuéxí Zhōngwén.",
    exampleMeaning: "Tôi học tiếng Trung mỗi ngày.",
    radical: "子",
    strokes: 11,
    hskLevel: 1,
    synonyms: ["念书"],
    antonyms: [],
    relatedWords: ["中文", "考试"],
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tian-qi",
    topicId: "travel",
    chinese: "天气",
    pinyin: "tiān qì",
    meaning: "Thời tiết",
    type: "Danh từ",
    example: "今天天气很好。",
    examplePinyin: "Jīntiān tiānqì hěn hǎo.",
    exampleMeaning: "Hôm nay thời tiết rất đẹp.",
    radical: "大",
    strokes: 8,
    hskLevel: 2,
    synonyms: [],
    antonyms: [],
    relatedWords: ["今天", "下雨", "热"],
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "jiu-dian",
    topicId: "travel",
    chinese: "酒店",
    pinyin: "jiǔ diàn",
    meaning: "Khách sạn",
    type: "Danh từ",
    example: "酒店离机场很近。",
    examplePinyin: "Jiǔdiàn lí jīchǎng hěn jìn.",
    exampleMeaning: "Khách sạn rất gần sân bay.",
    radical: "氵",
    strokes: 19,
    hskLevel: 3,
    synonyms: ["宾馆"],
    antonyms: [],
    relatedWords: ["房间", "护照"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gong-zuo",
    topicId: "work",
    chinese: "工作",
    pinyin: "gōng zuò",
    meaning: "Công việc, làm việc",
    type: "Danh từ",
    example: "他的工作很忙。",
    examplePinyin: "Tā de gōngzuò hěn máng.",
    exampleMeaning: "Công việc của anh ấy rất bận.",
    radical: "工",
    strokes: 10,
    hskLevel: 2,
    synonyms: [],
    antonyms: ["休息"],
    relatedWords: ["公司", "会议"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
  }
];

export const quizzes = vocabularies.flatMap((word, index) => {
  const others = vocabularies.filter((item) => item.id !== word.id);
  const meaningOptions = [word.meaning, ...others.slice(index % 3, index % 3 + 3).map((item) => item.meaning)];
  const pinyinOptions = [word.pinyin, ...others.slice(index % 3, index % 3 + 3).map((item) => item.pinyin)];

  return [
    {
      id: `${word.id}-meaning`,
      vocabularyId: word.id,
      type: "meaning",
      question: word.chinese,
      options: normalizeOptions(meaningOptions),
      answer: word.meaning,
      explanation: `${word.chinese} đọc là ${word.pinyin}.`
    },
    {
      id: `${word.id}-pinyin`,
      vocabularyId: word.id,
      type: "pinyin",
      question: word.chinese,
      options: normalizeOptions(pinyinOptions),
      answer: word.pinyin,
      explanation: `Pinyin đúng là ${word.pinyin}.`
    }
  ];
});

function normalizeOptions(options) {
  const unique = [...new Set(options)].slice(0, 4);
  return unique.sort((a, b) => a.localeCompare(b, "vi"));
}

export const studyHistory = [
  { day: "T2", words: 6, score: 70 },
  { day: "T3", words: 8, score: 82 },
  { day: "T4", words: 5, score: 76 },
  { day: "T5", words: 10, score: 88 },
  { day: "T6", words: 7, score: 80 },
  { day: "T7", words: 11, score: 92 },
  { day: "CN", words: 9, score: 85 }
];

export const demoUsers = [
  {
    id: "demo-user",
    name: "Người học demo",
    email: "user@learningchinese.dev",
    role: "user",
    streak: 5,
    avatar: "",
    joinedAt: "2026-06-01"
  },
  {
    id: "demo-admin",
    name: "Admin",
    email: "admin@learningchinese.dev",
    role: "admin",
    streak: 12,
    avatar: "",
    joinedAt: "2026-05-20"
  }
];

