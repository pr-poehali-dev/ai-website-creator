import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Generator from '@/components/Generator';
import { AI_MODELS } from '@/lib/aiEngine';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'builder', label: 'Конструктор' },
  { id: 'templates', label: 'Шаблоны' },
  { id: 'projects', label: 'Мои проекты' },
  { id: 'docs', label: 'Документация' },
];

const FEATURES = [
  { icon: 'Sparkles', title: 'Генерация', desc: 'Опишите идею словами — ИИ соберёт готовый сайт за секунды.', tag: 'AI' },
  { icon: 'Plug', title: 'Интеграции', desc: 'Платежи, формы, CRM и аналитика подключаются в один клик.', tag: 'Connect' },
  { icon: 'Eye', title: 'Превью', desc: 'Живой предпросмотр на любом устройстве в реальном времени.', tag: 'Live' },
  { icon: 'Download', title: 'Экспорт', desc: 'Выгружайте чистый код или публикуйте прямо на домен.', tag: 'Code' },
  { icon: 'Library', title: 'Библиотека', desc: 'Сотни готовых блоков, секций и компонентов под рукой.', tag: 'Blocks' },
  { icon: 'GitBranch', title: 'Версионирование', desc: 'История изменений и откат к любой версии в один клик.', tag: 'History' },
];

const STEPS = [
  { n: '01', t: 'Опишите идею', d: 'Расскажите, какой сайт нужен — обычными словами.' },
  { n: '02', t: 'ИИ соберёт сайт', d: 'Готовый макет с рабочими кнопками за секунды.' },
  { n: '03', t: 'Опубликуйте', d: 'Один клик — и сайт онлайн на вашем домене.' },
];

const TEMPLATES = [
  { name: 'Кофейня', cat: 'Еда', icon: 'Coffee', from: 'from-amber-400', to: 'to-orange-600' },
  { name: 'Магазин', cat: 'E-commerce', icon: 'ShoppingBag', from: 'from-violet-500', to: 'to-fuchsia-500' },
  { name: 'Портфолио', cat: 'Креатив', icon: 'Image', from: 'from-rose-400', to: 'to-pink-600' },
  { name: 'Онлайн-школа', cat: 'Образование', icon: 'GraduationCap', from: 'from-cyan-400', to: 'to-blue-600' },
  { name: 'Клиника', cat: 'Медицина', icon: 'HeartPulse', from: 'from-emerald-400', to: 'to-teal-600' },
  { name: 'IT-стартап', cat: 'Бизнес', icon: 'Cpu', from: 'from-indigo-500', to: 'to-purple-600' },
];

const PROJECTS = [
  { name: 'Кофейня «Зерно»', updated: '2 часа назад', status: 'Опубликован', version: 'v4', icon: 'Coffee' },
  { name: 'Магазин «Глянец»', updated: 'вчера', status: 'Черновик', version: 'v2', icon: 'ShoppingBag' },
  { name: 'Фото-портфолио', updated: '3 дня назад', status: 'Опубликован', version: 'v7', icon: 'Image' },
];

const DOCS = [
  { icon: 'Rocket', title: 'Быстрый старт', desc: 'Создайте первый сайт за 2 минуты.' },
  { icon: 'Sparkles', title: 'Генерация с ИИ', desc: 'Как писать запросы, чтобы получить идеальный результат.' },
  { icon: 'Plug', title: 'Интеграции', desc: 'Подключение оплаты, форм и CRM.' },
  { icon: 'GitBranch', title: 'Версионирование', desc: 'Откат, ветки и история изменений.' },
  { icon: 'Download', title: 'Экспорт и публикация', desc: 'Выгрузка кода и привязка домена.' },
  { icon: 'Code', title: 'API', desc: 'Управляйте сайтами программно.' },
];

