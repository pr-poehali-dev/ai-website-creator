import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NAV = ['Главная', 'Конструктор', 'Шаблоны', 'Мои проекты', 'Документация'];

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

const Index = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <nav className="glass mx-auto mt-4 max-w-6xl rounded-2xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Icon name="Zap" size={18} className="text-background" />
            </div>
            Nebula
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((item, i) => (
              <button
                key={item}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-foreground ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <Button className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90">
            Начать
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative pt-44 pb-28 px-6">
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
            Кнопки работают сразу из коробки
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Сайты с ИИ,<br />
            <span className="text-gradient animate-gradient-shift">которые работают</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Опишите идею — получите готовый сайт с живыми кнопками, формами и интеграциями. Без кода и боли.
          </p>

          {/* PROMPT BOX */}
          <div className="glass glow-border rounded-2xl p-2 max-w-2xl mx-auto flex items-center gap-2 animate-scale-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Icon name="Sparkles" size={20} className="text-accent ml-3 shrink-0" />
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Лендинг для кофейни с формой брони..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-3 text-base"
            />
            <Button className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold hover:opacity-90 shrink-0">
              Создать <Icon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
            Бесплатно · Без карты · 12 000+ сайтов уже создано
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-display font-semibold tracking-wider uppercase text-sm mb-3">Возможности</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl">Всё для запуска <span className="text-gradient">в одном месте</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group glass rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:glow-border cursor-default"
              >
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

      {/* STEPS */}
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

      {/* CTA */}
      <section className="relative px-6 py-24">
        <div className="max-w-4xl mx-auto glass glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-accent/20 blur-[100px] animate-glow-pulse" />
          <div className="relative">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-5">Готовы запустить <span className="text-gradient">свой сайт?</span></h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Присоединяйтесь к тысячам создателей. Первый сайт — за пару минут.</p>
            <Button size="lg" className="rounded-xl bg-gradient-to-r from-primary to-accent text-background font-semibold text-base px-8 h-12 hover:opacity-90">
              Создать сайт бесплатно <Icon name="Rocket" size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-semibold text-foreground">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Icon name="Zap" size={13} className="text-background" />
            </div>
            Nebula
          </div>
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
