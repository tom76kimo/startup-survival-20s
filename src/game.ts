import { EVENTS, type EventCard } from "./events";

export type Resources = {
  cash: number;
  progress: number;
  stress: number;
  rep: number;
};

export type GameOverReason = "cash" | "stress";

export type GameState = {
  turn: number;
  timePerTurnSec: number;
  resources: Resources;
  card: EventCard;
  bestTurns: number;
  over: boolean;
  overReason?: GameOverReason;
};

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const defaultResources = (): Resources => ({
  cash: 55,
  progress: 35,
  stress: 30,
  rep: 40,
});

export function pickCard(prevId?: string): EventCard {
  if (EVENTS.length === 0) throw new Error("No events");
  // Avoid repeating the same card twice in a row.
  for (let i = 0; i < 6; i++) {
    const c = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (c.id !== prevId) return c;
  }
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}

const BEST_KEY = "ss20_best_turns";

export function loadBestTurns(): number {
  const raw = localStorage.getItem(BEST_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function saveBestTurns(turns: number) {
  localStorage.setItem(BEST_KEY, String(turns));
}

export function applyChoice(state: GameState, choiceIndex: 0 | 1 | 2): GameState {
  const choice = state.card.choices[choiceIndex];
  const r = state.resources;
  const next: Resources = {
    cash: clamp(r.cash + choice.delta.cash, 0, 100),
    progress: clamp(r.progress + choice.delta.progress, 0, 100),
    stress: clamp(r.stress + choice.delta.stress, 0, 100),
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

  return {
    ...state,
    turn: nextTurn,
    resources: next,
    bestTurns,
    over,
    overReason,
    card: over ? state.card : pickCard(state.card.id),
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

export function makeShareText(turns: number, r: Resources, title: string): string {
  const bar = (v: number) => {
    if (v >= 75) return "🟩";
    if (v >= 50) return "🟨";
    if (v >= 25) return "🟧";
    return "🟥";
  };

  const bars = `${bar(r.cash)}${bar(r.progress)}${bar(r.stress)}${bar(r.rep)}`;
  return `創業求生 20 秒\n我撐了 ${turns} 回合｜${title}\n資源：${bars}（現金/進度/壓力/名聲）`;
}
