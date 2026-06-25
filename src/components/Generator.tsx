import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { AI_MODELS, analyzePrompt, type GeneratedSite } from '@/lib/aiEngine';

const EXAMPLES = [
  'Лендинг для кофейни с бронированием столиков',
  'Интернет-магазин косметики «Глянец»',
  'Портфолио фотографа в тёмных тонах',
  'Сайт онлайн-школы английского языка',
  'Стоматологическая клиника с записью',
];

const THINKING = [
  'Анализирую запрос на русском языке…',
  'Определяю тематику и тип сайта…',
  'Подбираю палитру и структуру…',
  'Генерирую секции и рабочие кнопки…',
  'Собираю готовый сайт…',
];

interface Props {
  initialPrompt?: string;
}

const Generator = ({ initialPrompt = '' }: Props) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState('nebula-ultra');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'done'>('idle');
  const [thinkStep, setThinkStep] = useState(0);
  const [result, setResult] = useState<GeneratedSite | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (status !== 'thinking') return;
    if (thinkStep >= THINKING.length) {
      const site = analyzePrompt(prompt, modelId);
      setResult(site);
      setStatus('done');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      return;
    }
    const t = setTimeout(() => setThinkStep((s) => s + 1), modelId === 'nebula-ultra' ? 320 : 520);
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
      {/* MODELS */}
      <div className="mb-6">
        <p className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Icon name="Brain" size={16} className="text-accent" /> Выберите модель ИИ
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModelId(m.id)}
              className={`relative text-left glass rounded-xl p-4 transition-all duration-200 ${modelId === m.id ? 'glow-border ring-1 ring-primary' : 'hover:-translate-y-0.5 opacity-80 hover:opacity-100'}`}
            >
              {m.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-gradient-to-r from-primary to-accent text-background rounded-full px-2 py-0.5">{m.badge}</span>
              )}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center mb-3">
                <Icon name={m.icon} size={18} className="text-accent" />
              </div>
              <p className="font-display font-semibold text-sm mb-1">{m.name}</p>
              <p className="text-xs text-muted-foreground leading-snug mb-2">{m.desc}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Icon name="Gauge" size={11} /> IQ {m.iq}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PROMPT */}
      <div className="glass glow-border rounded-2xl p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите любой сайт обычными словами на русском…"
          rows={3}
          className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground resize-none text-base"
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate(); }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Sparkles" size={13} className="text-accent" />
            {model.name} · {model.speed}
          </div>
          <Button
            onClick={generate}
            disabled={!prompt.trim() || status === 'thinking'}
            className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {status === 'thinking' ? (
              <><Icon name="Loader2" size={16} className="mr-1.5 animate-spin" /> Генерирую…</>
            ) : (
              <><Icon name="Wand2" size={16} className="mr-1.5" /> Сгенерировать сайт</>
            )}
          </Button>
        </div>
      </div>

      {/* EXAMPLES */}
      {status === 'idle' && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-muted-foreground py-1.5">Примеры:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setPrompt(ex)}
              className="text-xs glass rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* THINKING */}
      {status === 'thinking' && (
        <div className="glass rounded-2xl p-6 mt-5 animate-fade-in">
          <div className="space-y-3">
            {THINKING.map((t, i) => (
              <div key={t} className={`flex items-center gap-3 text-sm transition-opacity ${i <= thinkStep ? 'opacity-100' : 'opacity-30'}`}>
                {i < thinkStep ? (
                  <Icon name="CheckCircle2" size={18} className="text-accent shrink-0" />
                ) : i === thinkStep ? (
                  <Icon name="Loader2" size={18} className="text-primary animate-spin shrink-0" />
                ) : (
                  <Icon name="Circle" size={18} className="text-muted-foreground shrink-0" />
                )}
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {status === 'done' && result && (
        <div ref={resultRef} className="mt-6 space-y-5 animate-fade-in">
          {/* AI reasoning */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold flex items-center gap-2">
                <Icon name="BrainCircuit" size={18} className="text-accent" /> Анализ ИИ
              </p>
              <span className="text-sm font-display font-bold text-gradient">{result.confidence.toFixed(1)}% уверенности</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.reasoning.map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Check" size={14} className="text-accent shrink-0" /> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Site preview */}
          <div className="glass glow-border rounded-2xl overflow-hidden">
            {/* browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
              <span className="w-3 h-3 rounded-full bg-rose-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-3 text-xs text-muted-foreground bg-background/60 rounded-md px-3 py-1 flex-1 max-w-xs truncate">
                {result.siteName.toLowerCase().replace(/\s+/g, '')}.ru
              </div>
              <span className="text-xs text-accent flex items-center gap-1"><Icon name="Wifi" size={12} /> Live</span>
            </div>

            <div className="p-6 md:p-8">
              {/* meta */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                <span className="rounded-full px-3 py-1 bg-secondary text-muted-foreground">{result.siteType}</span>
                <span className="rounded-full px-3 py-1 bg-secondary text-muted-foreground">{result.industry}</span>
                <span className={`rounded-full px-3 py-1 text-background font-medium bg-gradient-to-r ${result.palette.from} ${result.palette.to}`}>Палитра: {result.palette.name}</span>
              </div>

              {/* mock hero */}
              <div className={`rounded-xl p-8 mb-6 bg-gradient-to-br ${result.palette.from} ${result.palette.to} relative overflow-hidden`}>
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="relative">
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">{result.siteName}</h3>
                  <p className="text-white/90 max-w-md mb-5">{result.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.buttons.map((b) => (
                      <span key={b} className="bg-white/95 text-black text-sm font-semibold rounded-lg px-4 py-2">{b}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* sections */}
              <p className="text-sm font-display font-semibold text-muted-foreground mb-3">Сгенерированные секции</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {result.sections.map((s) => (
                  <div key={s.title} className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors">
                    <Icon name={s.icon} size={20} className="text-accent mb-2" />
                    <p className="font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{s.content}</p>
                  </div>
                ))}
              </div>

              {/* features + pages */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-display font-semibold text-muted-foreground mb-2">Функции</p>
                  <div className="flex flex-wrap gap-2">
                    {result.features.map((f) => (
                      <span key={f} className="text-xs rounded-full px-3 py-1 bg-secondary text-foreground flex items-center gap-1">
                        <Icon name="Zap" size={11} className="text-accent" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-muted-foreground mb-2">Страницы</p>
                  <div className="flex flex-wrap gap-2">
                    {result.pages.map((pg) => (
                      <span key={pg} className="text-xs rounded-full px-3 py-1 bg-secondary text-foreground flex items-center gap-1">
                        <Icon name="File" size={11} className="text-accent" /> {pg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap gap-3 px-6 md:px-8 py-5 border-t border-border bg-secondary/30">
              <Button onClick={generate} variant="secondary" className="rounded-xl">
                <Icon name="RefreshCw" size={15} className="mr-1.5" /> Перегенерировать
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
                <Icon name="PencilRuler" size={15} className="mr-1.5" /> Открыть в конструкторе
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Icon name="Download" size={15} className="mr-1.5" /> Экспорт кода
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
