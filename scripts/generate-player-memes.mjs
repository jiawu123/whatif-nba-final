import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/universeEngine.js"), "utf8");
const outDir = path.join(root, "public/player-memes");

fs.mkdirSync(outDir, { recursive: true });

const players = [...source.matchAll(
  /player\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g
)].map((match) => ({
  id: match[1],
  name: match[2],
  cnName: match[3],
  number: match[4],
  role: match[5],
  joke: match[6],
  cnJoke: match[7],
  emoji: match[8]
}));

const palettes = [
  ["#fde68a", "#60a5fa", "#fb923c"],
  ["#bbf7d0", "#f472b6", "#38bdf8"],
  ["#fed7aa", "#a78bfa", "#22c55e"],
  ["#fecdd3", "#facc15", "#2563eb"],
  ["#cffafe", "#fb7185", "#84cc16"]
];

const roleSticker = {
  superstar: { tag: "主角剧本", accessory: "crown" },
  star: { tag: "热搜预定", accessory: "glasses" },
  starter: { tag: "今天加戏", accessory: "googly" },
  bench: { tag: "替补盲盒", accessory: "party" }
};

for (const [index, player] of players.entries()) {
  const imagePath = path.join(root, "public/player-images", `${player.id}.png`);
  if (!fs.existsSync(imagePath)) continue;

  const [paper, pop, accent] = palettes[index % palettes.length];
  const encodedImage = fs.readFileSync(imagePath).toString("base64");
  const sticker = roleSticker[player.role] ?? roleSticker.bench;
  const svg = makeSvg({
    ...player,
    image: `data:image/png;base64,${encodedImage}`,
    paper,
    pop,
    accent,
    sticker,
    index
  });

  fs.writeFileSync(path.join(outDir, `${player.id}.svg`), svg);
}

console.log(`Generated ${players.length} player meme images in ${outDir}`);

function makeSvg(player) {
  const shortJoke = player.cnJoke.length > 10 ? `${player.cnJoke.slice(0, 10)}...` : player.cnJoke;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
  <defs>
    <clipPath id="cardClip${player.index}">
      <rect x="26" y="26" width="308" height="308" rx="24"/>
    </clipPath>
    <filter id="pop${player.index}" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="1.35"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.05"/>
        <feFuncG type="linear" slope="1.03"/>
        <feFuncB type="linear" slope="1.08"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect x="12" y="12" width="324" height="324" rx="28" fill="${player.paper}" stroke="#111827" stroke-width="12"/>
  <g clip-path="url(#cardClip${player.index})">
    <rect width="360" height="360" fill="${player.paper}"/>
    <path d="M-15 91 L376 6 L380 93 L-8 170 Z" fill="${player.pop}" opacity=".9"/>
    <path d="M-20 250 L380 165 L380 250 L-4 338 Z" fill="${player.accent}" opacity=".78"/>
    <circle cx="50" cy="62" r="18" fill="#fff" stroke="#111827" stroke-width="6"/>
    <circle cx="306" cy="76" r="24" fill="#fff" stroke="#111827" stroke-width="6"/>
    <text x="306" y="84" text-anchor="middle" font-size="25">${escapeXml(player.emoji)}</text>
    <image href="${player.image}" x="-30" y="36" width="420" height="300" preserveAspectRatio="xMidYMid slice" filter="url(#pop${player.index})"/>
    ${accessory(player.sticker.accessory)}
    <rect x="24" y="244" width="312" height="50" rx="16" fill="#fff" stroke="#111827" stroke-width="7" transform="rotate(-3 180 269)"/>
    <text x="180" y="277" text-anchor="middle" font-size="27" font-family="Arial, PingFang SC, sans-serif" font-weight="900" fill="#111827">${escapeXml(player.cnName)}</text>
    <rect x="46" y="296" width="268" height="38" rx="19" fill="#111827"/>
    <text x="180" y="321" text-anchor="middle" font-size="18" font-family="Arial, PingFang SC, sans-serif" font-weight="900" fill="#fff">${escapeXml(shortJoke)}</text>
    <rect x="250" y="24" width="64" height="38" rx="10" fill="#fff" stroke="#111827" stroke-width="6" transform="rotate(8 282 43)"/>
    <text x="282" y="50" text-anchor="middle" font-size="19" font-family="Arial, sans-serif" font-weight="900" fill="#111827">#${escapeXml(player.number)}</text>
    <rect x="25" y="190" width="128" height="38" rx="12" fill="#fde047" stroke="#111827" stroke-width="6" transform="rotate(-10 89 209)"/>
    <text x="89" y="215" text-anchor="middle" font-size="18" font-family="Arial, PingFang SC, sans-serif" font-weight="900" fill="#111827">${player.sticker.tag}</text>
  </g>
</svg>`;
}

function accessory(type) {
  if (type === "crown") {
    return `<path d="M116 62 L142 24 L171 61 L202 24 L228 63 L228 93 L116 93 Z" fill="#facc15" stroke="#111827" stroke-width="7"/>
    <circle cx="142" cy="24" r="8" fill="#fb7185" stroke="#111827" stroke-width="5"/>
    <circle cx="202" cy="24" r="8" fill="#60a5fa" stroke="#111827" stroke-width="5"/>`;
  }
  if (type === "glasses") {
    return `<rect x="102" y="96" width="62" height="30" rx="8" fill="#111827"/>
    <rect x="196" y="96" width="62" height="30" rx="8" fill="#111827"/>
    <path d="M164 110 C178 103 183 103 196 110" fill="none" stroke="#111827" stroke-width="9" stroke-linecap="round"/>
    <path d="M116 100 L148 124 M210 100 L242 124" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>`;
  }
  if (type === "googly") {
    return `<circle cx="137" cy="106" r="20" fill="#fff" stroke="#111827" stroke-width="6"/>
    <circle cx="214" cy="106" r="20" fill="#fff" stroke="#111827" stroke-width="6"/>
    <circle cx="145" cy="113" r="8" fill="#111827"/>
    <circle cx="206" cy="101" r="8" fill="#111827"/>`;
  }
  return `<path d="M112 64 L151 22 L188 92 Z" fill="#fb7185" stroke="#111827" stroke-width="7"/>
  <circle cx="151" cy="22" r="10" fill="#fff" stroke="#111827" stroke-width="5"/>
  <path d="M112 64 C135 78 158 82 188 92" fill="none" stroke="#facc15" stroke-width="9"/>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
