import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Favorite } from "./models/Favorite.js";
import { Progress } from "./models/Progress.js";
import { Quiz } from "./models/Quiz.js";
import { StudyHistory } from "./models/StudyHistory.js";
import { Topic } from "./models/Topic.js";
import { User } from "./models/User.js";
import { Vocabulary } from "./models/Vocabulary.js";

const topics = [
  {
    title: "Gia đình",
    description: "Từ vựng giao tiếp về người thân, nhà cửa và sinh hoạt hằng ngày.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    accent: "#E53935",
    order: 1
  },
  {
    title: "Trường học",
    description: "Từ vựng lớp học, môn học và các câu nói quen thuộc ở trường.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    accent: "#2563EB",
    order: 2
  },
  {
    title: "Du lịch",
    description: "Từ vựng đi lại, hỏi đường, khách sạn và trải nghiệm thành phố.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    accent: "#059669",
    order: 3
  },
  {
    title: "Công việc",
    description: "Từ vựng văn phòng, lịch họp, nghề nghiệp và trao đổi công việc.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    accent: "#F59E0B",
    order: 4
  }
];

const words = [
  {
    topic: "Gia đình",
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
    relatedWords: ["再见", "谢谢"]
  },
  {
    topic: "Gia đình",
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
    relatedWords: ["爸爸", "妈妈", "孩子"]
  },
  {
    topic: "Gia đình",
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
    relatedWords: ["爱好"]
  },
  {
    topic: "Trường học",
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
    relatedWords: ["老师", "学生", "教室"]
  },
  {
    topic: "Trường học",
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
    relatedWords: ["中文", "考试"]
  },
  {
    topic: "Du lịch",
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
    relatedWords: ["今天", "下雨", "热"]
  },
  {
    topic: "Du lịch",
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
    relatedWords: ["房间", "护照"]
  },
  {
    topic: "Công việc",
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
    relatedWords: ["公司", "会议"]
  }
];

function makeQuiz(word, allWords) {
  const wrongMeanings = allWords
    .filter((item) => item.chinese !== word.chinese)
    .map((item) => item.meaning)
    .slice(0, 3);
  const wrongPinyin = allWords
    .filter((item) => item.chinese !== word.chinese)
    .map((item) => item.pinyin)
    .slice(0, 3);

  return [
    {
      type: "meaning",
      question: word.chinese,
      options: [word.meaning, ...wrongMeanings].sort(),
      answer: word.meaning,
      explanation: `${word.chinese} đọc là ${word.pinyin}, nghĩa là ${word.meaning}.`
    },
    {
      type: "pinyin",
      question: word.chinese,
      options: [word.pinyin, ...wrongPinyin].sort(),
      answer: word.pinyin,
      explanation: `Pinyin đúng của ${word.chinese} là ${word.pinyin}.`
    }
  ];
}

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Topic.deleteMany(),
    Vocabulary.deleteMany(),
    Quiz.deleteMany(),
    Favorite.deleteMany(),
    Progress.deleteMany(),
    StudyHistory.deleteMany()
  ]);

  await User.create([
    {
      name: "Admin",
      email: "admin@learningchinese.dev",
      password: "Admin123!",
      role: "admin",
      streak: 12
    },
    {
      name: "Người học demo",
      email: "user@learningchinese.dev",
      password: "User123!",
      role: "user",
      streak: 5
    }
  ]);

  const createdTopics = await Topic.insertMany(topics);
  const topicByTitle = new Map(createdTopics.map((topic) => [topic.title, topic._id]));

  const createdWords = await Vocabulary.insertMany(
    words.map((word) => ({
      ...word,
      topicId: topicByTitle.get(word.topic),
      topic: undefined
    }))
  );

  await Quiz.insertMany(
    createdWords.flatMap((word) =>
      makeQuiz(
        {
          id: word._id,
          chinese: word.chinese,
          pinyin: word.pinyin,
          meaning: word.meaning
        },
        createdWords
      ).map((quiz) => ({ ...quiz, vocabularyId: word._id }))
    )
  );

  console.log("Seeded learning-chinese database.");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

