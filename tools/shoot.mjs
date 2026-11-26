// Screenshot shooter for Hartono Household Budget.
//
// Serves app/ with the repo's serve.ts, opens each scene from shots.json in
// headless Chromium over CDP, waits for window.__shotReady, then captures a
// JPEG of the viewport. Each file must land at most 256 KiB with its long
// side at most 1280 and its short side at least 360 — the shooter lowers
// JPEG quality until the size fits, and reports every file's final bytes
// and dimensions.
//
//   node tools/shoot.mjs
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SHOT_DIR = join(REPO, 'screenshots');
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';
const PORT = 8080;
const CDP_PORT = 9335;
const BASE = `http://localhost:${PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shots = JSON.parse(readFileSync(join(REPO, 'shots.json'), 'utf8'));

async function getJson(url) {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
    } catch { /* not ready yet */ }
    await sleep(500);
  }
  throw new Error(`CDP did not respond: ${url}`);
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.errors = [];
    this.requests = [];
  }
  async open() {
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params.exceptionDetails;
        this.errors.push(d.exception?.description || d.text);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.errors.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
      } else if (m.method === 'Network.requestWillBeSent') {
        this.requests.push(m.params.request.url);
      }
    };
  }
  call(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); rej(new Error(`CDP timeout ${method}`)); }
      }, 30000);
    });
  }
  eval(expr) {
    return this.call('Runtime.evaluate', { expression: expr, returnByValue: true })
      .then((r) => r?.result?.value);
  }
  async navigate(url) { await this.call('Page.navigate', { url }); }
  async shot(file, quality) {
    const r = await this.call('Page.captureScreenshot', { format: 'jpeg', quality });
    writeFileSync(file, Buffer.from(r.data, 'base64'));
    return statSync(file).size;
  }
}

const server = spawn('node', ['serve.ts', '--port', String(PORT)], { cwd: REPO, stdio: 'ignore' });
await sleep(1500);
const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${CDP_PORT}`, '--window-size=1280,720',
  '--user-data-dir=/tmp/chrome-profile-hartono-budget', 'about:blank',
], { stdio: 'ignore' });

let cdp;
const results = [];
try {
  const targets = await getJson(`http://localhost:${CDP_PORT}/json/list`);
  const page = targets.find((t) => t.type === 'page');
  cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Page.enable');
  await cdp.call('Runtime.enable');
  await cdp.call('Network.enable');

  for (const shot of shots) {
    cdp.errors = [];
    cdp.requests = [];
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: shot.w, height: shot.h, deviceScaleFactor: 1, mobile: shot.w < 500,
    });
    await cdp.navigate(`${BASE}/index.html${shot.query}`);
    let ready = false;
    for (let i = 0; i < 40; i++) {
      await sleep(500);
      if (await cdp.eval('window.__shotReady === true')) { ready = true; break; }
    }
    if (!ready) {
      console.log(`${shot.name}: NOT READY, skipped`);
      results.push({ name: shot.name, ok: false, reason: 'not ready' });
      continue;
    }
    const external = cdp.requests.filter((u) => !u.startsWith('http://localhost:') && !u.startsWith('data:'));
    const file = join(SHOT_DIR, shot.name);
    let quality = 88;
    let size = await cdp.shot(file, quality);
    while (size > 262144 && quality > 50) {
      quality -= 8;
      size = await cdp.shot(file, quality);
    }
    const ok = size <= 262144;
    console.log(`${shot.name}: ${shot.w}x${shot.h} ${size} bytes quality=${quality} ${ok ? 'OK' : 'TOO BIG'} errors=${cdp.errors.length ? cdp.errors.join(' | ') : 'none'} external-requests=${external.length ? external.join(',') : 'none'}`);
    results.push({ name: shot.name, ok, size, w: shot.w, h: shot.h, quality });
  }
  console.log('PAGE ERRORS: ' + (cdp.errors.length ? cdp.errors.join(' | ') : 'none'));
} finally {
  try { cdp?.ws?.close(); } catch { /* ignore */ }
  chrome.kill('SIGKILL');
  server.kill('SIGKILL');
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(`SHOTS FAILED: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
console.log('SHOTS DONE');
