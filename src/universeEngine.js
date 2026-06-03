export const statLabels = {
  pts: "PTS",
  reb: "REB",
  ast: "AST",
  blk: "BLK",
  stl: "STL",
  tov: "TOV",
  threes: "3PM"
};

export const modes = [
  { id: "safe", label: "Safe mode", cnLabel: "保守", multiplier: 0.72, cap: 10, floor: 8, ceiling: 92 },
  { id: "standard", label: "Normal mode", cnLabel: "标准", multiplier: 1, cap: 16, floor: 5, ceiling: 95 },
  { id: "bold", label: "Bold mode", cnLabel: "大胆", multiplier: 1.28, cap: 22, floor: 3, ceiling: 97 }
];

const playoffVariance = {
  pts: 36,
  reb: 9,
  ast: 6.25,
  blk: 1.44,
  stl: 1,
  tov: 2.25,
  threes: 2.25
};

export const TEAMS = [
  {
    id: "spurs",
    name: "San Antonio Spurs",
    cnName: "圣安东尼奥马刺",
    short: "SAS",
    baseWin: 42,
    vibe: "Young team, tall problems, group chat optimism.",
    cnVibe: "年轻、巨高、群聊里永远觉得有戏。",
    colors: {
      primary: "#14b8a6",
      secondary: "#f4f4f5",
      gradient: "linear-gradient(135deg, #14b8a6, #f4f4f5)"
    },
    players: [
      player("wemby", "Victor Wembanyama", "维克托·文班亚马", "01", "superstar", "too tall for normal screenshots", "高到截图都装不下", "🛸", ["pts", "reb", "blk", "ast"], { pts: 28, reb: 12, blk: 4, ast: 4 }, [sig("pts", "Wemby scoring fanfic", "文班得分爽文"), sig("blk", "Alien block party", "外星火锅店"), sig("reb", "Long-arm refund policy", "长臂退款政策")]),
      player("fox", "De'Aaron Fox", "达龙·福克斯", "05", "star", "fast break with no seatbelt", "没系安全带的快攻", "💨", ["pts", "ast", "stl", "tov"], { pts: 23, ast: 7, stl: 1, tov: 3 }, [sig("pts", "Fox hit the gas", "福克斯踩油门"), sig("ast", "speed dates the corner", "速度约会底角")]),
      player("vassell", "Devin Vassell", "德文·瓦塞尔", "24", "starter", "quiet heater merchant", "安静发烫的人", "🎯", ["pts", "threes", "reb"], { pts: 17, threes: 3, reb: 4 }, [sig("threes", "corner group project", "底角小组作业"), sig("pts", "suddenly 24 points", "突然 24 分")]),
      player("castle", "Stephon Castle", "斯蒂芬·卡斯尔", "02", "starter", "rookie doing adult chores", "新秀干成年人脏活", "🧃", ["pts", "ast", "stl", "tov"], { pts: 12, ast: 4, stl: 1, tov: 2 }, [sig("stl", "stole the possession", "偷走一个回合"), sig("ast", "baby floor general", "幼年指挥官")]),
      player("barnes", "Harrison Barnes", "哈里森·巴恩斯", "40", "starter", "veteran group chat admin", "老将群管理员", "🧓", ["pts", "reb", "threes"], { pts: 10, reb: 4, threes: 2 }, [sig("threes", "uncle corner three", "叔叔底角三分"), sig("reb", "veteran box-out", "老将卡位")]),
      player("champagnie", "Julian Champagnie", "朱利安·尚帕尼", "30", "starter", "corner parking permit", "底角停车证", "🍾", ["pts", "threes", "reb"], { pts: 9, threes: 2, reb: 4 }, [sig("threes", "champagne splash", "香槟水花"), sig("pts", "quiet nine becomes loud", "安静得分变大声")]),
      player("keldon", "Keldon Johnson", "凯尔登·约翰逊", "03", "bench", "bench points with volume", "替补席大音量", "🔊", ["pts", "reb", "threes"], { pts: 13, reb: 5, threes: 2 }, [sig("pts", "bench avalanche", "替补雪崩"), sig("threes", "random heater", "随机手热")]),
      player("harper", "Dylan Harper", "迪伦·哈珀", "06", "bench", "rookie confidence coupon", "新秀自信券", "🎟️", ["pts", "ast", "stl"], { pts: 9, ast: 3, stl: 1 }, [sig("pts", "freshman heater", "新生手热"), sig("ast", "rookie reads the menu", "新秀看懂菜单")]),
      player("bryant", "Carter Bryant", "卡特·布莱恩特", "07", "bench", "long wing mystery box", "长臂盲盒", "📦", ["pts", "reb", "stl"], { pts: 6, reb: 3, stl: 1 }, [sig("stl", "mystery box steal", "盲盒抢断"), sig("reb", "extra arm rebound", "多一条胳膊篮板")]),
      player("biyombo", "Bismack Biyombo", "俾斯麦·比永博", "15", "bench", "screen setter with elbows", "挡拆自带肘区", "🪨", ["reb", "blk", "pts"], { reb: 5, blk: 1, pts: 5 }, [sig("blk", "old school block", "老派盖帽"), sig("reb", "elbow real estate", "肘区地产")]),
      player("ingram", "Harrison Ingram", "哈里森·英格拉姆", "55", "bench", "two-way paperwork energy", "双向合同文件夹", "📄", ["pts", "reb", "ast"], { pts: 5, reb: 4, ast: 1 }, [sig("reb", "paperwork rebound", "文件夹篮板"), sig("pts", "two-way bucket", "双向得分")]),
      player("jonesgarcia", "David Jones Garcia", "大卫·琼斯-加西亚", "18", "bench", "bench cameo season", "替补客串季", "🎭", ["pts", "reb", "stl"], { pts: 5, reb: 3, stl: 1 }, [sig("pts", "cameo bucket", "客串得分"), sig("stl", "walk-on steal", "顺手抢断")]),
      player("kornet", "Luke Kornet", "卢克·科内特", "44", "bench", "vertical contest meme lab", "垂直干扰实验室", "🧪", ["pts", "reb", "blk"], { pts: 7, reb: 5, blk: 1 }, [sig("blk", "Kornet contest", "科内特干扰"), sig("reb", "lab rebound", "实验篮板")]),
      player("mclaughlin", "Jordan McLaughlin", "乔丹·麦克劳克林", "11", "bench", "tiny guard calculator", "小后卫计算器", "🧮", ["pts", "ast", "stl"], { pts: 5, ast: 3, stl: 1 }, [sig("ast", "pocket pass math", "口袋传球数学"), sig("stl", "tiny swipe", "小个抢断")]),
      player("miller", "Emanuel Miller", "伊曼纽尔·米勒", "17", "bench", "rotation dice roll", "轮换骰子", "🎲", ["pts", "reb", "stl"], { pts: 4, reb: 3, stl: 1 }, [sig("reb", "dice rebound", "骰子篮板"), sig("pts", "surprise four", "惊喜四分")]),
      player("olynyk", "Kelly Olynyk", "凯利·奥利尼克", "41", "bench", "stretch big podcast episode", "空间内线播客单集", "🎧", ["pts", "reb", "threes", "ast"], { pts: 8, reb: 5, threes: 1, ast: 3 }, [sig("threes", "slow-motion three", "慢动作三分"), sig("ast", "big man touch pass", "内线顺手传")]),
      player("plumlee", "Mason Plumlee", "梅森·普拉姆利", "22", "bench", "backup center emergency kit", "替补中锋急救包", "🧰", ["pts", "reb", "ast", "blk"], { pts: 5, reb: 6, ast: 2, blk: 1 }, [sig("reb", "emergency rebound", "急救篮板"), sig("ast", "surprise dime", "意外妙传")]),
      player("waters", "Lindy Waters III", "林迪·沃特斯三世", "12", "bench", "three-point rain check", "三分雨票", "☔", ["pts", "threes", "reb"], { pts: 6, threes: 2, reb: 2 }, [sig("threes", "rain check cashed", "雨票兑现"), sig("pts", "bench splash", "替补水花")])
    ]
  },
  {
    id: "knicks",
    name: "New York Knicks",
    cnName: "纽约尼克斯",
    short: "NYK",
    baseWin: 58,
    vibe: "Loud arena, tiny margins, everybody plays 43 minutes.",
    cnVibe: "主场很吵、分差很小、大家都像要打 43 分钟。",
    colors: {
      primary: "#f97316",
      secondary: "#2563eb",
      gradient: "linear-gradient(135deg, #f97316, #2563eb)"
    },
    players: [
      player("brunson", "Jalen Brunson", "杰伦·布伦森", "11", "superstar", "footwork tax collector", "脚步税务局", "🧾", ["pts", "ast", "threes", "tov"], { pts: 31, ast: 8, threes: 3, tov: 3 }, [sig("pts", "Brunson villain arc", "布伦森反派篇"), sig("ast", "footwork tax", "脚步税"), sig("threes", "Garden got loud", "花园开始吵")]),
      player("towns", "Karl-Anthony Towns", "卡尔-安东尼·唐斯", "32", "star", "big man with Wi-Fi range", "内线自带 Wi-Fi 射程", "📡", ["pts", "reb", "threes", "blk"], { pts: 24, reb: 11, threes: 3, blk: 1 }, [sig("threes", "center playing Wordle at the arc", "中锋站三分线猜词"), sig("reb", "glass weather report", "篮板天气预报")]),
      player("bridges", "Mikal Bridges", "米卡尔·布里奇斯", "25", "starter", "smiles then ruins your set", "笑着拆你战术", "🙂", ["pts", "stl", "threes"], { pts: 18, stl: 1, threes: 3 }, [sig("stl", "wing pickpocket", "侧翼扒手"), sig("pts", "silent 25", "安静 25 分")]),
      player("hart", "Josh Hart", "约什·哈特", "03", "starter", "rebound subscription service", "篮板包月服务", "🧲", ["pts", "reb", "ast", "stl"], { pts: 11, reb: 9, ast: 5, stl: 1 }, [sig("reb", "Hart found another rebound", "哈特又捡一个"), sig("ast", "chaos connector", "混乱连接器")]),
      player("anunoby", "OG Anunoby", "OG·阿奴诺比", "08", "starter", "defense patch update", "防守补丁更新", "🧱", ["pts", "stl", "blk", "threes"], { pts: 15, stl: 2, blk: 1, threes: 2 }, [sig("stl", "clamps online", "铁锁上线"), sig("threes", "corner punishment", "底角惩罚")]),
      player("sochan", "Jeremy Sochan", "杰里米·索汉", "20", "starter", "chaos glue moved boroughs", "混沌胶水换区", "🧩", ["pts", "reb", "ast", "stl"], { pts: 10, reb: 7, ast: 3, stl: 1 }, [sig("reb", "possession tax", "回合税"), sig("stl", "annoying aura", "烦人气场")]),
      player("robinson", "Mitchell Robinson", "米切尔·罗宾逊", "23", "starter", "offensive rebound alarm", "前场板警报器", "🚨", ["pts", "reb", "blk"], { pts: 7, reb: 9, blk: 2 }, [sig("reb", "rebound alarm", "篮板警报"), sig("blk", "paint receipt", "禁区小票")]),
      player("clarkson", "Jordan Clarkson", "乔丹·克拉克森", "00", "bench", "heat check with no warning", "毫无预警的手热", "🔥", ["pts", "ast", "threes", "tov"], { pts: 14, ast: 3, threes: 2, tov: 2 }, [sig("pts", "bench microwave", "替补微波炉"), sig("threes", "heat check approved", "手热审核通过")]),
      player("mcbride", "Miles McBride", "迈尔斯·麦克布莱德", "02", "bench", "role player legacy game bait", "角色球员传世局诱饵", "⚡", ["pts", "threes", "stl"], { pts: 8, threes: 2, stl: 1 }, [sig("threes", "role player legacy", "角色球员传世局"), sig("stl", "pressure spike", "压迫值飙升")]),
      player("dadiet", "Pacome Dadiet", "帕科姆·达迪耶", "04", "bench", "rookie camera flash", "新秀闪光灯", "📸", ["pts", "reb", "threes"], { pts: 5, reb: 2, threes: 1 }, [sig("pts", "rookie flash", "新秀闪光"), sig("threes", "surprise corner", "惊喜底角")]),
      player("alvarado", "Jose Alvarado", "何塞·阿尔瓦拉多", "06", "bench", "hide-and-seek steal threat", "躲猫猫抢断威胁", "🥷", ["pts", "ast", "stl", "tov"], { pts: 7, ast: 4, stl: 1, tov: 2 }, [sig("stl", "sneak attack", "偷袭抢断"), sig("ast", "small guard chaos", "小后卫混乱")]),
      player("kolek", "Tyler Kolek", "泰勒·科莱克", "13", "bench", "clipboard point guard", "战术板控卫", "📝", ["pts", "ast", "threes"], { pts: 5, ast: 3, threes: 1 }, [sig("ast", "clipboard assist", "战术板助攻"), sig("threes", "study hall three", "自习室三分")]),
      player("shamet", "Landry Shamet", "兰德里·沙梅特", "21", "bench", "shooter with receipt history", "投手自带发票", "🧾", ["pts", "threes", "ast"], { pts: 7, threes: 2, ast: 1 }, [sig("threes", "receipt three", "发票三分"), sig("pts", "bench spark", "替补火花")]),
      player("diawara", "Mohamed Diawara", "穆罕默德·迪亚瓦拉", "35", "bench", "mystery wing minutes", "神秘侧翼时间", "❓", ["pts", "reb", "stl"], { pts: 4, reb: 3, stl: 1 }, [sig("stl", "mystery swipe", "神秘抢断"), sig("reb", "wing rebound", "侧翼篮板")]),
      player("hukporti", "Ariel Hukporti", "阿里尔·胡克波蒂", "55", "bench", "backup big surprise box", "替补内线惊喜盒", "🎁", ["pts", "reb", "blk"], { pts: 5, reb: 5, blk: 1 }, [sig("blk", "gift-wrapped block", "礼盒盖帽"), sig("reb", "backup board", "替补篮板")])
    ]
  }
];

