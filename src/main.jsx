import React from "react";
import { createRoot } from "react-dom/client";
import {
  ActionIcon,
  Button,
  MantineProvider,
  Select,
  Slider
} from "@mantine/core";
import { ArrowLeft, Download, Languages, RefreshCcw, Sparkles, Wand2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";
import "@mantine/core/styles.css";
import { MultiverseCanvas } from "./MultiverseCanvas.jsx";
import {
  TEAMS,
  buildUniverse,
  getDefaultScenarios,
  getPresetValue,
  statLabels
} from "./universeEngine.js";
import "./styles.css";

const copy = {
  zh: {
    homeEyebrow: "NBA Finals What-if",
    homeTitle: "先站队，再写你的离谱剧本。",
    homeBody: "这里不是下注页。你选球员、拉数据、生成一张球迷预测卡。",
    choose: "选这个主队",
    enterHint: "下一步：进入 What-if 编辑器",
    editorEyebrow: "What-if 编辑器",
    editHint: "先别看胜率，先把你的剧本调爽。",
    generate: "生成我的预测",
    editedCount: "已改球员",
    resultEyebrow: "预测结果",
    resultTitle: "你的剧本生成好了。",
    continueEdit: "继续改剧本",
    reset: "重置",
    download: "分享/下载卡",
    back: "换主队",
    liveOdds: "赛前胜率",
    fanTeam: "你的主队",
    opponent: "对手",
    teamA: "主队",
    teamB: "对手",
    universeId: "预测卡编号",
    margin: "分差影响",
    shift: "变化",
    posterKicker: "我的 Finals What-if",
    finalWin: "最终胜率",
    baseWin: "赛前",
    cardNote: "球迷预测卡，不是下注建议",
    memeRail: "球迷梗参考",
    pregame: "赛前预测",
    revealAfterGenerate: "胜率会在生成后出现",
    absurdity: "离谱指数",
    todayHero: "今日主角",
    changedStats: "改动数据",
    noHero: "等你开改"
  },
  en: {
    homeEyebrow: "NBA Finals What-if",
    homeTitle: "Pick a side. Write a ridiculous script.",
    homeBody: "Not a betting page. Pick players, push stats, make a fan prediction card.",
    choose: "Choose this side",
    enterHint: "Next: enter the What-if editor",
    editorEyebrow: "What-if editor",
    editHint: "No win chance yet. Make the script fun first.",
    generate: "Generate my prediction",
    editedCount: "players edited",
    resultEyebrow: "Prediction result",
    resultTitle: "Your script is ready.",
    continueEdit: "Keep editing",
    reset: "Reset",
    download: "Share / download",
    back: "Switch side",
    liveOdds: "Pregame win chance",
    fanTeam: "Your side",
    opponent: "Opponent",
    teamA: "Home side",
    teamB: "Opponent",
    universeId: "Card ID",
    margin: "margin impact",
    shift: "shift",
    posterKicker: "My Finals What-if",
    finalWin: "Final win chance",
    baseWin: "Pregame",
    cardNote: "Fan prediction card, not betting advice",
    memeRail: "Fan joke notes",
    pregame: "Pregame prediction",
    revealAfterGenerate: "Win chance appears after generation",
    absurdity: "Absurdity index",
    todayHero: "Main character",
    changedStats: "Edited stats",
    noHero: "waiting for edits"
  }
};

const roleLabels = {
  zh: {
    superstar: "王牌",
    star: "核心",
    starter: "首发",
    bench: "替补"
  },
  en: {
    superstar: "superstar",
    star: "star",
    starter: "starter",
    bench: "bench"
  }
};

function App() {
  const [teams, setTeams] = React.useState(TEAMS);
  const [leftTeam, setLeftTeam] = React.useState(TEAMS[0].id);
  const [rightTeam, setRightTeam] = React.useState(TEAMS[1].id);
  const [fanTeam, setFanTeam] = React.useState(null);
  const [language, setLanguage] = React.useState("zh");
  const [scenarios, setScenarios] = React.useState(() =>
    getDefaultScenarios(TEAMS[0].id, TEAMS[1].id)
  );
  const [market, setMarket] = React.useState(null);
  const [touchedPlayerIds, setTouchedPlayerIds] = React.useState([]);
  const [shareAction, setShareAction] = React.useState(null);
  const [showResult, setShowResult] = React.useState(false);
  const posterRef = React.useRef(null);
  const t = copy[language];

  const [initialLeft, initialRight] = teams;
  const left = teams.find((team) => team.id === leftTeam);
  const right = teams.find((team) => team.id === rightTeam);
  const universe = buildUniverse(left, right, scenarios, "standard");
  const editedPlayerIds = React.useMemo(
    () => getEditedPlayerIds(scenarios, left, right),
    [scenarios, left, right]
  );

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadMarket() {
      try {
        const response = await fetch(`/api/matchups/${leftTeam}/${rightTeam}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Market unavailable");
        const data = await response.json();
        setMarket(data.market);
        setTeams((current) =>
          current.map((team) => {
            if (team.id === data.left.id) return { ...team, baseWin: data.left.winChance };
            if (team.id === data.right.id) return { ...team, baseWin: data.right.winChance };
            return team;
          })
        );
      } catch (error) {
        if (error.name !== "AbortError") setMarket(null);
      }
    }

    loadMarket();
    return () => controller.abort();
  }, [leftTeam, rightTeam]);

  function resetUniverse() {
    setScenarios(getDefaultScenarios(left.id, right.id));
    setTouchedPlayerIds([]);
    setShareAction(null);
    setShowResult(false);
  }

  function changeTeam(side, teamId) {
    const opponent = TEAMS.find((team) => team.id !== teamId);
    setLeftTeam(teamId);
    setRightTeam(opponent.id);
    setFanTeam(teamId);
    setScenarios(getDefaultScenarios(teamId, opponent.id));
    setTouchedPlayerIds([]);
    setShareAction(null);
    setShowResult(false);
  }

  function enterUniverse(teamId) {
    const opponent = TEAMS.find((team) => team.id !== teamId);
    setFanTeam(teamId);
    setLeftTeam(teamId);
    setRightTeam(opponent.id);
    setScenarios(getDefaultScenarios(teamId, opponent.id));
    setTouchedPlayerIds([]);
    setShareAction(null);
    setShowResult(false);
  }

  function touchPlayer(playerId) {
    setShowResult(false);
    setShareAction(null);
    setTouchedPlayerIds((current) => (
      current.includes(playerId) ? current : [...current, playerId]
    ));
  }

  function generatePrediction() {
    const nextShareAction = pickShareAction(universe.actions, editedPlayerIds, universe.todayHero ?? universe.heroAction);
    setShareAction(nextShareAction);
    setShowResult(true);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  async function downloadPoster() {
    if (!posterRef.current) return;
    if (!shareAction) {
      setShareAction(pickShareAction(universe.actions, editedPlayerIds, universe.todayHero ?? universe.heroAction));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    const dataUrl = await toPng(posterRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#fff8e8"
    });
    const blob = await fetch(dataUrl).then((response) => response.blob());
    const file = new File([blob], `${universe.id}.png`, { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: universe.id,
        text: language === "zh" ? "我的 Finals What-if 预测卡" : "My Finals What-if prediction card"
      });
      return;
    }

    const link = document.createElement("a");
    link.download = `${universe.id}.png`;
    link.href = dataUrl;
    link.click();
  }

  if (!fanTeam) {
    return (
      <main>
        <MultiverseCanvas
          leftColor={initialLeft.colors.primary}
          rightColor={initialRight.colors.primary}
          intensity={0.72}
        />
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <section className="shell landingShell">
          <div className="landingIntro">
            <p className="eyebrow">{t.homeEyebrow}</p>
            <h1>{t.homeTitle}</h1>
            <p>{t.homeBody}</p>
          </div>
          <div className="pickArena">
            {TEAMS.slice(0, 2).map((team) => (
              <motion.button
                className="pickCard"
                key={team.id}
                onClick={() => enterUniverse(team.id)}
                style={{ "--team-gradient": team.colors.gradient, "--team-color": team.colors.primary }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
              >
                <span className="pickOrb">{team.short}</span>
                <span>
                  <b>{language === "zh" ? team.cnName : team.name}</b>
                  <em>{language === "zh" ? team.cnVibe : team.vibe}</em>
                </span>
                <strong>{t.choose}</strong>
              </motion.button>
            ))}
          </div>
          <p className="enterHint">{t.enterHint}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <MultiverseCanvas
        leftColor={left.colors.primary}
        rightColor={right.colors.primary}
        intensity={universe.chaosScore}
      />
      <LanguageToggle language={language} setLanguage={setLanguage} />
      <section className="shell">
        <header className="topbar">
          <div>
            <p className="eyebrow editorEyebrow">{t.editorEyebrow}</p>
            <h1>
              {language === "zh"
                ? `改写 ${left.cnName} 的剧本`
                : `Rewrite the ${left.name} timeline`}
            </h1>
            <p className="editorHint">{t.editHint}</p>
          </div>
          <div className="actions">
            <Button className="ghostButton" variant="light" leftSection={<ArrowLeft size={18} />} onClick={() => setFanTeam(null)}>
              {t.back}
            </Button>
            <ActionIcon className="iconButton" variant="light" onClick={resetUniverse} title={t.reset} aria-label={t.reset}>
              <RefreshCcw size={18} />
            </ActionIcon>
          </div>
        </header>

        {showResult ? (
          <ResultPanel
            left={left}
            right={right}
            universe={universe}
            shareAction={shareAction}
            touchedCount={editedPlayerIds.length}
            onEdit={() => setShowResult(false)}
            onDownload={downloadPoster}
            language={language}
            labels={t}
          />
        ) : (
          <>
            <PregameStrip left={left} right={right} labels={t} language={language} />
            <section className="editStatus">
              <span><Wand2 size={16} />{t.editedCount}: {editedPlayerIds.length}</span>
              <span><Sparkles size={16} />{t.absurdity}: {universe.absurdityScore}</span>
              <b>{t.todayHero}: {formatHeroName(universe.todayHero, language, t)}</b>
            </section>
            <section className="workbench">
              <TeamPanel
                side="left"
                team={left}
                selectedTeam={leftTeam}
                opponentTeam={rightTeam}
                onTeamChange={changeTeam}
                scenarios={scenarios}
                setScenarios={setScenarios}
                onTouchPlayer={touchPlayer}
                language={language}
                labels={{ side: t.teamA, fanTeam: t.fanTeam }}
              />
            </section>
            <div className="generateDock">
              <Button className="generateButton" variant="filled" leftSection={<Sparkles size={18} />} onClick={generatePrediction}>
                {t.generate}
              </Button>
            </div>
          </>
        )}

        <SharePoster
          ref={posterRef}
          left={left}
          right={right}
          universe={universe}
          scenarios={scenarios}
          language={language}
          labels={t}
          shareAction={shareAction}
        />
      </section>
    </main>
  );
}

function getEditedPlayerIds(scenarios, left, right) {
  return [
    ...new Set(
      scenarios
        .filter((scenario) => {
          const team = scenario.teamId === left.id ? left : right;
          const player = team.players.find((item) => item.id === scenario.playerId);
          return player && Number(scenario.value) !== player.baseline[scenario.stat];
        })
        .map((scenario) => scenario.playerId)
    )
  ];
}

function formatHeroName(action, language, labels) {
  if (!action) return labels.noHero;
  return language === "zh" ? action.cnName.split(" ").slice(0, -2).join(" ") || action.cnName : action.name.split(" ").slice(0, -2).join(" ") || action.name;
}

function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="languageToggle" aria-label="Language">
      <Languages size={16} />
      <button className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>
        中文
      </button>
      <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
        EN
      </button>
    </div>
  );
}

function TeamScore({ team, value, previous, label }) {
  const delta = value - previous;
  return (
    <div className="teamScore" style={{ "--accent": team.colors.primary }}>
      <span>{team.short}</span>
      <strong>{Math.round(value)}%</strong>
      <em>{delta >= 0 ? "+" : ""}{delta.toFixed(1)} {label}</em>
    </div>
  );
}

function PregameStrip({ left, right, labels, language }) {
  const leftLabel = language === "zh" ? left.cnName : left.name;
  const rightLabel = language === "zh" ? right.cnName : right.name;

  return (
    <section className="pregameStrip" aria-label="Pregame win chance">
      <div>
        <span>{labels.pregame}</span>
        <strong>{left.short} {Math.round(left.baseWin)}%</strong>
        <em>{leftLabel}</em>
      </div>
      <div className="pregameMeter">
        <i style={{ width: `${left.baseWin}%`, background: left.colors.gradient }} />
        <i style={{ width: `${100 - left.baseWin}%`, background: right.colors.gradient }} />
      </div>
      <div>
        <span>{labels.pregame}</span>
        <strong>{right.short} {Math.round(100 - left.baseWin)}%</strong>
        <em>{rightLabel}</em>
      </div>
    </section>
  );
}

function pickShareAction(actions, touchedPlayerIds, fallbackAction) {
  const touchedActions = actions.filter((action) => touchedPlayerIds.includes(action.playerId));
  const pool = touchedActions.length > 0 ? touchedActions : actions;
  if (pool.length === 0) return fallbackAction ?? null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function TeamPanel({
  side,
  team,
  selectedTeam,
  opponentTeam,
  onTeamChange,
  scenarios,
  setScenarios,
  onTouchPlayer,
  language,
  labels
}) {
  const teamScenarios = scenarios.filter((scenario) => scenario.teamId === team.id);

  function updateScenario(playerId, stat, value) {
    onTouchPlayer(playerId);
    setScenarios((current) => {
      const exists = current.some((scenario) => scenario.playerId === playerId && scenario.stat === stat);
      if (!exists) {
        return [...current, { teamId: team.id, playerId, stat, value }];
      }
      return current.map((scenario) =>
        scenario.playerId === playerId && scenario.stat === stat
          ? { ...scenario, value: Number(value) }
          : scenario
      );
    });
  }

  function quickAdd(player, stat) {
    updateScenario(player.id, stat, getPresetValue(player, stat));
  }

  return (
    <aside className="teamPanel">
      <div className="panelHeader">
        <span>{labels.side}</span>
        <Select
          className="teamSelect"
          value={selectedTeam}
          onChange={(value) => value && onTeamChange(side, value)}
          data={TEAMS.map((option) => ({
            value: option.id,
            label: language === "zh" ? option.cnName : option.name,
            disabled: option.id === opponentTeam
          }))}
          allowDeselect={false}
        />
      </div>
      <div className="teamIdentity">
        <div className="logoOrb" style={{ background: team.colors.gradient }}>{team.short}</div>
        <div>
          <span className="sideBadge">{labels.fanTeam}</span>
          <h2>{language === "zh" ? team.cnName : team.name}</h2>
          <p>{language === "zh" ? team.cnVibe : team.vibe}</p>
        </div>
      </div>
      <div className="roster">
        {team.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            activeScenarios={teamScenarios.filter((scenario) => scenario.playerId === player.id)}
            onQuickAdd={quickAdd}
            onUpdate={updateScenario}
            language={language}
          />
        ))}
      </div>
    </aside>
  );
}

function PlayerCard({ player, activeScenarios, onQuickAdd, onUpdate, language }) {
  const [expanded, setExpanded] = React.useState(player.role === "superstar");
  const [imageSrc, setImageSrc] = React.useState(player.image);
  const activeByStat = Object.fromEntries(activeScenarios.map((scenario) => [scenario.stat, scenario.value]));

  React.useEffect(() => {
    setImageSrc(player.image);
  }, [player.image]);

  return (
    <motion.article className={`playerCard ${expanded ? "isExpanded" : ""}`} layout>
      <button className="playerTop" onClick={() => setExpanded((value) => !value)}>
        <span className="playerAvatar" aria-hidden="true">
          <img
            src={imageSrc}
            alt=""
            onError={() =>
              setImageSrc((current) =>
                current === player.image
                  ? player.fallbackImage
                  : current === player.fallbackImage
                    ? player.headshotImage
                    : player.stickerImage
              )
            }
          />
          <small>{player.number}</small>
        </span>
        <span>
          <strong>{language === "zh" ? player.cnName : player.name}</strong>
          <em>{language === "zh" ? player.cnJoke : player.joke}</em>
        </span>
        <b>{roleLabels[language][player.role]}</b>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="playerControls"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="chips">
              {player.signature.map((sig) => (
                <Button
                  key={sig.stat}
                  className="chipButton"
                  size="compact-sm"
                  variant="light"
                  leftSection={<Zap size={13} />}
                  onClick={() => onQuickAdd(player, sig.stat)}
                >
                  {language === "zh" ? sig.cnLabel : sig.label}
                </Button>
              ))}
            </div>
            {player.stats.map((stat) => {
              const value = activeByStat[stat] ?? player.baseline[stat];
              return (
                <div className="statControl" key={stat}>
                  <span>
                    {statLabels[stat]}
                    {stat === "tov" ? (
                      <small>{language === "zh" ? "越少越好" : "lower is better"}</small>
                    ) : null}
                    <b>{value}</b>
                  </span>
                  <Slider
                    min={0}
                    max={stat === "pts" ? 65 : stat === "ast" ? 22 : 18}
                    value={value}
                    onChange={(nextValue) => onUpdate(player.id, stat, nextValue)}
                    color="orange"
                    size="sm"
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ResultPanel({
  left,
  right,
  universe,
  shareAction,
  touchedCount,
  onEdit,
  onDownload,
  language,
  labels
}) {
  const posterAction = shareAction ?? universe.heroAction;
  const actionLines = universe.actions.slice(0, 5);

  return (
    <section className="resultPanel">
      <div className="resultIntro">
        <p className="eyebrow editorEyebrow">{labels.resultEyebrow}</p>
        <h2>{labels.resultTitle}</h2>
        <p>
          {language === "zh"
            ? `你改了 ${touchedCount} 个球员。最终胜率现在才揭晓。`
            : `You edited ${touchedCount} players. The win chance reveals now.`}
        </p>
      </div>

      <div className="resultHero">
        <div className="resultImage">
          {posterAction?.image ? <img src={posterAction.image} alt="" /> : <span>🏀</span>}
        </div>
        <div className="resultCopy">
          <span>{labels.posterKicker}</span>
          <h3>{posterAction ? (language === "zh" ? posterAction.cnName : posterAction.name) : (language === "zh" ? universe.cnTitle : universe.title)}</h3>
          <p>{language === "zh" ? universe.cnDescription : universe.description}</p>
          <div className="resultMeta">
            <b>{labels.absurdity}: {universe.absurdityScore}</b>
            <b>{labels.todayHero}: {formatHeroName(universe.todayHero, language, labels)}</b>
          </div>
        </div>
      </div>

      <section className="scoreboard resultScoreboard" aria-label="Win probability">
        <TeamScore team={left} value={universe.leftWin} previous={universe.baseLeftWin} label={labels.shift} />
        <div className="meterWrap">
          <div className="meter">
            <motion.div
              className="meterLeft"
              animate={{ width: `${universe.leftWin}%` }}
              style={{ background: left.colors.gradient }}
            />
            <motion.div
              className="meterRight"
              animate={{ width: `${100 - universe.leftWin}%` }}
              style={{ background: right.colors.gradient }}
            />
          </div>
          <div className="oddsTicker">
            <Sparkles size={15} />
            {labels.liveOdds}: {Math.round(universe.baseLeftWin)}% /{" "}
            {Math.round(100 - universe.baseLeftWin)}%
          </div>
        </div>
        <TeamScore
          team={right}
          value={100 - universe.leftWin}
          previous={100 - universe.baseLeftWin}
          label={labels.shift}
        />
      </section>

      <div className="resultActionsList">
        {actionLines.map((action) => (
          <span key={`${action.playerId}-${action.name}`}>
            <i>{action.avatar}</i>{formatActionLine(action, language)}
          </span>
        ))}
      </div>

      <div className="resultButtons">
        <Button className="ghostButton" variant="light" leftSection={<ArrowLeft size={18} />} onClick={onEdit}>
          {labels.continueEdit}
        </Button>
        <Button className="downloadButton" variant="filled" leftSection={<Download size={18} />} onClick={onDownload}>
          {labels.download}
        </Button>
      </div>
    </section>
  );
}

const SharePoster = React.forwardRef(function SharePoster(
  { left, right, universe, scenarios, language, labels, shareAction },
  ref
) {
  const posterAction = shareAction ?? universe.todayHero ?? universe.heroAction;
  const topScenarios = universe.actions.slice(0, 6).map((action) => ({
    line: formatActionLine(action, language),
    avatar: action.avatar
  }));
  const leftLabel = language === "zh" ? left.cnName : left.name;
  const rightLabel = language === "zh" ? right.cnName : right.name;
  const posterJoke = posterAction
    ? (language === "zh" ? posterAction.cnJoke : posterAction.joke)
    : (language === "zh" ? "球迷剧本生成中" : "fan script loading");

  return (
    <section className="posterStage" aria-label="Downloadable prediction poster">
      <div className="poster" ref={ref}>
        <div className="posterHeroImage">
          {posterAction?.image ? <img src={posterAction.image} alt="" /> : <span>🏀</span>}
          <div className="posterImageTag">
            <b>{posterAction?.avatar ?? "🏀"}</b>
            <span>{posterJoke}</span>
          </div>
        </div>
        <div className="posterBody">
          <p className="posterKicker">{labels.posterKicker}</p>
          <h2>{posterAction ? (language === "zh" ? posterAction.cnName : posterAction.name) : (language === "zh" ? universe.cnTitle : universe.title)}</h2>
          <div className="posterPlayerIntro">
            <span>{language === "zh" ? "球员梗设定" : "player bit"}</span>
            <strong>{posterJoke}</strong>
          </div>
          <div className="posterScores">
            <div>
              <span>{leftLabel}</span>
              <strong>{Math.round(universe.leftWin)}%</strong>
              <em>{labels.baseWin} {Math.round(universe.baseLeftWin)}%</em>
            </div>
            <div>
              <span>{rightLabel}</span>
              <strong>{Math.round(100 - universe.leftWin)}%</strong>
              <em>{labels.baseWin} {Math.round(100 - universe.baseLeftWin)}%</em>
            </div>
          </div>
          <div className="posterMeta">
            <span>{labels.absurdity}: <b>{universe.absurdityScore}</b></span>
            <span>{labels.todayHero}: <b>{formatHeroName(universe.todayHero, language, labels)}</b></span>
          </div>
        </div>
        <div className="posterGrid">
          {topScenarios.length > 0 ? topScenarios.map((item) => (
            <span key={item.line}><i>{item.avatar}</i>{item.line}</span>
          )) : (
            <span><i>🏀</i>{language === "zh" ? "还没改球员数据" : "No player edits yet"}</span>
          )}
        </div>
        <footer>
          <b>{labels.cardNote}</b>
          <em>{universe.id}</em>
        </footer>
      </div>
    </section>
  );
});

function formatActionLine(action, language) {
  const playerName = language === "zh"
    ? action.cnName.replace(` ${action.value} ${statLabels[action.stat]}`, "")
    : action.name.replace(` ${action.value} ${statLabels[action.stat]}`, "");
  const baseline = Number(action.baseline).toFixed(action.baseline % 1 === 0 ? 0 : 1);
  if (action.stat === "tov") {
    const absTurnovers = Math.abs(action.over);
    const turnoverText = language === "zh"
      ? action.over > 0
        ? `多失误 ${absTurnovers} 次`
        : `少失误 ${absTurnovers} 次`
      : action.over > 0
        ? `${absTurnovers} more turnovers`
        : `${absTurnovers} fewer turnovers`;
    return `${playerName} ${statLabels[action.stat]} ${baseline} → ${action.value} (${turnoverText})`;
  }
  const sign = action.over > 0 ? "+" : "";
  return `${playerName} ${statLabels[action.stat]} ${baseline} → ${action.value} (${sign}${action.over})`;
}

createRoot(document.getElementById("root")).render(
  <MantineProvider defaultColorScheme="light">
    <App />
  </MantineProvider>
);
