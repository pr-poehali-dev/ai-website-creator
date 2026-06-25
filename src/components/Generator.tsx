import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AI_MODELS, analyzePrompt, type GeneratedSite } from '@/lib/aiEngine';

const EXAMPLES = [
  'Кофейня «Брю» с бронированием столиков',
  'Интернет-магазин косметики Gloss',
  'Портфолио свадебного фотографа',
  'Онлайн-школа программирования для детей',
  'Стоматологическая клиника с записью онлайн',
  'Агентство недвижимости в Сочи',
  'Ремонт квартир под ключ в Москве',
];

const THINKING_STEPS = [
  { icon: 'ScanText', text: 'Snowball-стеммер: убираю падежи, спряжения, суффиксы…' },
  { icon: 'BrainCircuit', text: 'Сопоставляю стемы с базой триллионов форм слов…' },
  { icon: 'Target', text: 'Определяю тематику и семантическое поле…' },
  { icon: 'Palette', text: 'Подбираю палитру и стиль по цветовым словам…' },
  { icon: 'LayoutTemplate', text: 'Генерирую структуру страниц и секции…' },
  { icon: 'Sparkles', text: 'Собираю готовый сайт…' },
];

interface Props {
  initialPrompt?: string;
}

// ── Живое превью сайта ────────────────────────────────────────────────────────
const SitePreview = ({ result }: { result: GeneratedSite }) => {
  const [activeNav, setActiveNav] = useState('Главная');

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-[#0a0a0f]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[#111118]">
        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <div className="ml-3 flex-1 max-w-sm bg-[#1a1a24] rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
          <Icon name="Lock" size={10} className="text-emerald-400" />
          {result.siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '')}.ru
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Опубликован
        </span>
      </div>

      {/* Site content */}
      <div className="overflow-auto max-h-[640px] text-sm">
        {/* Site nav */}
        <nav className={`flex items-center justify-between px-8 py-4 bg-gradient-to-r ${result.palette.from} ${result.palette.to} bg-opacity-10 sticky top-0 z-10 backdrop-blur-sm`}
          style={{ background: 'rgba(10,10,20,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="font-bold text-white text-base">{result.siteName}</span>
          <div className="hidden sm:flex items-center gap-1">
            {result.navItems.map((n) => (
              <button key={n} onClick={() => setActiveNav(n)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${activeNav === n ? 'text-white bg-white/10' : 'text-white/60 hover:text-white'}`}>
                {n}
              </button>
            ))}
          </div>
          <button className={`text-xs font-semibold px-4 py-1.5 rounded-lg bg-gradient-to-r ${result.palette.from} ${result.palette.to} text-white`}>
            {result.ctaText}
          </button>
        </nav>

        {/* Hero */}
        <div className={`relative px-8 py-16 bg-gradient-to-br ${result.palette.from} ${result.palette.to} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="relative max-w-xl">
            <span className="inline-block text-xs text-white/70 border border-white/20 rounded-full px-3 py-1 mb-4">
              {result.industry}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{result.heroTitle}</h1>
            <p className="text-white/80 mb-6 text-sm leading-relaxed">{result.heroSubtitle}</p>
            <div className="flex flex-wrap gap-2">
              <button className="bg-white text-gray-900 font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors">
                {result.ctaText}
              </button>
              <button className="border border-white/30 text-white text-xs px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
                Узнать больше
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-border">
          {result.stats.map((s, i) => (
            <div key={i} className={`py-6 text-center ${i < result.stats.length - 1 ? 'border-r border-border' : ''}`}>
              <div className="text-xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features / Services */}
        <div className="px-8 py-10">
          <h2 className="text-base font-bold text-white mb-6">{result.sections[1]?.title || 'Наши услуги'}</h2>
          <div className="grid grid-cols-2 gap-3">
            {result.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${result.palette.from} ${result.palette.to} grid place-items-center shrink-0`}>
                  <Icon name={result.sections[0]?.icon || 'Star'} size={14} className="text-white" />
                </div>
                <span className="text-xs text-white/80 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className={`mx-8 mb-8 rounded-xl p-8 bg-gradient-to-r ${result.palette.from} ${result.palette.to} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent)' }} />
          <div className="relative">
            <h3 className="text-base font-bold text-white mb-2">Готовы начать?</h3>
            <p className="text-white/75 text-xs mb-4 max-w-xs">{result.heroSubtitle}</p>
            <button className="bg-white text-gray-900 font-semibold text-xs px-5 py-2.5 rounded-lg">
              {result.ctaText}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-border bg-[#080810]">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm mb-2">{result.siteName}</p>
              <p className="text-xs text-muted-foreground">{result.industry}</p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2"><Icon name="Phone" size={11} /> {result.phone}</div>
              <div className="flex items-center gap-2"><Icon name="Mail" size={11} /> {result.email}</div>
              <div className="flex items-center gap-2"><Icon name="MapPin" size={11} /> {result.address}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-muted-foreground">
            © 2026 {result.siteName}. Сайт создан в Nebula.
          </div>
        </footer>
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────────────────────────────
const Generator = ({ initialPrompt = '' }: Props) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState('nebula-ultra');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'done'>('idle');
  const [thinkStep, setThinkStep] = useState(0);
  const [result, setResult] = useState<GeneratedSite | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (status !== 'thinking') return;
    if (thinkStep >= THINKING_STEPS.length) {
      const site = analyzePrompt(prompt, modelId);
      setResult(site);
      setStatus('done');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      return;
    }
    const model = AI_MODELS.find((m) => m.id === modelId)!;
    const t = setTimeout(() => setThinkStep((s) => s + 1), model.delay);
    return () => clearTimeout(t);
  }, [status, thinkStep, prompt, modelId]);

  const generate = () => {
    if (!prompt.trim()) return;
    setResult(null);
    setThinkStep(0);
    setStatus('thinking');
  };

  const model = AI_MODELS.find((m) => m.id === modelId)!;

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── MODELS ── */}
      <div className="mb-6">
        <p className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Icon name="Brain" size={16} className="text-accent" /> Модель ИИ
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_MODELS.map((m) => (
            <button key={m.id} onClick={() => setModelId(m.id)}
              className={`relative text-left glass rounded-xl p-4 transition-all duration-200 ${modelId === m.id ? 'glow-border ring-1 ring-primary' : 'hover:-translate-y-0.5 opacity-75 hover:opacity-100'}`}>
              {m.badge && (
                <span className={`absolute top-3 right-3 text-[10px] font-bold rounded-full px-2 py-0.5 ${m.badge === 'GOD' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-gradient-to-r from-primary to-accent text-background'}`}>{m.badge}</span>
              )}
              <div className={`w-9 h-9 rounded-lg grid place-items-center mb-3 ${m.id === 'nebula-ultra' ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30' : 'bg-gradient-to-br from-primary/30 to-accent/30'}`}>
                <Icon name={m.icon} size={18} className={m.id === 'nebula-ultra' ? 'text-yellow-400' : 'text-accent'} />
              </div>
              <p className="font-display font-semibold text-sm mb-1">{m.name}</p>
              <p className="text-xs text-muted-foreground leading-snug mb-2">{m.desc}</p>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Icon name="Gauge" size={11} /> IQ {m.iq}
              </span>
              {m.id === 'nebula-ultra' && (
                <div className="mt-2 h-0.5 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full animate-gradient-shift" style={{ backgroundSize: '200% auto' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROMPT ── */}
      <div className="glass glow-border rounded-2xl p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите сайт любыми словами на русском языке. Понимаю все падежи и формы…"
          rows={3}
          className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground resize-none text-base"
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate(); }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Icon name="Sparkles" size={13} className="text-accent" /> {model.name} · {model.speed}
          </span>
          <Button onClick={generate} disabled={!prompt.trim() || status === 'thinking'}
            className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90 disabled:opacity-50">
            {status === 'thinking'
              ? <><Icon name="Loader2" size={16} className="mr-1.5 animate-spin" /> Генерирую…</>
              : <><Icon name="Wand2" size={16} className="mr-1.5" /> Сгенерировать сайт</>}
          </Button>
        </div>
      </div>

      {/* ── EXAMPLES ── */}
      {status === 'idle' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-muted-foreground py-1.5 shrink-0">Примеры:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setPrompt(ex)}
              className="text-xs glass rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* ── THINKING ── */}
      {status === 'thinking' && (
        <div className="glass rounded-2xl p-6 mt-5 animate-fade-in">
          <p className="text-xs font-display font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Icon name="BrainCircuit" size={14} className="text-accent" />
            Nebula Ultra анализирует запрос…
          </p>
          <div className="space-y-3">
            {THINKING_STEPS.map((s, i) => (
              <div key={s.text} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= thinkStep ? 'opacity-100' : 'opacity-25'}`}>
                {i < thinkStep
                  ? <Icon name="CheckCircle2" size={18} className="text-accent shrink-0" />
                  : i === thinkStep
                  ? <Icon name="Loader2" size={18} className="text-primary animate-spin shrink-0" />
                  : <Icon name={s.icon} size={18} className="text-muted-foreground shrink-0" />}
                <span className={i <= thinkStep ? 'text-foreground' : 'text-muted-foreground'}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {status === 'done' && result && (
        <div ref={resultRef} className="mt-6 space-y-5 animate-fade-in">

          {/* AI reasoning */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-sm flex items-center gap-2">
                <Icon name="BrainCircuit" size={16} className="text-accent" /> Анализ ИИ
              </p>
              <span className="font-display font-bold text-gradient text-sm">{result.confidence.toFixed(1)}% уверенности</span>
            </div>
            {/* Confidence bar */}
            <div className="mb-4">
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${result.palette.from} ${result.palette.to} transition-all duration-1000`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span>Уверенность модели</span>
                <span>100%</span>
              </div>
            </div>
            {/* IQ display for Ultra */}
            {modelId === 'nebula-ultra' && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 mb-4">
                <Icon name="Sparkles" size={16} className="text-yellow-400 shrink-0" />
                <div>
                  <p className="text-xs font-display font-bold text-yellow-400">Nebula Ultra активна</p>
                  <p className="text-[11px] text-muted-foreground">Snowball-морфология · 999 999 999 999 999 форм слов · все падежи и спряжения</p>
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-1.5">
              {result.reasoning.map((r) => (
                <div key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Icon name="Check" size={13} className="text-accent shrink-0 mt-0.5" /> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold text-sm flex items-center gap-2">
                <Icon name="Eye" size={16} className="text-accent" /> Живое превью сайта
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="glass rounded-full px-3 py-1 text-muted-foreground">{result.siteType}</span>
                <span className={`rounded-full px-3 py-1 text-white font-medium bg-gradient-to-r ${result.palette.from} ${result.palette.to}`}>
                  {result.palette.name}
                </span>
              </div>
            </div>
            <SitePreview result={result} />
          </div>

          {/* Pages */}
          <div className="glass rounded-2xl p-5">
            <p className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon name="Files" size={15} className="text-accent" /> Страницы сайта
            </p>
            <div className="flex flex-wrap gap-2">
              {result.pages.map((pg) => (
                <span key={pg} className="text-xs rounded-lg px-3 py-1.5 bg-secondary text-foreground flex items-center gap-1.5">
                  <Icon name="File" size={11} className="text-accent" /> {pg}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} variant="secondary" className="rounded-xl">
              <Icon name="RefreshCw" size={15} className="mr-1.5" /> Перегенерировать
            </Button>
            <Button onClick={() => toast.success('Сайт открыт в конструкторе!')} className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
              <Icon name="PencilRuler" size={15} className="mr-1.5" /> Редактировать
            </Button>
            <Button onClick={() => toast.success('Код скопирован!')} variant="outline" className="rounded-xl">
              <Icon name="Download" size={15} className="mr-1.5" /> Экспорт кода
            </Button>
            <Button onClick={() => toast.success('Сайт опубликован на nebula.ru!')} variant="outline" className="rounded-xl">
              <Icon name="Globe" size={15} className="mr-1.5" /> Опубликовать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;