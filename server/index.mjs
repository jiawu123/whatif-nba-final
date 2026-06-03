import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEAMS, buildUniverse, modes } from "../src/universeEngine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "nba-final-prediction-api",
    time: new Date().toISOString()
  });
});

app.get("/api/teams", (req, res) => {
  res.json({
    teams: TEAMS.map(toPublicTeam)
  });
});

app.get("/api/matchups/:leftTeamId/:rightTeamId", (req, res) => {
  const matchup = getMatchup(req.params.leftTeamId, req.params.rightTeamId);
  if (!matchup) {
    return res.status(404).json({ error: "Unknown matchup" });
  }

  res.json(matchup);
});

app.post("/api/predictions", (req, res) => {
  const { leftTeamId, rightTeamId, scenarios = [], mode = "standard" } = req.body ?? {};
  const matchup = getMatchup(leftTeamId, rightTeamId);
  if (!matchup) {
    return res.status(404).json({ error: "Unknown matchup" });
  }

  if (!modes.some((item) => item.id === mode)) {
    return res.status(400).json({ error: "Unknown mode" });
  }

  const left = withWinChance(findTeam(leftTeamId), matchup.left.winChance);
  const right = withWinChance(findTeam(rightTeamId), matchup.right.winChance);

  res.json({
    prediction: buildUniverse(left, right, sanitizeScenarios(scenarios), mode),
    market: matchup.market
  });
});

app.use(express.static(distDir));
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`NBA prediction backend listening on http://localhost:${port}`);
});

function getMatchup(leftTeamId, rightTeamId) {
  const left = findTeam(leftTeamId);
  const right = findTeam(rightTeamId);
  if (!left || !right || left.id === right.id) return null;

  const market = buildDemoMarket(left, right);
  return {
    left: {
      ...toPublicTeam(left),
      winChance: market.leftWin
    },
    right: {
      ...toPublicTeam(right),
      winChance: 100 - market.leftWin
    },
    market
  };
}

function buildDemoMarket(left, right) {
  const bucket = Math.floor(Date.now() / (1000 * 60 * 10));
  const drift = seededNoise(`${left.id}-${right.id}-${bucket}`) * 4;
  const leftWin = clamp(left.baseWin + drift, 3, 97);
  const providerWinChances = [
    leftWin,
    clamp(leftWin + seededNoise(`${left.id}-market-a-${bucket}`) * 2.5, 3, 97),
    clamp(leftWin + seededNoise(`${left.id}-market-b-${bucket}`) * 2.5, 3, 97)
  ];
  const consensus = average(providerWinChances);

  return {
    source: "demo-consensus",
    note: "Seeded demo market. Replace providers when a licensed odds API is ready.",
    updatedAt: new Date().toISOString(),
    refreshSeconds: 600,
    leftWin: round(consensus, 1),
    rightWin: round(100 - consensus, 1),
    providers: providerWinChances.map((chance, index) => ({
      id: `demo-${index + 1}`,
      name: ["Market Pulse", "Line Lab", "Fan Board"][index],
      leftWin: round(chance, 1),
      rightWin: round(100 - chance, 1)
    }))
  };
}

function findTeam(teamId) {
  return TEAMS.find((team) => team.id === teamId);
}

function withWinChance(team, winChance) {
  return {
    ...team,
    baseWin: winChance
  };
}

function toPublicTeam(team) {
  return {
    id: team.id,
    name: team.name,
    cnName: team.cnName,
    short: team.short,
    baseWin: team.baseWin
  };
}

function sanitizeScenarios(scenarios) {
  if (!Array.isArray(scenarios)) return [];
  return scenarios.slice(0, 12).map((scenario) => ({
    teamId: String(scenario.teamId ?? ""),
    playerId: String(scenario.playerId ?? ""),
    stat: String(scenario.stat ?? ""),
    value: Number(scenario.value ?? 0)
  }));
}

function seededNoise(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295 - 0.5;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
