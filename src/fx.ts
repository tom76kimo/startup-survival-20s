// Tiny SFX + haptics + particles (no deps)

export function haptic(kind: 'light' | 'warn' | 'fail' = 'light') {
  if (!('vibrate' in navigator)) return;
  if (kind === 'light') navigator.vibrate(12);
  if (kind === 'warn') navigator.vibrate([20, 30, 20]);
  if (kind === 'fail') navigator.vibrate([40, 30, 40, 30, 80]);
}

let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function beep(freq: number, durationMs: number, gain = 0.03) {
  try {
    const a = ac();
    if (a.state === 'suspended') a.resume().catch(() => undefined);
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + durationMs / 1000);
  } catch {
    // ignore
  }
}

export function sfxChoice() {
  beep(660, 45, 0.03);
}

export function sfxTick() {
  beep(880, 25, 0.015);
}

export function sfxGameOver() {
  beep(220, 120, 0.04);
  setTimeout(() => beep(180, 140, 0.04), 90);
}

// --- Particles ---
export type BurstOpts = { x: number; y: number; colors?: string[]; count?: number };

export function createFxCanvas() {
  const c = document.createElement('canvas');
  c.id = 'fx';
  c.style.position = 'fixed';
  c.style.inset = '0';
  c.style.pointerEvents = 'none';
  c.style.zIndex = '999';
  document.body.appendChild(c);

  const resize = () => {
    c.width = window.innerWidth * devicePixelRatio;
    c.height = window.innerHeight * devicePixelRatio;
  };
  resize();
  window.addEventListener('resize', resize);

  const g = c.getContext('2d')!;
  return { canvas: c, g, resize };
}

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

export function makeParticleSystem(g: CanvasRenderingContext2D) {
  const ps: P[] = [];
  let raf = 0;

  const step = () => {
    raf = requestAnimationFrame(step);
    const w = g.canvas.width;
    const h = g.canvas.height;
    g.clearRect(0, 0, w, h);

    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.life -= 1;
      p.vy += 0.06 * devicePixelRatio;
      p.x += p.vx;
      p.y += p.vy;

      const a = Math.max(0, Math.min(1, p.life / 60));
      g.globalAlpha = a;
      g.fillStyle = p.color;
      g.beginPath();
      g.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      g.fill();

      if (p.life <= 0 || p.y > h + 40) ps.splice(i, 1);
    }
    g.globalAlpha = 1;

    if (ps.length === 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const burst = (opts: BurstOpts) => {
    const colors = opts.colors ?? ['#60a5fa', '#a78bfa', '#22c55e', '#fde047', '#fb923c'];
    const count = opts.count ?? 22;
    const x = opts.x * devicePixelRatio;
    const y = opts.y * devicePixelRatio;

    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (1.6 + Math.random() * 3.2) * devicePixelRatio;
      ps.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 2.8 * devicePixelRatio,
        life: 40 + Math.floor(Math.random() * 40),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: (2 + Math.random() * 3) * devicePixelRatio,
      });
    }

    if (!raf) step();
  };

  return { burst };
}
