import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import Nav from './components/Nav.jsx';
import Icon from './components/Icon.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import TabContent from './tabs/TabContent.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import StatusBar from './components/StatusBar.jsx';
import WeatherField from './components/WeatherField.jsx';
import Constellation from './components/Constellation.jsx';
import Console from './components/Console.jsx';
import Spectacle from './components/Spectacle.jsx';
import useRevealObserver from './hooks/useRevealObserver.js';
import { useTilt } from './hooks/useTilt.js';
import useAmbience, { AMBIENCE_MODES } from './hooks/useAmbience.js';
import useSound from './hooks/useSound.js';
import useGitHubStatus from './hooks/useGitHubStatus.js';
import { ALL_PINS, KNOWLEDGE, CORE_PROJECTS, PROCESS_DATA, PROFILE, TABS } from './data/portfolio.js';

const VALID_TABS = ['about', 'all', 'ai', 'fullstack', 'client', 'credentials', 'experience', 'activity', 'process', 'contact', 'void'];

/* which tab a pin belongs to, and which palette group it files under */
const TAB_FOR_CATEGORY = {
  ai: 'ai',
  fullstack: 'fullstack',
  client: 'client',
  certification: 'credentials',
  academic: 'credentials',
  experience: 'experience',
  activity: 'activity',
};
const groupFor = (cat) => {
  if (cat === 'certification' || cat === 'academic') return 'Credentials';
  if (cat === 'experience') return 'Experience';
  if (cat === 'activity') return 'Live';
  return 'Projects';
};

/* read the initial tab from the URL hash, falling back to the saved tab */
function initialTab() {
  if (typeof window === 'undefined') return 'about';
  const hash = window.location.hash.replace('#', '').trim();
  if (VALID_TABS.includes(hash)) return hash;
  const saved = localStorage.getItem('filterTab');
  return VALID_TABS.includes(saved) ? saved : 'about';
}

