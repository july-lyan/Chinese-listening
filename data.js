const questions = [
  // 初级难度
  {
    id: 1,
    difficulty: 'easy',
    audioText: '你好，很高兴认识你。',
    pinyin: 'Nǐ hǎo, hěn gāo xìng rèn shi nǐ.',
    translation: 'Hello, nice to meet you.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20chinese%20greeting%20scene%20simple%20illustration&image_size=square',
    question: '这句话的意思是什么？',
    options: [
      '再见，明天见。',
      '你好，很高兴认识你。',
      '谢谢，不客气。',
      '对不起，我错了。'
    ],
    answer: 1
  },
  {
    id: 2,
    difficulty: 'easy',
    audioText: '今天天气很好。',
    pinyin: 'Jīn tiān tiān qì hěn hǎo.',
    translation: 'The weather is very good today.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunny%20day%20blue%20sky%20simple%20illustration&image_size=square',
    question: '这句话描述的是什么？',
    options: [
      '今天下雨了。',
      '今天天气很好。',
      '今天很冷。',
      '今天刮风了。'
    ],
    answer: 1
  },
  {
    id: 3,
    difficulty: 'easy',
    audioText: '我喜欢吃苹果。',
    pinyin: 'Wǒ xǐ huān chī píng guǒ.',
    translation: 'I like to eat apples.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20apples%20simple%20illustration&image_size=square',
    question: '说话人喜欢吃什么？',
    options: [
      '香蕉',
      '苹果',
      '橙子',
      '葡萄'
    ],
    answer: 1
  },
  
  // 中级难度
  {
    id: 4,
    difficulty: 'medium',
    audioText: '我每天早上七点起床，然后洗脸刷牙。',
    pinyin: 'Wǒ měi tiān zǎo shang qī diǎn qǐ chuáng, rán hòu xǐ liǎn shuā yá.',
    translation: 'I get up at seven oclock every morning, then wash my face and brush my teeth.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=morning%20routine%20washing%20face%20brushing%20teeth&image_size=square',
    question: '说话人每天早上做什么？',
    options: [
      '七点起床，然后洗脸刷牙。',
      '八点起床，然后吃早饭。',
      '六点起床，然后锻炼身体。',
      '九点起床，然后上班。'
    ],
    answer: 0
  },
  {
    id: 5,
    difficulty: 'medium',
    audioText: '昨天我去了图书馆，借了三本书。',
    pinyin: 'Zuó tiān wǒ qù le tú shū guǎn, jiè le sān běn shū.',
    translation: 'Yesterday I went to the library and borrowed three books.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=library%20with%20books%20simple%20illustration&image_size=square',
    question: '说话人昨天做了什么？',
    options: [
      '去了书店，买了三本书。',
      '去了图书馆，借了三本书。',
      '去了超市，买了东西。',
      '去了公园，散步。'
    ],
    answer: 1
  },
  {
    id: 6,
    difficulty: 'medium',
    audioText: '明天是星期天，我打算和朋友一起去爬山。',
    pinyin: 'Míng tiān shì xīng qī tiān, wǒ dǎ suàn hé péng yǒu yī qǐ qù pá shān.',
    translation: 'Tomorrow is Sunday, I plan to go hiking with friends.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friends%20hiking%20mountain%20simple%20illustration&image_size=square',
    question: '明天说话人打算做什么？',
    options: [
      '和家人一起去购物。',
      '和朋友一起去爬山。',
      '在家休息。',
      '去上班。'
    ],
    answer: 1
  },
  
  // 高级难度
  {
    id: 7,
    difficulty: 'hard',
    audioText: '中国是一个有着五千年历史的文明古国，拥有丰富的文化遗产和美丽的自然风光。',
    pinyin: 'Zhōng guó shì yī gè yǒu zhe wǔ qiān nián lì shǐ de wén míng gǔ guó, yōng yǒu fēng fù de wén huà yí chǎn hé měi lì de zì rán fēng guāng.',
    translation: 'China is an ancient civilization with a history of 5,000 years, boasting rich cultural heritage and beautiful natural scenery.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20ancient%20civilization%20cultural%20heritage%20illustration&image_size=square',
    question: '关于中国，下列说法正确的是？',
    options: [
      '中国有两千年历史。',
      '中国没有文化遗产。',
      '中国有五千年历史，拥有丰富的文化遗产。',
      '中国只有自然风光。'
    ],
    answer: 2
  },
  {
    id: 8,
    difficulty: 'hard',
    audioText: '学习一门新语言需要持之以恒的努力和大量的练习，只有这样才能取得进步。',
    pinyin: 'Xué xí yī mén xīn yǔ yán xū yào chí zhī yǐ héng de nǔ lì hé dà liàng de liàn xí, zhǐ yǒu zhè yàng cái néng qǔ dé jìn bù.',
    translation: 'Learning a new language requires persistent effort and a lot of practice; only in this way can one make progress.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=language%20learning%20study%20persistent%20effort%20illustration&image_size=square',
    question: '学习新语言需要什么？',
    options: [
      '偶尔学习即可。',
      '不需要练习。',
      '持之以恒的努力和大量的练习。',
      '只需要天赋。'
    ],
    answer: 2
  },
  {
    id: 9,
    difficulty: 'hard',
    audioText: '随着科技的快速发展，人工智能已经在许多领域得到了广泛应用，改变了我们的生活方式。',
    pinyin: 'Suí zhe kē jì de kuài sù fā zhǎn, rén gōng zhì néng yǐ jīng zài xǔ duō lǐng yù dé dào le guǎng fàn yìng yòng, gǎi biàn le wǒ men de shēng huó fāng shì.',
    translation: 'With the rapid development of technology, artificial intelligence has been widely applied in many fields, changing our way of life.',
    imagePath: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=artificial%20intelligence%20technology%20future%20life%20illustration&image_size=square',
    question: '人工智能的发展带来了什么影响？',
    options: [
      '没有改变我们的生活。',
      '只在少数领域应用。',
      '改变了我们的生活方式。',
      '减缓了科技发展。'
    ],
    answer: 2
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = questions;
}