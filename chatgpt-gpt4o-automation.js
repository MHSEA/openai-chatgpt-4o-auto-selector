// ==UserScript==
// @name         ChatGPT GPT 4o + Temp Chat Automation
// @namespace    http://tampermonkey.net/
// @author       MHSEA
// @version      1.1
// @description  Temp Chat first, GPT-4o second, Ctrl+Space toggle — skips if model=gpt-5 is in URL or model=gpt-4o & temporary-chat=true already set
// @icon         https://cdn.oaistatic.com/assets/favicon-180x180-od45eci6.webp
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  const modelParam = urlParams.get('model')?.toLowerCase();
  const tempChatParam = urlParams.get('temporary-chat');

  if (modelParam === 'gpt-4o' && tempChatParam === 'true') {
    console.log('[TM] Skipping script — already using GPT-4o + Temporary Chat ✅');
    return;
  }

  const skipModelSwitch = modelParam === 'gpt-5';
  if (skipModelSwitch) {
    console.log('[TM] Skipping GPT-4o switch — GPT-5 explicitly requested via URL.');
  }

  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const waitFor = async (selOrFn, timeout = 6000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = typeof selOrFn === 'string' ? q(selOrFn) : selOrFn();
      if (el) return el;
      await sleep(15);
    }
    return null;
  };

  const simulateClick = el => {
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type =>
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))
    );
  };

  const simulateCtrlSpace = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      ctrlKey: true,
      bubbles: true
    }));
  };

  const getTempChatButton = () => q('button[aria-label*="temporary chat"]');
  const isTempChatOn = () => getTempChatButton()?.getAttribute('aria-label')?.toLowerCase().includes('turn off');

  async function forceTempChatOn() {
    const btn = await waitFor(getTempChatButton, 4000);
    if (!btn) return false;
    if (!isTempChatOn()) {
      console.log('[TM] Enabling Temp Chat...');
      simulateCtrlSpace();
      await sleep(100);
    } else {
      console.log('[TM] Temp Chat already ON ✅');
    }
  }

  const isGPT4oActive = () => {
    const btn = q('button[data-testid="model-switcher-dropdown-button"]');
    return btn && /\b4o\b/i.test(btn.textContent || '');
  };

  async function selectGPT4o() {
    if (isGPT4oActive()) return true;

    const dropdown = await waitFor('button[data-testid="model-switcher-dropdown-button"]', 3000);
    if (!dropdown) return false;

    if (dropdown.getAttribute('aria-expanded') !== 'true') simulateClick(dropdown);
    const menu = await waitFor('[role="menu"]', 800);
    if (!menu) return false;

    const legacy = qa('[role="menuitem"], button').find(el => /legacy models/i.test(el.textContent));
    if (!legacy) return false;

    simulateClick(legacy);

    const gpt4o = await waitFor(() =>
      qa('[role="menuitem"], button').find(el => /gpt-4o/i.test(el.textContent)), 600);
    if (!gpt4o) return false;

    simulateClick(gpt4o);
    return true;
  }

  async function enforceGPT4o() {
    if (skipModelSwitch) return;

    for (let i = 0; i < 2; i++) {
      if (await selectGPT4o()) break;
      await sleep(50);
    }
  }

  // Ctrl+Space toggles Temp Chat
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      const btn = getTempChatButton();
      if (btn) simulateClick(btn);
    }
  });

  // Startup sequence
  (async () => {
    await Promise.all([
      waitFor(getTempChatButton),
      waitFor('button[data-testid="model-switcher-dropdown-button"]')
    ]);
    await forceTempChatOn();
    await enforceGPT4o();
    setTimeout(forceTempChatOn, 500);
  })();

  // Watch for route changes
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      forceTempChatOn();
      enforceGPT4o();
    }
  }, 1000);
})();
