import "./style.css";
import { setupPWA } from "./sw-register";
import {
  applyChoice,
  defaultResources,
  getTitle,
  loadBestTurns,
  makeShareText,
  pickCard,
  type GameState,
} from "./game";

const TIME_PER_TURN_SEC = 20;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const el = {
  app: $("#app"),
};

el.app.innerHTML = `
  <div class="wrap">
    <header class="top">
      <div class="brand">
        <div class="logo">SS20</div>
        <div>
          <div class="title">創業求生 20 秒</div>
          <div class="subtitle">每回合 20 秒做決策。現金歸零或壓力爆表就結束。</div>
        </div>
      </div>
      <div class="meta">
        <div class="pill">回合 <span id="turn">0</span></div>
        <div class="pill">最佳 <span id="best">0</span></div>
      </div>
    </header>

    <section class="panel">
      <div class="bars">
        <div class="barRow"><div class="barLabel">現金</div><div class="bar"><div id="barCash" class="barFill"></div></div><div id="valCash" class="barVal">0</div></div>
        <div class="barRow"><div class="barLabel">進度</div><div class="bar"><div id="barProg" class="barFill"></div></div><div id="valProg" class="barVal">0</div></div>
        <div class="barRow"><div class="barLabel">壓力</div><div class="bar"><div id="barStress" class="barFill"></div></div><div id="valStress" class="barVal">0</div></div>
        <div class="barRow"><div class="barLabel">名聲</div><div class="bar"><div id="barRep" class="barFill"></div></div><div id="valRep" class="barVal">0</div></div>
      </div>

      <div class="card">
        <div id="cardText" class="cardText"></div>
      </div>

      <div class="choices">
        <button id="c0" class="choice"></button>
        <button id="c1" class="choice"></button>
        <button id="c2" class="choice"></button>
      </div>

      <div class="timer">
        <div class="timerTrack"><div id="timerFill" class="timerFill"></div></div>
        <div class="timerText"><span id="timerSec">20</span>s</div>
      </div>

      <footer class="footer">
        <button id="btnRestart" class="ghost">重新開始</button>
        <button id="btnShare" class="ghost">分享結果</button>
        <button id="btnHow" class="ghost">玩法</button>
      </footer>
    </section>

    <section id="modal" class="modal hidden" aria-hidden="true">
      <div class="modalBackdrop"></div>
      <div class="modalSheet">
        <div class="modalTitle" id="modalTitle">玩法</div>
        <div class="modalBody" id="modalBody"></div>
        <div class="modalActions">
          <button id="btnModalOk" class="choice">知道了</button>
        </div>
      </div>
    </section>
  </div>
`;

const ui = {
  turn: $("#turn"),
  best: $("#best"),
  cardText: $("#cardText"),
  c0: $("#c0"),
  c1: $("#c1"),
  c2: $("#c2"),
  timerFill: $("#timerFill"),
  timerSec: $("#timerSec"),
  barCash: $("#barCash"),
  barProg: $("#barProg"),
  barStress: $("#barStress"),
  barRep: $("#barRep"),
  valCash: $("#valCash"),
  valProg: $("#valProg"),
  valStress: $("#valStress"),
  valRep: $("#valRep"),
  btnRestart: $("#btnRestart"),
  btnShare: $("#btnShare"),
  btnHow: $("#btnHow"),
  modal: $("#modal"),
  modalTitle: $("#modalTitle"),
  modalBody: $("#modalBody"),
  btnModalOk: $("#btnModalOk"),
};

let state: GameState;
let timerId: number | null = null;
let endsAt = 0;

function setBar(el: HTMLElement, valEl: HTMLElement, value: number, kind: "cash" | "progress" | "stress" | "rep") {
  el.style.width = `${value}%`;
  valEl.textContent = String(value);

  el.classList.remove("good", "mid", "bad", "danger");
  const cls = value >= 70 ? "good" : value >= 40 ? "mid" : value >= 20 ? "bad" : "danger";
  if (kind === "stress") {
    // Invert for stress (high is bad)
    const sc = value >= 80 ? "danger" : value >= 60 ? "bad" : value >= 30 ? "mid" : "good";
    el.classList.add(sc);
  } else {
    el.classList.add(cls);
  }
}