const statWeights = {
  pts: 0.28,
  reb: 0.18,
  ast: 0.22,
  blk: 0.42,
  stl: 0.36,
  threes: 0.32,
  tov: -0.34
};

const roleMultiplier = {
  superstar: 1.45,
  star: 1.18,
  starter: 0.9,
  bench: 0.72
};

function player(id, name, cnName, number, role, joke, cnJoke, emoji, stats, baseline, signature) {
  return {
    id,
    name,
    cnName,
    number,
    role,
    joke,
    cnJoke,
    avatar: emoji,
    image: `/player-ai-memes/${id}.png`,
    fallbackImage: `/player-memes/${id}.svg`,
    headshotImage: `/player-images/${id}.png`,
    stickerImage: makeSticker(emoji, number, role),
    stats,
    baseline,
    variance: makeVariance(stats, baseline, role),
    signature
  };
}

function sig(stat, label, cnLabel) {
  return { stat, label, cnLabel };
}

export function getDefaultScenarios(leftTeamId, rightTeamId) {
  return [];
}

export function getPresetValue(player, stat) {
  const bump = {
    pts: player.role === "superstar" ? 12 : 8,
    reb: 5,
    ast: 4,
    blk: 3,
    stl: 3,
    threes: 3,
    tov: -1
  };
  return Math.max(0, (player.baseline[stat] ?? 0) + bump[stat]);
}

