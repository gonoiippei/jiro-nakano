// ビジュアルノベル用：各シーンの物語ビートデータ

export type SpriteExpression =
  | "normal"
  | "annoyed"
  | "angry"
  | "furious"
  | "satisfied";

export type BackgroundId =
  | "street"
  | "entrance"
  | "counter"
  | "eating"
  | "exit";

export type Beat = {
  bg: BackgroundId;
  sprite?: SpriteExpression; // undefined = キャラ非表示
  speaker?: string;          // undefined = ナレーション（斜体表示）
  text: string;
};

export type SceneBeats = {
  sceneId: number;           // survivalData.ts の Scene.id と対応
  preBeats: Beat[];          // 選択肢前のナレーション・会話
  reactionBeats: {
    correct: Beat[];
    wrong: Beat[];
  };
};

export const VN_BEATS: SceneBeats[] = [
  // ────────────────────────────────
  // 場面1: 行列に並ぶ（公平）
  // ────────────────────────────────
  {
    sceneId: 1,
    preBeats: [
      {
        bg: "street",
        sprite: undefined,
        text: "昼下がり。赤い看板が目に飛び込んできた。「ラーメン二郎 仲野店」──",
      },
      {
        bg: "street",
        sprite: undefined,
        text: "行列の最後尾に並んで、早20分。スマホで時間を潰していた。",
      },
      {
        bg: "street",
        sprite: "normal",
        text: "ふと気づくと、前の客が店内に入っていた。列が空いている。",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "street",
          sprite: "normal",
          speaker: "仲野",
          text: "（何も言わない。当然だ。）",
        },
      ],
      wrong: [
        {
          bg: "street",
          sprite: "angry",
          speaker: "仲野",
          text: "……",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面2: 食券を買う（公平）
  // ────────────────────────────────
  {
    sceneId: 2,
    preBeats: [
      {
        bg: "entrance",
        sprite: undefined,
        text: "入口を抜けると、黄色い食券機が迎えた。後ろにも客が並んでいる。",
      },
      {
        bg: "entrance",
        sprite: "annoyed",
        speaker: "仲野",
        text: "……（厨房から視線だけ飛んでくる）",
      },
      {
        bg: "entrance",
        sprite: "annoyed",
        text: "食券機の前に立った。さあ、何を買う？",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "entrance",
          sprite: "normal",
          speaker: "仲野",
          text: "（何も言わない。それでいい。）",
        },
      ],
      wrong: [
        {
          bg: "entrance",
          sprite: "furious",
          speaker: "仲野",
          text: "後ろがつかえてるだろ！",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面3: コール内容（公平）
  // ────────────────────────────────
  {
    sceneId: 3,
    preBeats: [
      {
        bg: "counter",
        sprite: undefined,
        text: "カウンターに着席した。目の前で仲野さんが麺を茹でている。",
      },
      {
        bg: "counter",
        sprite: "normal",
        text: "どんぶりが運ばれてくる寸前──仲野さんが口を開いた。",
      },
      {
        bg: "counter",
        sprite: "normal",
        speaker: "仲野",
        text: "ニンニク入れますか？",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "counter",
          sprite: "satisfied",
          speaker: "仲野",
          text: "（うなずいて、てきぱきと盛り付ける。）",
        },
      ],
      wrong: [
        {
          bg: "counter",
          sprite: "furious",
          speaker: "仲野",
          text: "来る前に決めてこい。",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面4: 食後の片付け（公平）
  // ────────────────────────────────
  {
    sceneId: 4,
    preBeats: [
      {
        bg: "eating",
        sprite: undefined,
        text: "完食した。器の底まできれいだ。麺もスープも、一滴残らず。",
      },
      {
        bg: "eating",
        sprite: "normal",
        text: "仲野さんが横目でこちらを見ている。どんぶりが目の前にある。",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "eating",
          sprite: "satisfied",
          speaker: "仲野",
          text: "（目が少し和らいだ。）",
        },
      ],
      wrong: [
        {
          bg: "eating",
          sprite: "furious",
          speaker: "仲野",
          text: "片付けろ！！",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面5: コールのタイミング（意地悪）
  // ────────────────────────────────
  {
    sceneId: 5,
    preBeats: [
      {
        bg: "counter",
        sprite: "normal",
        text: "着席して待つ。仲野さんが麺を湯切りしている。シャカシャカと音が響く。",
      },
      {
        bg: "counter",
        sprite: "normal",
        speaker: "仲野",
        text: "……（無言で作業が続く）",
      },
      {
        bg: "counter",
        sprite: "annoyed",
        text: "コールはいつ言えばいいのか。タイミングが読めない。",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "counter",
          sprite: "satisfied",
          speaker: "仲野",
          text: "（スムーズに盛り付けが始まった。完璧なタイミングだ。）",
        },
      ],
      wrong: [
        {
          bg: "counter",
          sprite: "angry",
          speaker: "仲野",
          text: "タイミングを覚えろ。",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面6: 食事中の衝動（意地悪）
  // ────────────────────────────────
  {
    sceneId: 6,
    preBeats: [
      {
        bg: "eating",
        sprite: undefined,
        text: "食べている。豚がとろとろで、スープが最高にうまい。",
      },
      {
        bg: "eating",
        sprite: "normal",
        text: "感動が全身を突き抜けた。思わず声に出したくなった。",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "eating",
          sprite: "satisfied",
          speaker: "仲野",
          text: "（あなたの食べっぷりを見て、少し満足そうだ。）",
        },
      ],
      wrong: [
        {
          bg: "eating",
          sprite: "angry",
          speaker: "仲野",
          text: "黙って食え。",
        },
      ],
    },
  },

  // ────────────────────────────────
  // 場面7: 退店（意地悪）
  // ────────────────────────────────
  {
    sceneId: 7,
    preBeats: [
      {
        bg: "exit",
        sprite: undefined,
        text: "麺もスープも飲み干した。満腹だ。完全な満腹だ。",
      },
      {
        bg: "exit",
        sprite: "normal",
        text: "次の客が外で待っている。さあ、退店だ。",
      },
    ],
    reactionBeats: {
      correct: [
        {
          bg: "exit",
          sprite: "normal",
          speaker: "仲野",
          text: "（何も言わない。それでいい。）",
        },
      ],
      wrong: [
        {
          bg: "exit",
          sprite: "furious",
          speaker: "仲野",
          text: "……出てってもらう。",
        },
      ],
    },
  },
];
