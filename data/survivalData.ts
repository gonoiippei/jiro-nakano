export type Choice = {
  text: string;
  gaugeDelta: number; // 正=ゲージ増加（怒る）、負=ゲージ減少（落ち着く）
  reaction: string; // 仲野のリアクション
  isCorrect: boolean;
};

export type Scene = {
  id: number;
  title: string; // 「場面X: タイトル」
  situation: string; // 状況説明文
  question: string; // 問いかけ
  choices: Choice[];
  type: "fair" | "trick"; // 公平問題 or 意地悪問題
};

export type RandomEvent = {
  id: number;
  emoji: string;
  title: string;
  description: string;
  gaugeDelta: number;
};

// ===== 7場面 =====
export const SCENES: Scene[] = [
  // ── 場面1（公平）: 行列に並ぶ ──
  {
    id: 1,
    title: "場面1: 行列に並ぶ",
    situation:
      "店の外の行列に並んでいる。\nスマホで時間を潰していると、前の客が店内に入ったのに気づいていない。\n列が空き始めていた。",
    question: "あなたはどうする？",
    type: "fair",
    choices: [
      {
        text: "すぐにスマホをしまい、黙って前に詰める",
        gaugeDelta: 0,
        reaction: "（何も言わない。当然だ。）",
        isCorrect: true,
      },
      {
        text: "「あ、すみません！」と大声で前の人に声をかける",
        gaugeDelta: 15,
        reaction: "うるさい。静かにしろ。",
        isCorrect: false,
      },
      {
        text: "列が詰まるのを待ち、ゆっくりスマホをしまってから歩く",
        gaugeDelta: 20,
        reaction: "後ろの客に迷惑だ。さっさと動け。",
        isCorrect: false,
      },
      {
        text: "友達に「今列並んでる」とLINEを送りながら前に進む",
        gaugeDelta: 25,
        reaction: "スマホしまえ。前見ろ。",
        isCorrect: false,
      },
    ],
  },

  // ── 場面2（公平）: 食券を買う ──
  {
    id: 2,
    title: "場面2: 食券を買う",
    situation:
      "食券機の前に立った。\nメニューを見ながら何を頼むか迷っている。\n後ろにも客が並んでいる。",
    question: "あなたはどうする？",
    type: "fair",
    choices: [
      {
        text: "並ぶ前に決めていたので、素早く小ラーメンの食券を買う",
        gaugeDelta: -5,
        reaction: "（何も言わない。それでいい。）",
        isCorrect: true,
      },
      {
        text: "食券機の前で「えーと…」と声に出しながら1分以上考える",
        gaugeDelta: 30,
        reaction: "並ぶ前に決めてこい！後ろがつかえてるだろ！",
        isCorrect: false,
      },
      {
        text: "後ろの客に「何がおすすめですか？」と聞く",
        gaugeDelta: 20,
        reaction: "……（無言の圧力）",
        isCorrect: false,
      },
      {
        text: "財布からゆっくり小銭を数えながら払う",
        gaugeDelta: 25,
        reaction: "Suicaかなんかで払え。",
        isCorrect: false,
      },
    ],
  },

  // ── 場面3（公平）: コール内容 ──
  {
    id: 3,
    title: "場面3: コール内容",
    situation:
      "着丼直前。「ニンニク入れますか？」と聞かれた。\n初めての二郎だが、マシマシを試してみたい気持ちもある。",
    question: "何と答える？",
    type: "fair",
    choices: [
      {
        text: "「ニンニク、ヤサイ少なめで」と明確に答える",
        gaugeDelta: -5,
        reaction: "（うなずいて、てきぱきと盛り付ける。）",
        isCorrect: true,
      },
      {
        text: "「ニンニクマシマシ、ヤサイマシマシ、アブラマシマシ！」と叫ぶ",
        gaugeDelta: 35,
        reaction: "初見でマシマシ頼むな。完食できるのか？ふざけんな。",
        isCorrect: false,
      },
      {
        text: "「えっと…なんでもいいです」と言う",
        gaugeDelta: 20,
        reaction: "なんでもいい、じゃない。ちゃんと答えろ。",
        isCorrect: false,
      },
      {
        text: "「コールって何ですか？」と聞く",
        gaugeDelta: 30,
        reaction: "来る前に調べてこい。",
        isCorrect: false,
      },
    ],
  },

  // ── 場面4（公平）: 食後の片付け ──
  {
    id: 4,
    title: "場面4: 食後の片付け",
    situation:
      "完食した。どんぶりとレンゲが目の前にある。\n次の客が外で待っている。",
    question: "あなたはどうする？",
    type: "fair",
    choices: [
      {
        text: "どんぶりを返却口に持っていき、静かに席を立つ",
        gaugeDelta: -10,
        reaction: "（何も言わない。目が少し和らいだ。）",
        isCorrect: true,
      },
      {
        text: "どんぶりをそのままにして立ち上がる",
        gaugeDelta: 30,
        reaction: "片付けろ！！",
        isCorrect: false,
      },
      {
        text: "「ごちそうさまでした！」と大声で言ってから席を立つ",
        gaugeDelta: 15,
        reaction: "うるさい。静かにしろ。",
        isCorrect: false,
      },
      {
        text: "食後にスマホを5分いじってからゆっくり立つ",
        gaugeDelta: 40,
        reaction: "回転率を考えろ。さっさと出ろ！",
        isCorrect: false,
      },
    ],
  },

  // ── 場面5（意地悪）: コールのタイミング ──
  {
    id: 5,
    title: "場面5: コールのタイミング",
    situation:
      "着席して待っている。仲野さんが麺を湯切りしている。\nコールはいつ言えばいいのか、タイミングが読めない。",
    question: "コールはいつ言う？",
    type: "trick",
    choices: [
      {
        text: "丼が目の前にドンと置かれた、その瞬間に言う",
        gaugeDelta: -5,
        reaction: "（スムーズに盛り付けが始まった。完璧なタイミングだ。）",
        isCorrect: true,
      },
      {
        text: "「そろそろかな」と思ったタイミングで早めに言う",
        gaugeDelta: 20,
        reaction: "まだだ。丼が来てから言え。",
        isCorrect: false,
      },
      {
        text: "仲野さんが湯切りを始めた瞬間に言う",
        gaugeDelta: 25,
        reaction: "早い。もっと待て。",
        isCorrect: false,
      },
      {
        text: "言い忘れて、丼が置かれた後に「あっ、ニンニクを！」と追加で言う",
        gaugeDelta: 35,
        reaction: "遅い。もう遅い。",
        isCorrect: false,
      },
    ],
  },

  // ── 場面6（意地悪）: 食事中の衝動 ──
  {
    id: 6,
    title: "場面6: 食事中の衝動",
    situation:
      "食べている。豚がとろとろで、スープが最高にうまい。\n感動して思わず声に出したくなった。",
    question: "あなたはどうする？",
    type: "trick",
    choices: [
      {
        text: "心の中で「うまい」と叫びながら、黙々と食べ続ける",
        gaugeDelta: -10,
        reaction: "（何も言わない。あなたの食べっぷりを見て、少し満足そうだ。）",
        isCorrect: true,
      },
      {
        text: "「うまっ！！」と思わず声に出してしまう",
        gaugeDelta: 20,
        reaction: "黙って食え。",
        isCorrect: false,
      },
      {
        text: "仲野さんに「美味しいです！」と伝える",
        gaugeDelta: 25,
        reaction: "いらん。黙って食え。",
        isCorrect: false,
      },
      {
        text: "スマホで写真を撮りながら「映える〜」とつぶやく",
        gaugeDelta: 50,
        reaction: "スマホしまえ！！撮影禁止だ！！",
        isCorrect: false,
      },
    ],
  },

  // ── 場面7（意地悪）: 退店 ──
  {
    id: 7,
    title: "場面7: 退店",
    situation:
      "満腹になった。麺もスープも飲み干した。\n次の客が外で待っている。さあ、退店だ。",
    question: "あなたはどうする？",
    type: "trick",
    choices: [
      {
        text: "どんぶりを片付け、静かに席を立ち、無言で店を出る",
        gaugeDelta: -5,
        reaction: "（何も言わない。それでいい。）",
        isCorrect: true,
      },
      {
        text: "「替え玉ください！」と元気よく注文する",
        gaugeDelta: 55,
        reaction: "二郎に替え玉はない！！何を食ってきたんだ！！",
        isCorrect: false,
      },
      {
        text: "「また来ます！」と笑顔で言って出る",
        gaugeDelta: 15,
        reaction: "黙って出ろ。",
        isCorrect: false,
      },
      {
        text: "「お会計！」と声に出す",
        gaugeDelta: 20,
        reaction: "食券制だ。もう払ってある。",
        isCorrect: false,
      },
    ],
  },
];