function render() {
  ui.turn.textContent = String(state.turn);
  ui.best.textContent = String(state.bestTurns);

  setBar(ui.barCash, ui.valCash, state.resources.cash, "cash");
  setBar(ui.barProg, ui.valProg, state.resources.progress, "progress");
  setBar(ui.barStress, ui.valStress, state.resources.stress, "stress");
  setBar(ui.barRep, ui.valRep, state.resources.rep, "rep");

  ui.cardText.textContent = state.card.text;

  ui.c0.textContent = state.card.choices[0].label;
  ui.c1.textContent = state.card.choices[1].label;
  ui.c2.textContent = state.card.choices[2].label;

  const disabled = state.over;
  ui.c0.toggleAttribute("disabled", disabled);
  ui.c1.toggleAttribute("disabled", disabled);
  ui.c2.toggleAttribute("disabled", disabled);

  ui.btnShare.toggleAttribute("disabled", state.turn === 0);

  if (state.over) {
    stopTimer();
    const title = getTitle(state.turn, state.resources, state.overReason);
    showModal(
      title,
      `你撐了 <b>${state.turn}</b> 回合。<br/>` +
        `現金 ${state.resources.cash}｜進度 ${state.resources.progress}｜壓力 ${state.resources.stress}｜名聲 ${state.resources.rep}<br/><br/>` +
        `要不要分享你的結果？（也可以按「重新開始」再一局）`
    );
  }
}

function startNewGame() {
  state = {
    turn: 0,
    timePerTurnSec: TIME_PER_TURN_SEC,
    resources: defaultResources(),
    card: pickCard(),
    bestTurns: loadBestTurns(),
    over: false,
  };
  startTurnTimer();
  hideModal();
  render();
}

function startTurnTimer() {
  stopTimer();
  endsAt = Date.now() + state.timePerTurnSec * 1000;
  tick();
  timerId = window.setInterval(tick, 100);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function tick() {
  const leftMs = Math.max(0, endsAt - Date.now());
  const leftSec = Math.ceil(leftMs / 1000);
  ui.timerSec.textContent = String(leftSec);

  const pct = (leftMs / (state.timePerTurnSec * 1000)) * 100;
  ui.timerFill.style.width = `${pct}%`;

  if (leftMs <= 0 && !state.over) {
    // If time runs out, auto-pick the middle option (feels like "safe")
    onChoose(1);
  }
}

function onChoose(i: 0 | 1 | 2) {
  if (state.over) return;
  state = applyChoice(state, i);
  // Each new card gets a fresh timer.
  if (!state.over) startTurnTimer();
  render();
}

function showModal(title: string, html: string) {
  ui.modalTitle.textContent = title;
  ui.modalBody.innerHTML = html;
  ui.modal.classList.remove("hidden");
  ui.modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
  ui.modal.classList.add("hidden");
  ui.modal.setAttribute("aria-hidden", "true");
}

async function share() {
  const title = getTitle(state.turn, state.resources, state.overReason);
  const text = makeShareText(state.turn, state.resources, title);

  // Prefer native share on mobile.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: any = navigator;
  if (nav.share) {
    try {
      await nav.share({ text, title: "創業求生 20 秒" });
      return;
    } catch {
      // fall through
    }
  }

  await navigator.clipboard.writeText(text);
  showModal("已複製", "結果已複製到剪貼簿，可以貼到任何地方分享。");
}

function showHow() {
  showModal(
    "玩法",
    `每回合你只有 <b>20 秒</b>。選一個決策，四個資源會改變：<br/><br/>
     <b>現金</b>歸零或 <b>壓力</b>爆表（=100）就結束。<br/>
     <b>進度</b>與<b>名聲</b>不會直接讓你死亡，但會影響你能撐多久。<br/><br/>
     小技巧：別只追一條資源，崩得會很快。`
  );
}

ui.c0.addEventListener("click", () => onChoose(0));
ui.c1.addEventListener("click", () => onChoose(1));
ui.c2.addEventListener("click", () => onChoose(2));
ui.btnRestart.addEventListener("click", () => startNewGame());
ui.btnShare.addEventListener("click", () => share());
ui.btnHow.addEventListener("click", () => showHow());
ui.btnModalOk.addEventListener("click", () => hideModal());
ui.modal.querySelector(".modalBackdrop")?.addEventListener("click", () => hideModal());

setupPWA();
startNewGame();