export function buildUniverse(left, right, scenarios, mode) {
  const config = modes.find((item) => item.id === mode) ?? modes[1];
  const baseLeftWin = left.baseWin;
  const baseMargin = probabilityToMargin(baseLeftWin);
  let delta = 0;
  const actions = [];

  for (const scenario of scenarios) {
    const team = scenario.teamId === left.id ? left : right;
    const direction = scenario.teamId === left.id ? 1 : -1;
    const player = team.players.find((item) => item.id === scenario.playerId);
    if (!player || player.baseline[scenario.stat] === undefined) continue;

    const baseline = player.baseline[scenario.stat];
    const over = Number(scenario.value) - baseline;
    if (over === 0) continue;
    const raw = over * (statWeights[scenario.stat] ?? 0.2) * roleMultiplier[player.role] * config.multiplier;
    const capped = clamp(raw, -config.cap / 2, config.cap);
    const variance = player.variance?.[scenario.stat] ?? playoffVariance[scenario.stat] ?? 1;
    const absurdity = Math.abs(over) / Math.sqrt(Math.max(variance, 0.4));
    delta += direction * capped;

    actions.push({
      playerId: player.id,
      teamId: team.id,
      stat: scenario.stat,
      value: Number(scenario.value),
      baseline,
      over,
      absOver: Math.abs(over),
      absurdity,
      name: `${player.name} ${scenario.value} ${statLabels[scenario.stat]}`,
      cnName: `${player.cnName} ${scenario.value} ${statLabels[scenario.stat]}`,
      joke: player.joke,
      cnJoke: player.cnJoke,
      avatar: player.avatar,
      image: player.image,
      fallbackImage: player.fallbackImage,
      delta: direction * capped
    });
  }

  const newMargin = baseMargin + clamp(delta, -config.cap * 1.35, config.cap * 1.35);
  const leftWin = clamp(marginToProbability(newMargin), config.floor, config.ceiling);
  const heroAction = actions.find((item) => item.teamId === (leftWin >= 50 ? left.id : right.id)) ?? actions[0];
  const todayHero = actions.reduce((best, action) => {
    if (!best) return action;
    if (action.absOver > best.absOver) return action;
    return action;
  }, null);
  const absurdityScore = clamp(
    Math.round(actions.reduce((sum, action) => sum + action.absurdity, 0) * 13),
    0,
    100
  );

  return {
    id: makePredictionId(left, right, mode, scenarios),
    title: heroAction ? heroAction.name : "No pick yet",
    cnTitle: heroAction ? heroAction.cnName : "还没操作",
    description: describePrediction(leftWin, baseLeftWin, left, right),
    cnDescription: describePrediction(leftWin, baseLeftWin, left, right, "zh"),
    leftWin,
    baseLeftWin,
    actions: actions.slice(0, 8),
    heroAction,
    todayHero,
    absurdityScore,
    chaosScore: clamp(Math.abs(leftWin - baseLeftWin) / 42 + config.multiplier / 3, 0.2, 1)
  };
}