export default function App() {
  /* ---------------- chat ---------------- */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Harshit's AI assistant. Ask me about my skills, certifications, or how to reach me!", isUser: false },
  ]);
  const chatEndRef = useRef(null);

  /* ---------------- ui ---------------- */
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterTab, setFilterTab] = useState(initialTab);
  const [selectedProcessProject, setSelectedProcessProject] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  /* ---------------- the instrument set ---------------- */
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [spectacle, setSpectacle] = useState(null);
  const [modalOrigin, setModalOrigin] = useState(null);
  const ambience = useAmbience();
  const sound = useSound();
  const ghStatus = useGitHubStatus();

  const { mode: ambienceMode, setMode: setAmbienceMode, setOverride: setAmbienceOverride } = ambience;
  const { enabled: soundEnabled, toggle: toggleSound, setEnabled: setSoundEnabled } = sound;

  /* ---------------- forms ---------------- */
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Just saying hi');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSending, setFormSending] = useState(false);
  const [contactTab, setContactTab] = useState('message');
  const [crName, setCrName] = useState('');
  const [crEmail, setCrEmail] = useState('');
  const [crRepo, setCrRepo] = useState('');
  const [crPRLink, setCrPRLink] = useState('');
  const [crLanguage, setCrLanguage] = useState('');
  const [crDescription, setCrDescription] = useState('');
  const [crConcerns, setCrConcerns] = useState('');
  const [crSubmitted, setCrSubmitted] = useState(false);
  const [crError, setCrError] = useState('');
  const [crSending, setCrSending] = useState(false);

  /* ---------------- easter eggs ---------------- */
  const [konamiTriggered, setKonamiTriggered] = useState(false);
  const [konamiPhase, setKonamiPhase] = useState('');
  const [show404, setShow404] = useState(false);
  const [konamiCount, setKonamiCount] = useState(null);
  const [voidBleed, setVoidBleed] = useState(false);
  const [voidSweep, setVoidSweep] = useState(false);
  const [staticPop, setStaticPop] = useState(false);
  const [bleedPos, setBleedPos] = useState({ x: 50, y: 50 });
  const [rainbowMode, setRainbowMode] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [idleNotif, setIdleNotif] = useState(false);
  const [voidModePlus, setVoidModePlus] = useState(false);
  const [duckActive, setDuckActive] = useState(false);
  const [footerFunny, setFooterFunny] = useState(false);
  const [footerClicks, setFooterClicks] = useState(0);
  const [gearSpun, setGearSpun] = useState(false);
  const [voidCreature, setVoidCreature] = useState({ show: false, x: 0, y: 0, dir: 1 });
  const [showEggHints, setShowEggHints] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);
  const [eggExpanded, setEggExpanded] = useState(false);
  const [foundEggs, setFoundEggs] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('foundEggs') || '[]'); } catch { return []; }
  });
  const [voidThemeActive, setVoidThemeActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('voidThemeActive') === 'true';
  });

  const hoverTimerRef = useRef(null);
  const staticTimerRef = useRef(null);
  const hoverOpenedRef = useRef(false);
  const keySeqRef = useRef([]);
  const duckSeqRef = useRef('');
  const idleTimerRef = useRef(null);

  const markEgg = useCallback((name) => {
    setFoundEggs((prev) => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      localStorage.setItem('foundEggs', JSON.stringify(next));
      return next;
    });
  }, []);

  const EGG_HINTS = {
    konami: { hint: "↑↑↓↓←→←→", found: foundEggs.includes('konami') },
    rainbow: { hint: "Ctrl+Alt+R — rainbow mode", found: foundEggs.includes('rainbow') },
    credits: { hint: "Ctrl+Alt+K — view credits", found: foundEggs.includes('credits') },
    loading: { hint: "Ctrl+Alt+L — wait for it...", found: foundEggs.includes('loading') },
    duck: { hint: "Type 'duck' for debugging help", found: foundEggs.includes('duck') },
    footer: { hint: "Click the footer 5 times", found: foundEggs.includes('footer') },
    gear: { hint: "Click the AI gear icon", found: foundEggs.includes('gear') },
    voidplus: { hint: "Shift+click ◆ Void for overload", found: foundEggs.includes('voidplus') },
    rickroll: { hint: "Somebody typed a song into the console", found: foundEggs.includes('rickroll') },
  };

  /* ---------------- project modal (declared before effects that use it) ---------------- */
  const soundRef = useRef(sound);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  const playSound = useCallback((kind) => { soundRef.current?.play?.(kind); }, []);

  /* thunder, called by the weather field when a bolt lands */
  const lightning = useCallback((distance) => { soundRef.current?.thunder?.(distance); }, []);

  /* ---- what the console can do to the site ---- */
  const consoleWeather = useCallback((cmd) => {
    setAmbienceOverride({ weather: cmd.weather, time: cmd.time || null, name: cmd.name });
  }, [setAmbienceOverride]);

  const consoleAuto = useCallback(() => { setAmbienceOverride(null); }, [setAmbienceOverride]);

  const consoleSound = useCallback((on) => { setSoundEnabled(on); }, [setSoundEnabled]);

  /* a set piece fires across the screen */
  const consoleSpectacle = useCallback((cmd) => {
    setSpectacle({ effect: cmd.effect, key: `${cmd.effect}-${Date.now()}` });
  }, []);

  const consoleRickroll = useCallback(() => {
    markEgg('rickroll');
    setRainbowMode(true);
    setTimeout(() => setRainbowMode(false), 6000);
    playSound('scratch');
  }, [markEgg, playSound]);

  const openProjectModal = useCallback((pin, opts = {}) => {
    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
    /* remember where the card was, so the dossier can open out of it */
    if (opts.origin !== false) {
      const cell = document.querySelector(`[data-pin-id="${pin.id}"] .pin-card`);
      if (cell) {
        const r = cell.getBoundingClientRect();
        setModalOrigin({ left: r.left, top: r.top, width: r.width, height: r.height, pinId: pin.id });
      } else {
        setModalOrigin(null);
      }
    }
    setSelectedProject(pin);
    setShowProjectModal(true);
    setStaticPop(true);
    staticTimerRef.current = setTimeout(() => setStaticPop(false), 400);
    document.body.style.overflow = 'hidden';
    playSound('open');
    window.plausible?.('Pin Click', { props: { title: pin.title } });
  }, [playSound]);

  const closeProjectModal = useCallback(() => {
    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
    setShowProjectModal(false);
    setSelectedProject(null);
    setModalOrigin(null);
    document.body.style.overflow = '';
    hoverOpenedRef.current = false;
    playSound('close');
  }, [playSound]);

  /* ---------------- 1:1 pointer tracking with spring release ----------------
     The card is glued to the pointer while it is over it (no easing),
     and springs back on release carrying the pointer's velocity. */
  const tilt = useTilt({ max: 7 });

  const handleCardMouseEnter = useCallback((pin) => {
    if (showProjectModal) return;
    hoverTimerRef.current = setTimeout(() => { hoverOpenedRef.current = true; openProjectModal(pin); }, 1000);
  }, [showProjectModal, openProjectModal]);

  const handleCardMouseMove = useCallback((pin, e, el) => {
    if (!hoverOpenedRef.current && hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => { hoverOpenedRef.current = true; openProjectModal(pin); }, 1000);
    }
    tilt.onMove(e, el);
  }, [openProjectModal, tilt]);

  const handleCardMouseLeave = useCallback((el) => {
    if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
    tilt.onLeave(el);
  }, [tilt]);

  const resetCardTilt = useCallback((el) => {
    tilt.onLeave(el);
  }, [tilt]);

  /* ---------------- void theme on <html> so it cascades everywhere ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('void-theme', voidThemeActive);
    // the theme is class-driven, not OS-driven, so the status bar
    // colour has to be swapped by hand to match the canvas
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', voidThemeActive ? '#0a0908' : '#f2ece0');
    return () => document.documentElement.classList.remove('void-theme');
  }, [voidThemeActive]);

  /* ---------------- scroll reveals (re-run per tab) ---------------- */
  useRevealObserver([filterTab]);

  /* ---------------- scroll to top button ---------------- */
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------------- konami view counter ---------------- */
  useEffect(() => {
    fetch('https://page-views-api.ratneshc.com/api/v1/views?site=harshitshyamsukhas-portfolio.vercel.app&path=/konami')
      .then((r) => r.json())
      .then((d) => { if (d.views) setKonamiCount(d.views); })
      .catch(() => {});
  }, []);

  /* ---------------- void bleed ambience ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setBleedPos({ x: Math.random() * 100, y: Math.random() * 100 });
      setVoidBleed(true);
      setTimeout(() => setVoidBleed(false), 300);
    }, 20000 + Math.random() * 20000);
    return () => clearTimeout(timer);
  }, [voidBleed]);

  /* ---------------- process default ---------------- */
  const effectiveProcessProject = selectedProcessProject || CORE_PROJECTS[0]?.id;

  /* ---------------- escape closes modal ---------------- */
  useEffect(() => {
    if (!showProjectModal) return;
    const handleKey = (e) => { if (e.key === 'Escape') closeProjectModal(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showProjectModal, closeProjectModal]);

  /* ---------------- keyboard shortcuts ---------------- */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'r') { e.preventDefault(); setRainbowMode((v) => !v); markEgg('rainbow'); }
      if (e.ctrlKey && e.altKey && e.key === 'k') { e.preventDefault(); setShowCredits((v) => !v); markEgg('credits'); }
      if (e.ctrlKey && e.altKey && e.key === 'l') {
        e.preventDefault(); setShowLoadingBar(true); markEgg('loading');
        setTimeout(() => setShowLoadingBar(false), 8000);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [markEgg]);

  /* ---------------- ⌘K palette · ⌘⇧F focus mode ---------------- */
  useEffect(() => {
    const handleKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        playSound('tick');
        return;
      }
      if (e.shiftKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setFocusMode((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playSound]);

  /* ---------------- focus mode on <html> ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('focus-mode', focusMode);
    return () => document.documentElement.classList.remove('focus-mode');
  }, [focusMode]);

  /* ---------------- the console: ` opens it ---------------- */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (typing) {
        if (e.key === 'Escape') t.blur();
        return;
      }
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setConsoleOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* ---------------- the weather bed follows the sky ---------------- */
  useEffect(() => {
    soundRef.current?.setBed?.(ambience.weatherId);
  }, [ambience.weatherId, sound.enabled]);

  /* ---------------- idle detection ---------------- */
  useEffect(() => {
    const reset = () => {
      clearTimeout(idleTimerRef.current);
      setIdleNotif(false);
      idleTimerRef.current = setTimeout(() => setIdleNotif(true), 300000);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  /* ---------------- void creature ---------------- */
  useEffect(() => {
    const spawn = () => {
      setVoidCreature({ show: true, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, dir: Math.random() > 0.5 ? 1 : -1 });
      setTimeout(() => setVoidCreature({ show: false, x: 0, y: 0, dir: 1 }), 2500);
    };
    const timer = setInterval(spawn, 45000 + Math.random() * 60000);
    spawn();
    return () => clearInterval(timer);
  }, []);

  /* ---------------- rainbow auto-off ---------------- */
  useEffect(() => {
    if (!rainbowMode) return;
    const t = setTimeout(() => setRainbowMode(false), 15000);
    return () => clearTimeout(t);
  }, [rainbowMode]);

  /* ---------------- void mode+ auto-off ---------------- */
  useEffect(() => {
    if (!voidModePlus) return;
    const t = setTimeout(() => setVoidModePlus(false), 10000);
    return () => clearTimeout(t);
  }, [voidModePlus]);

  /* ---------------- konami + duck ---------------- */
  useEffect(() => {
    const handleKey = (e) => {
      const seq = keySeqRef.current;
      const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
      seq.push(e.key);
      if (seq.length > konami.length) seq.shift();
      if (seq.length === konami.length && seq.every((k, i) => k === konami[i])) {
        setKonamiTriggered(true);
        setKonamiPhase('tilt');
        fetch('https://page-views-api.ratneshc.com/api/v1/track?site=harshitshyamsukhas-portfolio.vercel.app&path=/konami')
          .then((r) => r.json()).then((d) => { if (d.views) setKonamiCount(d.views); }).catch(() => {});
        if (voidThemeActive) {
          setTimeout(() => setKonamiPhase('void-swallow'), 350);
          setTimeout(() => setKonamiPhase('void-revive'), 1200);
          setTimeout(() => window.location.reload(), 2800);
        } else {
          setTimeout(() => setKonamiPhase('tilt slide'), 350);
          setTimeout(() => setShow404(true), 900);
          setTimeout(() => window.location.reload(), 3200);
        }
        seq.length = 0;
      }
      if (e.key.length === 1) {
        duckSeqRef.current = (duckSeqRef.current + e.key.toLowerCase()).slice(-4);
        if (duckSeqRef.current === 'duck') {
          setDuckActive(true); markEgg('duck');
          setTimeout(() => setDuckActive(false), 4000);
          duckSeqRef.current = '';
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [voidThemeActive, markEgg]);

  /* ---------------- filtering ---------------- */
  const filteredPins = useMemo(() => ALL_PINS.filter((p) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'about' || filterTab === 'contact' || filterTab === 'process') return false;
    if (filterTab === 'ai') return p.category === 'ai';
    if (filterTab === 'fullstack') return p.category === 'fullstack';
    if (filterTab === 'client') return p.category === 'client';
    if (filterTab === 'credentials') return p.category === 'certification' || p.category === 'academic';
    if (filterTab === 'experience') return p.category === 'experience';
    if (filterTab === 'activity') return p.category === 'activity';
    if (filterTab === 'void') return true;
    return false;
  }), [filterTab]);

  const shuffledPins = useMemo(() => {
    const arr = [...filteredPins];
    // Seeded shuffle — deterministic per shuffleKey, avoids impure render calls.
    let seed = shuffleKey * 2654435761 % 2147483647;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [shuffleKey, filteredPins]);

  /* ---------------- navigation ---------------- */
  const handleTabChange = useCallback((key, opts = {}) => {
    if (key === 'void') {
      if (voidThemeActive) {
        setVoidThemeActive(false);
        localStorage.setItem('voidThemeActive', 'false');
        setFilterTab('about');
        localStorage.setItem('filterTab', 'about');
        window.history.replaceState(null, '', '#about');
      } else {
        setVoidThemeActive(true);
        localStorage.setItem('voidThemeActive', 'true');
        setFilterTab('void');
        localStorage.setItem('filterTab', 'void');
        window.history.replaceState(null, '', '#void');
        setVoidSweep(true);
        setTimeout(() => setVoidSweep(false), 800);
      }
      setShuffleKey((k) => k + 1);
      return;
    }
    if (key === filterTab) return;
    setFilterTab(key);
    localStorage.setItem('filterTab', key);
    window.history.replaceState(null, '', `#${key}`);
    setShuffleKey((k) => k + 1);
    if (opts.voidPlus) { setVoidModePlus(true); markEgg('voidplus'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterTab, voidThemeActive, markEgg]);

  /* ---------------- hash sync (back/forward + shared links) ---------------- */
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (VALID_TABS.includes(hash) && hash !== 'void') {
        setFilterTab(hash);
        localStorage.setItem('filterTab', hash);
        setShuffleKey((k) => k + 1);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((key) => handleTabChange(key), [handleTabChange]);

  const consoleTheme = useCallback((mode) => {
    const want = mode === 'void';
    if (want !== voidThemeActive) handleTabChange('void');
  }, [voidThemeActive, handleTabChange]);

  /* ---------------- the command palette's index ----------------
     Every tab, every project, every credential, every action — one
     keystroke away. The list is pure data; the actions are resolved
     by a single dispatcher when a command is chosen. */
  const commands = useMemo(() => {
    const list = [];

    TABS.forEach((t) => {
      list.push({
        id: `tab-${t.key}`,
        group: 'Go to',
        label: t.label,
        icon: t.key === 'void' ? 'sparkle2' : 'compass',
        hint: `#${t.key}`,
        action: `tab:${t.key}`,
      });
    });

    ALL_PINS.forEach((p) => {
      list.push({
        id: `pin-${p.id}`,
        group: groupFor(p.category),
        label: p.title,
        icon: 'link',
        hint: p.company || p.issuer || p.institution || p.date,
        action: `pin:${p.id}`,
      });
    });

    list.push(
      { id: 'act-resume', group: 'Actions', label: 'Download résumé', icon: 'download', action: 'resume' },
      { id: 'act-email', group: 'Actions', label: 'Copy email address', icon: 'mail', hint: PROFILE.email, action: 'email' },
      { id: 'act-github', group: 'Actions', label: 'Open GitHub profile', icon: 'github', action: 'github' },
      { id: 'act-linkedin', group: 'Actions', label: 'Open LinkedIn profile', icon: 'link', action: 'linkedin' },
      { id: 'act-chat', group: 'Actions', label: 'Ask the AI assistant', icon: 'sparkle2', action: 'chat' },
      { id: 'act-shuffle', group: 'Actions', label: 'Shuffle the grid', icon: 'grid', action: 'shuffle' },
      {
        id: 'act-focus', group: 'Actions', icon: 'focus', kbd: '⌘⇧F', action: 'focus',
        label: focusMode ? 'Leave focus mode' : 'Enter focus mode',
      },
      {
        id: 'act-sound', group: 'Actions', icon: soundEnabled ? 'mute' : 'volume', action: 'sound',
        label: soundEnabled ? 'Mute interface sound' : 'Enable interface sound',
      },
      { id: 'act-void', group: 'Actions', label: 'Toggle the Void theme', icon: 'sparkle2', action: 'void' },
    );

    AMBIENCE_MODES.forEach((m) => {
      list.push({
        id: `amb-${m.id}`,
        group: 'Ambience',
        label: m.label,
        icon: 'sun',
        hint: ambienceMode === m.id ? 'active' : undefined,
        action: `ambience:${m.id}`,
      });
    });

    return list;
  }, [focusMode, soundEnabled, ambienceMode]);

  /* one dispatcher for every command the palette can fire */
  const runCommand = useCallback((action) => {
    const sep = action.indexOf(':');
    const kind = sep === -1 ? action : action.slice(0, sep);
    const arg = sep === -1 ? '' : action.slice(sep + 1);
    switch (kind) {
      case 'tab':
        handleTabChange(arg);
        break;
      case 'pin': {
        const p = ALL_PINS.find((x) => x.id === arg);
        if (!p) break;
        handleTabChange(TAB_FOR_CATEGORY[p.category] || 'all');
        setTimeout(() => openProjectModal(p, { origin: false }), 40);
        break;
      }
      case 'ambience':
        setAmbienceMode(arg);
        break;
      case 'focus':
        setFocusMode((v) => !v);
        break;
      case 'sound':
        toggleSound();
        break;
      case 'shuffle':
        setShuffleKey((k) => k + 1);
        break;
      case 'chat':
        setChatOpen(true);
        break;
      case 'resume': {
        const a = document.createElement('a');
        a.href = PROFILE.resume;
        a.download = 'Harshit-Shyamsukha-Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        break;
      }
      case 'email':
        navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
        break;
      case 'github':
        window.open(PROFILE.github, '_blank', 'noopener');
        break;
      case 'linkedin':
        window.open(PROFILE.linkedin, '_blank', 'noopener');
        break;
      case 'void':
        handleTabChange('void');
        break;
      default:
        break;
    }
  }, [handleTabChange, openProjectModal, setAmbienceMode, toggleSound]);

  /* ---------------- project modal (see above) ---------------- */
  const projectNav = (dir) => {
    const idx = filteredPins.findIndex((p) => p.id === selectedProject?.id);
    if (idx === -1) return;
    const next = (idx + dir + filteredPins.length) % filteredPins.length;
    /* the dossier keeps the origin it opened from — it is the same
       surface, not a new one */
    openProjectModal(filteredPins[next], { origin: false });
  };

  const openProjectById = (id) => {
    const p = ALL_PINS.find((x) => x.id === id);
    if (p) openProjectModal(p, { origin: false });
  };

  /* ---------------- chat ---------------- */
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim().toLowerCase();
    setMessages((prev) => [...prev, { text: chatInput, isUser: true }]);
    setChatInput('');
    let reply = KNOWLEDGE.default;
    if (userMsg.match(/skill|know|tech|language|stack|java|c\+\+|linux|python|react|docker|kubernetes|fastapi|faiss|llm|llama|gemini|langgraph|phi|agent/)) reply = KNOWLEDGE.skill;
    else if (userMsg.match(/experience|internship|work|employment|canit|company|job/)) reply = KNOWLEDGE.experience;
    else if (userMsg.match(/project|built|made/)) reply = KNOWLEDGE.project;
    else if (userMsg.match(/cert|red hat|dsa|dbms|os|openshift|badge/)) reply = KNOWLEDGE.certifications;
    else if (userMsg.match(/hire|contact|available|reach|email|phone/)) reply = KNOWLEDGE.hire;
    else if (userMsg.match(/educat|study|college|srm|degree/)) reply = KNOWLEDGE.education;
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: reply, isUser: false }]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  /* ---------------- forms ---------------- */
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    const honeypot = e.target.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) return;
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) { setFormError('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) { setFormError('Please enter a valid email address.'); return; }
    setFormSending(true);
    emailjs.send('service_lhev4mm', 'template_3nekq1l', { name: formName, email: formEmail, subject: formSubject, message: formMessage, time: new Date().toLocaleString() }, 'oimlw2aQxH_KKaX__')
      .then(() => {
        setFormSubmitted(true);
        setFormName(''); setFormEmail(''); setFormSubject('Just saying hi'); setFormMessage('');
        window.plausible?.('Contact Form Submit');
      })
      .catch(() => setFormError('Failed to send message. Please try again later.'))
      .finally(() => setFormSending(false));
  };

  const handleCodeReviewSubmit = (e) => {
    e.preventDefault();
    setCrError('');
    const honeypot = e.target.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) return;
    if (!crName.trim() || !crEmail.trim() || !crRepo.trim() || !crDescription.trim()) { setCrError('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(crEmail)) { setCrError('Please enter a valid email address.'); return; }
    setCrSending(true);
    const reviewMessage = [
      `Code Review Request from ${crName} (${crEmail})`,
      `Repo: ${crRepo}`,
      `PR/Issue: ${crPRLink || 'N/A'}`,
      `Language: ${crLanguage || 'N/A'}`,
      `Description: ${crDescription}`,
      `Concerns: ${crConcerns || 'N/A'}`,
    ].join('\n');
    emailjs.send('service_lhev4mm', 'template_3nekq1l', {
      name: crName, email: crEmail, subject: 'Code Review Request', message: reviewMessage, time: new Date().toLocaleString(),
    }, 'oimlw2aQxH_KKaX__')
      .then(() => { setCrSubmitted(true); window.plausible?.('Code Review Request Submit'); })
      .catch(() => setCrError('Failed to send request. Please try again later.'))
      .finally(() => setCrSending(false));
  };

  const handleGitHubClick = () => { window.plausible?.('GitHub Link Click'); };

  const BUILD_TIME = "2026-06-12 15:30";

  return (
    <>
      <div className={`layout${konamiTriggered ? ' konami-' + konamiPhase : ''}${voidThemeActive ? ' void-theme' : ''}${rainbowMode ? ' rainbow-mode' : ''}${voidModePlus ? ' void-plus' : ''}`}>
        <div className="morph-canvas" />
        <div className="grain-canvas" />
        <WeatherField kind={ambience.weatherId || 'clear'} onLightning={lightning} />

        <Nav
          filterTab={filterTab}
          onTabChange={handleTabChange}
          konamiCount={konamiCount}
          foundEggs={foundEggs.length}
          eggTotal={Object.keys(EGG_HINTS).length}
          eggExpanded={eggExpanded}
          onEggToggle={() => {
            const n = eggClicks + 1;
            setEggClicks(n);
            if (n >= 5) { setShowEggHints(true); setEggClicks(0); }
            else setEggExpanded((v) => !v);
          }}
          onOpenPalette={() => setPaletteOpen(true)}
          soundEnabled={sound.enabled}
          onToggleSound={() => sound.toggle()}
          focusMode={focusMode}
          onToggleFocus={() => setFocusMode((v) => !v)}
        />

        <main className="main">
          <div className="tab-content-wrap" key={filterTab}>
            <TabContent
              filterTab={filterTab}
              shuffledPins={shuffledPins}
              openProjectModal={openProjectModal}
              handleCardMouseEnter={handleCardMouseEnter}
              handleCardMouseMove={handleCardMouseMove}
              handleCardMouseLeave={handleCardMouseLeave}
              resetCardTilt={resetCardTilt}
              onNavigate={navigate}
              onGitHubClick={handleGitHubClick}
              onGearClick={() => { setGearSpun(true); markEgg('gear'); }}
              gearSpun={gearSpun}
              CORE_PROJECTS={CORE_PROJECTS}
              PROCESS_DATA={PROCESS_DATA}
              selectedProcessProject={effectiveProcessProject}
              setSelectedProcessProject={setSelectedProcessProject}
              contactTab={contactTab}
              setContactTab={setContactTab}
              formSubmitted={formSubmitted}
              setFormSubmitted={setFormSubmitted}
              formName={formName}
              setFormName={setFormName}
              formEmail={formEmail}
              setFormEmail={setFormEmail}
              formSubject={formSubject}
              setFormSubject={setFormSubject}
              formMessage={formMessage}
              setFormMessage={setFormMessage}
              formError={formError}
              formSending={formSending}
              handleContactSubmit={handleContactSubmit}
              crSubmitted={crSubmitted}
              setCrSubmitted={setCrSubmitted}
              crName={crName}
              setCrName={setCrName}
              crEmail={crEmail}
              setCrEmail={setCrEmail}
              crRepo={crRepo}
              setCrRepo={setCrRepo}
              crPRLink={crPRLink}
              setCrPRLink={setCrPRLink}
              crLanguage={crLanguage}
              setCrLanguage={setCrLanguage}
              crDescription={crDescription}
              setCrDescription={setCrDescription}
              crConcerns={crConcerns}
              setCrConcerns={setCrConcerns}
              crError={crError}
              crSending={crSending}
              handleCodeReviewSubmit={handleCodeReviewSubmit}
              ghStatus={ghStatus}
            />
          </div>

          <footer className="footer" onClick={() => { setFooterClicks((c) => { const n = c + 1; if (n >= 5) { setFooterFunny(true); markEgg('footer'); } return n; }); }}>
            <p>Designed &amp; Built by <span className="footer-name">{PROFILE.name}</span></p>
            <p className="build-time">
              {footerFunny ? 'built with ◈ and ☕ — thanks for noticing!' : `built: ${BUILD_TIME}`} <span className="konami-hint">· ↑↑↓↓←→←→</span>
              {footerClicks > 0 && !footerFunny && <span className="footer-taps"> · {footerClicks}/5</span>}
            </p>
          </footer>
        </main>

        <Console
          username={PROFILE.githubHandle}
          ambience={ambience}
          onWeather={consoleWeather}
          onAuto={consoleAuto}
          onSound={consoleSound}
          onTheme={consoleTheme}
          onSpectacle={consoleSpectacle}
          soundEnabled={sound.enabled}
          open={consoleOpen}
          onToggle={() => setConsoleOpen((v) => !v)}
          onRickroll={consoleRickroll}
        />
        <StatusBar ambience={ambience} gh={ghStatus} />

        {!chatOpen && (
          <div className="chat-toggle-wrap">
            <button className="chat-toggle" onClick={() => setChatOpen(true)} title="Ask AI Assistant" aria-label="Ask AI Assistant">
              <Icon name="sparkle2" size={22} />
            </button>
          </div>
        )}

        <div id="chat-bubble" className={chatOpen ? 'open' : ''}>
          <div className="chat-inner">
            <div className="chat-hdr">
              <span>Ask my AI Assistant</span>
              <button onClick={() => setChatOpen(false)} aria-label="Close chat">✕</button>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.isUser ? 'user' : ''}`}>
                  <div className={`msg-av ${m.isUser ? 'mv-user' : 'mv-bot'}`}>
                    {m.isUser ? 'U' : (
                      <img src="/ai-avatar.svg" alt="" aria-hidden="true" width="28" height="28" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className={`msg-bubble ${m.isUser ? 'mb-user' : 'mb-bot'}`}>{m.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {messages.length === 1 && (
              <div className="chat-quick">
                {['skills', 'projects', 'how to hire?'].map((q) => (
                  <button key={q} onClick={() => setChatInput(q)}>{q}</button>
                ))}
              </div>
            )}
            <form className="chat-inp-row" onSubmit={handleChatSubmit}>
              <input type="text" placeholder="Ask about my skills or certifications..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} enterKeyHint="send" autoCapitalize="none" autoCorrect="off" />
              <button type="submit" aria-label="Send">➤</button>
            </form>
          </div>
        </div>

        {showTopBtn && (
          <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to Top" aria-label="Back to top">
            <Icon name="arrowUp" size={17} />
          </button>
        )}

        {showProjectModal && selectedProject && (
          <ProjectModal
            project={selectedProject}
            origin={modalOrigin}
            onClose={closeProjectModal}
            onNav={projectNav}
            onOpenById={openProjectById}
            onGitHubClick={handleGitHubClick}
          />
        )}
      </div>

      {focusMode && (
        <div className="focus-ribbon">
          <span>FOCUS MODE</span>
          <span>one column, no chrome</span>
          <button onClick={() => setFocusMode(false)}>Exit ⌘⇧F</button>
        </div>
      )}

      {spectacle && (
        <Spectacle
          key={spectacle.key}
          effect={spectacle.effect}
          onDone={() => setSpectacle(null)}
        />
      )}

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          commands={commands}
          onRun={runCommand}
        />
      )}

      {konamiPhase === 'void-swallow' && (
        <div className="void-swallow-overlay">
          <span className="vs-code">◈</span>
          <span className="vs-msg">Swallowed by the void</span>
          <span className="vs-sub">The darkness consumes all...</span>
        </div>
      )}
      {konamiPhase === 'void-revive' && (
        <div className="void-swallow-overlay revive">
          <span className="vs-code">✦</span>
          <span className="vs-msg">Reviving now</span>
          <span className="vs-sub">Returning from the darkness</span>
        </div>
      )}
      {show404 && (
        <div className="easter-404">
          <span className="e404-code">404</span>
          <span className="e404-msg">Page Not Found</span>
          <span className="e404-sub">The Konami code broke reality. Rebooting...</span>
        </div>
      )}
      <div className={`void-sweep${voidSweep ? ' active' : ''}`}>
        <div className="crack-center" />
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="crack-line" />)}
      </div>
      <div className={`static-pop${staticPop ? ' active' : ''}`}>
        <div className="static-inner" />
      </div>
      <div className={`void-bleed${voidBleed ? ' active' : ''}`} style={{ '--bleed-x': `${bleedPos.x}%`, '--bleed-y': `${bleedPos.y}%` }} />

      {showEggHints && (
        <div className="egg-hints-overlay" onClick={() => setShowEggHints(false)}>
          <div className="egg-hints-modal" onClick={(e) => e.stopPropagation()}>
            <div className="egg-hints-hdr">
              <span>🥚 Easter Eggs</span>
              <button onClick={() => setShowEggHints(false)} className="egg-hints-close">✕</button>
            </div>
            <div className="egg-hints-list">
              {Object.entries(EGG_HINTS).map(([key, egg]) => (
                <div key={key} className={`egg-hint-item${egg.found ? ' found' : ''}`}>
                  <span className="egg-hint-icon">{egg.found ? '🔓' : '🔒'}</span>
                  <span className="egg-hint-text">{egg.hint}</span>
                </div>
              ))}
            </div>
            <p className="egg-hints-footer">
              {Object.values(EGG_HINTS).filter((e) => e.found).length}/{Object.keys(EGG_HINTS).length} found
            </p>
          </div>
        </div>
      )}

      {showCredits && (
        <div className="credits-overlay" onClick={() => setShowCredits(false)}>
          <div className="credits-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🔧 Built With</h2>
            <div className="credits-grid">
              {['React 19', 'Vite', 'Tailwind CSS 4', 'EmailJS', 'GitHub API', 'Page Views API', 'Plausible Analytics', 'Google Fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono)', 'CSS Custom Properties', 'IntersectionObserver'].map((t) => <span key={t} className="credit-tag">{t}</span>)}
            </div>
            <p style={{ marginTop: 'var(--sp-4)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--c-ink-3)' }}>Thanks for checking out the credits! 👋</p>
          </div>
        </div>
      )}

      {showLoadingBar && (
        <div className="loading-bar-overlay" onClick={() => setShowLoadingBar(false)}>
          <div className="loading-bar-modal" onClick={(e) => e.stopPropagation()}>
            <p className="loading-bar-title">Loading...</p>
            <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
            <p className="loading-bar-sub">This should only take a moment...</p>
          </div>
        </div>
      )}

      {idleNotif && (
        <div className="idle-notif" onClick={() => { setIdleNotif(false); window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); }}>
          <span className="idle-notif-icon">⏰</span>
          <span className="idle-notif-text">You've been idle for 5 minutes. Want to play a game?</span>
        </div>
      )}

      {duckActive && <div className="duck-container"><div className="duck">🐤</div></div>}

      {voidCreature.show && (
        <div className="void-creature" style={{ left: `${voidCreature.x}%`, top: `${voidCreature.y}%`, '--dir': voidCreature.dir }}>
          <span className="void-creature-body">👾</span>
        </div>
      )}

      {rainbowMode && <div className="rainbow-overlay" />}
      {voidModePlus && <div className="void-plus-overlay" />}
    </>
  );
}