// ===== ランダムイベント5種 =====
export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 1,
    emoji: "📱",
    title: "スマホが大音量で着信！",
    description:
      "ポケットから着信音がMaxボリュームで鳴り響いた。\n店内の全員が振り向く。\n仲野さんの目が細くなった。",
    gaugeDelta: 20,
  },
  {
    id: 2,
    emoji: "🧑",
    title: "隣の客に話しかけられる",
    description:
      "隣の常連客が「初めてですか？」と声をかけてきた。\n思わず返事をしてしまい、店内に会話が響いた。",
    gaugeDelta: 15,
  },
  {
    id: 3,
    emoji: "😰",
    title: "前の客が怒られている",
    description:
      "目の前で別の客が仲野さんに怒鳴られている。\n緊張で手が震え、どんぶりが微妙に揺れた。",
    gaugeDelta: 10,
  },
  {
    id: 4,
    emoji: "💦",
    title: "スープをこぼした",
    description:
      "豚を箸でつまんだ瞬間、どんぶりからスープが溢れてカウンターを汚した。\n仲野さんがこちらを見ている。",
    gaugeDelta: 25,
  },
  {
    id: 5,
    emoji: "☀️",
    title: "仲野の機嫌がいい日！",
    description:
      "今日は仲野さんの機嫌がいいようだ。\nなんとなく作業が滑らかで、あなたへの視線も柔らかい。\nラッキー！",
    gaugeDelta: -15,
  },
];

// ===== エンディング定義 =====
export type EndingType = "gameover" | "clear_perfect" | "clear_normal" | "clear_close";

export const ENDINGS: Record<EndingType, { title: string; subtitle: string; nakanoLine: string; bgColor: string }> = {
  gameover: {
    title: "退店命令！",
    subtitle: "二度と来るな！",
    nakanoLine: "「わかる？うちに来る資格がない人間ってのは来ないでほしいんだよ。マジで。」",
    bgColor: "#cc0000",
  },
  clear_perfect: {
    title: "ジロリアン認定！",
    subtitle: "完璧な立ち回りだ。また来い。",
    nakanoLine: "「……認めよう。お前は本物のジロリアンだ。次も来い。」",
    bgColor: "#1a5c1a",
  },
  clear_normal: {
    title: "まあ、完食は認める",
    subtitle: "次はもっとうまくやれ。",
    nakanoLine: "「悪くはなかった。でも、まだ修行が足りないな。」",
    bgColor: "#4a4a00",
  },
  clear_close: {
    title: "ギリギリだったな",
    subtitle: "次はもっとうまくやれよ。",
    nakanoLine: "「今回は見逃してやる。でも次やらかしたら本当に出てってもらう。」",
    bgColor: "#8a4500",
  },
};