const Index = () => {
  const [tab, setTab] = useState('home');
  const [heroPrompt, setHeroPrompt] = useState('');
  const [builderPrompt, setBuilderPrompt] = useState('');
  const builderRef = useRef<HTMLDivElement>(null);

  const goBuilder = (prompt = '') => {
    setBuilderPrompt(prompt);
    setTab('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <nav className="glass mx-auto mt-4 max-w-6xl rounded-2xl px-5 py-3 flex items-center justify-between">
          <button onClick={() => setTab('home')} className="flex items-center gap-2 font-display font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Icon name="Zap" size={18} className="text-background" />
            </div>
            Nebula
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === item.id ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button onClick={() => goBuilder()} className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
            Начать
          </Button>
        </nav>
      </header>

      <main className="pt-28">
        {/* ============ HOME ============ */}
        {tab === 'home' && (
          <div className="animate-fade-in">
            <section className="relative pt-16 pb-28 px-6">
              <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />
              <div className="relative max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
                  <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
                  Кнопки работают сразу из коробки
                </div>
                <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] mb-6">
                  Сайты с ИИ,<br />
                  <span className="text-gradient animate-gradient-shift">которые работают</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Опишите идею — получите готовый сайт с живыми кнопками, формами и интеграциями. ИИ понимает все слова русского языка.
                </p>

                <div className="glass glow-border rounded-2xl p-2 max-w-2xl mx-auto flex items-center gap-2">
                  <Icon name="Sparkles" size={20} className="text-accent ml-3 shrink-0" />
                  <input
                    value={heroPrompt}
                    onChange={(e) => setHeroPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') goBuilder(heroPrompt); }}
                    placeholder="Лендинг для кофейни с формой брони..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-3 text-base"
                  />
                  <Button onClick={() => goBuilder(heroPrompt)} className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90 shrink-0">
                    Создать <Icon name="ArrowRight" size={16} className="ml-1" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Бесплатно · Без карты · 12 000+ сайтов уже создано</p>

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {AI_MODELS.map((m) => (
                    <span key={m.id} className="text-xs glass rounded-full px-3 py-1.5 text-muted-foreground flex items-center gap-1.5">
                      <Icon name={m.icon} size={12} className="text-accent" /> {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative px-6 py-20">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                  <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Возможности</p>
                  <h2 className="font-display font-bold text-4xl md:text-5xl">Всё для запуска <span className="text-gradient">в одном месте</span></h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="group glass rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:glow-border cursor-default">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center transition-transform group-hover:scale-110">
                          <Icon name={f.icon} size={24} className="text-accent" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-3 py-1">{f.tag}</span>
                      </div>
                      <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative px-6 py-20">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                  <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Как это работает</p>
                  <h2 className="font-display font-bold text-4xl md:text-5xl">Три шага до сайта</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {STEPS.map((s) => (
                    <div key={s.n} className="relative glass rounded-2xl p-8">
                      <div className="font-display font-bold text-6xl text-gradient mb-4 opacity-90">{s.n}</div>
                      <h3 className="font-display font-semibold text-xl mb-2">{s.t}</h3>
                      <p className="text-muted-foreground">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="relative px-6 py-24">
              <div className="max-w-4xl mx-auto glass glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-accent/20 blur-[100px] animate-glow-pulse" />
                <div className="relative">
                  <h2 className="font-display font-bold text-4xl md:text-5xl mb-5">Готовы запустить <span className="text-gradient">свой сайт?</span></h2>
                  <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Присоединяйтесь к тысячам создателей. Первый сайт — за пару минут.</p>
                  <Button onClick={() => goBuilder()} size="lg" className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold text-base px-8 h-12 hover:opacity-90">
                    Создать сайт бесплатно <Icon name="Rocket" size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============ BUILDER ============ */}
        {tab === 'builder' && (
          <section ref={builderRef} className="relative px-6 py-16 animate-fade-in min-h-screen">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/15 blur-[120px]" />
            <div className="relative max-w-5xl mx-auto text-center mb-10">
              <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Конструктор</p>
              <h1 className="font-display font-bold text-4xl md:text-6xl mb-4">ИИ-генератор <span className="text-gradient">сайтов</span></h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Опишите сайт обычными словами — Nebula поймёт любой запрос на русском и соберёт готовый макет.</p>
            </div>
            <Generator initialPrompt={builderPrompt} />
          </section>
        )}

        {/* ============ TEMPLATES ============ */}
        {tab === 'templates' && (
          <section className="relative px-6 py-16 animate-fade-in min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Шаблоны</p>
                <h1 className="font-display font-bold text-4xl md:text-6xl mb-4">Начните с <span className="text-gradient">готового</span></h1>
                <p className="text-muted-foreground text-lg">Выберите шаблон — ИИ адаптирует его под вашу идею.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TEMPLATES.map((t) => (
                  <div key={t.name} className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:glow-border">
                    <div className={`h-40 bg-gradient-to-br ${t.from} ${t.to} relative grid place-items-center`}>
                      <div className="absolute inset-0 grid-bg opacity-20" />
                      <Icon name={t.icon} size={48} className="text-white relative" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-muted-foreground">{t.cat}</span>
                      <h3 className="font-display font-semibold text-lg mb-3">{t.name}</h3>
                      <Button onClick={() => goBuilder(`Сайт «${t.name}» в категории ${t.cat}`)} className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
                        Использовать
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ PROJECTS ============ */}
        {tab === 'projects' && (
          <section className="relative px-6 py-16 animate-fade-in min-h-screen">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="font-display font-bold text-3xl md:text-5xl mb-2">Мои проекты</h1>
                  <p className="text-muted-foreground">Управляйте сайтами и версиями.</p>
                </div>
                <Button onClick={() => goBuilder()} className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
                  <Icon name="Plus" size={16} className="mr-1" /> Новый
                </Button>
              </div>
              <div className="space-y-3">
                {PROJECTS.map((p) => (
                  <div key={p.name} className="glass rounded-2xl p-5 flex items-center gap-4 hover:glow-border transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center shrink-0">
                      <Icon name={p.icon} size={22} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold">{p.name}</h3>
                        <span className="text-[11px] rounded-full px-2 py-0.5 bg-secondary text-muted-foreground flex items-center gap-1">
                          <Icon name="GitBranch" size={10} /> {p.version}
                        </span>
                        <span className={`text-[11px] rounded-full px-2 py-0.5 ${p.status === 'Опубликован' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{p.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Изменён {p.updated}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button onClick={() => goBuilder(`Открыть проект ${p.name}`)} variant="ghost" size="icon" className="rounded-lg"><Icon name="Pencil" size={16} /></Button>
                      <Button onClick={() => toast.success('История версий открыта')} variant="ghost" size="icon" className="rounded-lg"><Icon name="History" size={16} /></Button>
                      <Button onClick={() => toast.success('Сайт открыт в превью')} variant="ghost" size="icon" className="rounded-lg"><Icon name="ExternalLink" size={16} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ DOCS ============ */}
        {tab === 'docs' && (
          <section className="relative px-6 py-16 animate-fade-in min-h-screen">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Документация</p>
                <h1 className="font-display font-bold text-4xl md:text-6xl mb-4">Всё, что нужно <span className="text-gradient">знать</span></h1>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {DOCS.map((d) => (
                  <button key={d.title} onClick={() => toast.info(`Раздел «${d.title}» скоро откроется`)} className="text-left group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-border">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon name={d.icon} size={20} className="text-accent" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-1">{d.title}</h3>
                    <p className="text-sm text-muted-foreground">{d.desc}</p>
                    <span className="text-sm text-accent flex items-center gap-1 mt-3">Читать <Icon name="ArrowRight" size={14} /></span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-10 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <button onClick={() => setTab('home')} className="flex items-center gap-2 font-display font-semibold text-foreground">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Icon name="Zap" size={13} className="text-background" />
            </div>
            Nebula
          </button>
          <p>© 2026 Nebula. Создавайте сайты с ИИ.</p>
          <div className="flex gap-4">
            <Icon name="Github" size={18} className="hover:text-foreground transition-colors cursor-pointer" />
            <Icon name="Twitter" size={18} className="hover:text-foreground transition-colors cursor-pointer" />
            <Icon name="Send" size={18} className="hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
