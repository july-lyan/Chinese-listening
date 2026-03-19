const questions = [
  // 初级难度
  {
    id: 1,
    difficulty: 'easy',
    type: 'select_sentence',
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
    id: 10,
    difficulty: 'easy',
    type: 'select_image',
    audioText: '一个男孩在看书。',
    pinyin: 'Yī gè nán hái zài kàn shū.',
    translation: 'A boy is reading a book.',
    imagePathA: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=boy%20reading%20book%20simple%20illustration&image_size=square',
    imagePathB: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=girl%20reading%20book%20simple%20illustration&image_size=square',
    question: '哪张图片符合描述？',
    options: [
      '图片A',
      '图片B'
    ],
    answer: 0
  },
  {
    id: 2,
    difficulty: 'easy',
    type: 'select_sentence',
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
    type: 'select_sentence',
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
  {
    id: 11,
    difficulty: 'easy',
    type: 'select_image',
    audioText: '桌子上有一个苹果。',
    pinyin: 'Zhuō zi shàng yǒu yī gè píng guǒ.',
    translation: 'There is an apple on the table.',
    imagePathA: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=apple%20on%20table%20simple%20illustration&image_size=square',
    imagePathB: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=banana%20on%20table%20simple%20illustration&image_size=square',
    question: '哪张图片符合描述？',
    options: [
      '图片A',
      '图片B'
    ],
    answer: 0
  },
  
  // 中级难度
  {
    id: 4,
    difficulty: 'medium',
    type: 'select_sentence',
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
    type: 'select_sentence',
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
    id: 12,
    difficulty: 'medium',
    type: 'select_image',
    audioText: '两个朋友在爬山。',
    pinyin: 'Liǎng gè péng yǒu zài pá shān.',
    translation: 'Two friends are climbing a mountain.',
    imagePathA: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20friends%20hiking%20mountain%20simple%20illustration&image_size=square',
    imagePathB: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=one%20person%20hiking%20mountain%20simple%20illustration&image_size=square',
    question: '哪张图片符合描述？',
    options: [
      '图片A',
      '图片B'
    ],
    answer: 0
  },
  
  // 高级难度
  {
    id: 7,
    difficulty: 'hard',
    type: 'select_sentence',
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
    type: 'select_sentence',
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
    id: 13,
    difficulty: 'hard',
    type: 'select_image',
    audioText: '人工智能正在改变我们的生活方式。',
    pinyin: 'Rén gōng zhì néng zhèng zài gǎi biàn wǒ men de shēng huó fāng shì.',
    translation: 'Artificial intelligence is changing our way of life.',
    imagePathA: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=artificial%20intelligence%20technology%20future%20life%20illustration&image_size=square',
    imagePathB: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20life%20without%20technology%20illustration&image_size=square',
    question: '哪张图片符合描述？',
    options: [
      '图片A',
      '图片B'
    ],
    answer: 0
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = questions;
}