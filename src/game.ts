import { EVENTS, type EventCard } from "./events";

export type Resources = {
  cash: number;
  progress: number;
  stress: number;
  rep: number;
};

export type GameOverReason = "cash" | "stress";

export type GameMode = "classic" | "daily";

export type GameState = {
  mode: GameMode;
  dateKey: string; // yyyymmdd (used for daily)
  turn: number;
  timePerTurnSec: number;
  resources: Resources;
  card: EventCard;
  bestTurns: number;
  dailyBestTurns: number;
  over: boolean;
  overReason?: GameOverReason;
  rng: () => number;
};

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const defaultResources = (): Resources => ({
  cash: 55,
  progress: 35,
  stress: 30,
  rep: 40,
});

// --- Random helpers (seeded for Daily Challenge) ---
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function yyyymmdd(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function seedFromString(s: string): number {
  // Simple stable hash → 32-bit seed
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickCard(prevId?: string, rng: () => number = Math.random): EventCard {
  if (EVENTS.length === 0) throw new Error("No events");
  for (let i = 0; i < 6; i++) {
    const c = EVENTS[Math.floor(rng() * EVENTS.length)];
    if (c.id !== prevId) return c;
  }
  return EVENTS[Math.floor(rng() * EVENTS.length)];
}

const BEST_KEY = "ss20_best_turns";
const DAILY_KEY_PREFIX = "ss20_daily_best_";

export function loadBestTurns(): number {
  const raw = localStorage.getItem(BEST_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function saveBestTurns(turns: number) {
  localStorage.setItem(BEST_KEY, String(turns));
}

export function dailyKey(date: string) {
  return `${DAILY_KEY_PREFIX}${date}`;
}

export function loadDailyBest(date: string): number {
  const raw = localStorage.getItem(dailyKey(date));
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function saveDailyBest(date: string, turns: number) {
  localStorage.setItem(dailyKey(date), String(turns));
}

export function applyChoice(state: GameState, choiceIndex: 0 | 1 | 2): GameState {
  const choice = state.card.choices[choiceIndex];
  const r = state.resources;

  // Gentle difficulty ramp: later turns add a small stress tax.
  const ramp = Math.min(6, Math.floor(state.turn / 6)); // 0..6
  const stressTax = ramp; // +0..+6

  const next: Resources = {
    cash: clamp(r.cash + choice.delta.cash, 0, 100),
    progress: clamp(r.progress + choice.delta.progress, 0, 100),
    stress: clamp(r.stress + choice.delta.stress + stressTax, 0, 100),
    rep: clamp(r.rep + choice.delta.rep, 0, 100),
  };

  const nextTurn = state.turn + 1;

  let over = false;
  let overReason: GameOverReason | undefined;
  if (next.cash <= 0) {
    over = true;
    overReason = "cash";
  }
  if (next.stress >= 100) {
    over = true;
    overReason = "stress";
  }

  const bestTurns = Math.max(state.bestTurns, nextTurn);
  if (bestTurns !== state.bestTurns) saveBestTurns(bestTurns);

  let dailyBestTurns = state.dailyBestTurns;
  if (state.mode === "daily") {
    dailyBestTurns = Math.max(state.dailyBestTurns, nextTurn);
    if (dailyBestTurns !== state.dailyBestTurns) saveDailyBest(state.dateKey, dailyBestTurns);
  }

  return {
    ...state,
    turn: nextTurn,
    resources: next,
    bestTurns,
    dailyBestTurns,
    over,
    overReason,
    card: over ? state.card : pickCard(state.card.id, state.rng),
  };
}

export function getTitle(turns: number, r: Resources, reason?: GameOverReason): string {
  if (reason === "stress") return "爆炸收場";
  if (reason === "cash") return "資金斷裂";
  if (turns >= 12 && r.stress < 40) return "冷靜 CEO";
  if (r.rep >= 80) return "PR 大師";
  if (r.progress >= 80) return "產品狂人";
  if (r.cash < 15 && turns >= 6) return "燒錢機器";
  if (turns >= 6) return "苟活者";
  return "新手 CEO";
}

export function makeShareText(opts: {
  turns: number;
  r: Resources;
  title: string;
  mode: GameMode;
  dateKey: string;
  dailyBest: number;
}): string {
  const { turns, r, title, mode, dateKey, dailyBest } = opts;

  const bar = (v: number, kind: "normal" | "stress" = "normal") => {
    if (kind === "stress") {
      // high stress is bad
      if (v < 30) return "🟩";
      if (v < 60) return "🟨";
      if (v < 80) return "🟧";
      return "🟥";
    }
    if (v >= 75) return "🟩";
    if (v >= 50) return "🟨";
    if (v >= 25) return "🟧";
    return "🟥";
  };

  const bars = `${bar(r.cash)}${bar(r.progress)}${bar(r.stress, "stress")}${bar(r.rep)}`;
  const tag = mode === "daily" ? `每日挑戰 ${dateKey}` : "經典模式";
  const extra = mode === "daily" ? `｜今日最佳 ${Math.max(dailyBest, turns)}` : "";

  return `創業求生 20 秒\n${tag}\n我撐了 ${turns} 回合｜${title}${extra}\n資源：${bars}（現金/進度/壓力/名聲）`;
}