function makeVariance(stats, baseline, role) {
  const roleBoost = role === "superstar" ? 1.22 : role === "star" ? 1.08 : role === "bench" ? 0.82 : 1;
  return Object.fromEntries(
    stats.map((stat) => {
      const base = playoffVariance[stat] ?? Math.max(1, baseline[stat] * 0.45);
      return [stat, Number((base * roleBoost).toFixed(2))];
    })
  );
}

function probabilityToMargin(probability) {
  const p = clamp(probability / 100, 0.01, 0.99);
  return Math.log(p / (1 - p)) / 0.135;
}

function marginToProbability(margin) {
  return (1 / (1 + Math.exp(-0.135 * margin))) * 100;
}

function describePrediction(leftWin, baseLeftWin, left, right, language = "en") {
  const shift = leftWin - baseLeftWin;
  const winner = leftWin >= 50 ? left : right;
  const winnerName = language === "zh" ? winner.cnName : winner.name;
  if (language === "zh") {
    return `${winnerName} 当前胜率 ${Math.round(winner.id === left.id ? leftWin : 100 - leftWin)}%，相比赛前${Math.abs(shift).toFixed(1)} 个百分点变化。`;
  }
  return `${winnerName} is at ${Math.round(winner.id === left.id ? leftWin : 100 - leftWin)}%, a ${Math.abs(shift).toFixed(1)} point move from pregame.`;
}

function makePredictionId(left, right, mode, scenarios) {
  const token = scenarios
    .slice(0, 3)
    .map((scenario) => `${scenario.playerId.slice(0, 3)}${scenario.value}${scenario.stat}`)
    .join("-");
  return `${left.short}-${right.short}-${mode}-${token}`.toUpperCase();
}

function makeSticker(emoji, label, role) {
  const bg = role === "superstar" ? "#fef3c7" : role === "star" ? "#ffedd5" : "#dcfce7";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect x="8" y="8" width="160" height="160" rx="18" fill="${bg}" stroke="#111827" stroke-width="8"/>
  <circle cx="90" cy="84" r="58" fill="#fff" stroke="#111827" stroke-width="6"/>
  <text x="90" y="104" text-anchor="middle" font-size="58">${emoji}</text>
  <rect x="52" y="134" width="76" height="30" rx="15" fill="#fff" stroke="#111827" stroke-width="5"/>
  <text x="90" y="155" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" font-weight="900" fill="#111827">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
